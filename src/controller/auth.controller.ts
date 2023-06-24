import express, { Request, Response } from "express";
import log from "../utils/logger";
import { nanoid } from "nanoid";
import { CreateSessionInput } from "../schema/auth.schema";
import { findUserByEmail, findUserById } from "../services/user.service";
import { findSessionById, signAccessToken, signRefreshToken } from "../services/auth.service";
import { verifyJwt } from "../utils/jwt";
import { get } from "lodash";
import { decode } from "jsonwebtoken";


/**
 * Create Session
 * @param req 
 * @param res 
 * @returns 
 */
export async function createSessionHandler(req: Request<{},{}, CreateSessionInput>, res: Response){
  const {email, password} = req.body;

  let user;
  try {
    user = await findUserByEmail(email); 

    if(!user){
      return res.send("Invalid email or password");
    }
    if(!user.verified){
      return res.send("Verify your email");
    }
  } catch (error: any) {
    if (error.code===11000){
      return res.status(409).send("Account already exists");
    }
    return res.status(500).send(error)
  }

  // -------------------------------------------------------
  let isValid;
  try {
    isValid = await user.validatePassword(password);

    if(!isValid){
      return res.send("Invalid email or password");
    }
    
    
  } catch (error: any) {
    if (error.code===11000){
      return res.status(409).send("Account already exists");
    }
    return res.status(500).send(error)
  }

  // -------------------------------------------------------
  // sign a access token
  let accessToken;
  try {
    accessToken = await signAccessToken(user);
  } catch (error) {
    return res.status(500).send(error)
  }
  // -------------------------------------------------------
  // sign a refresh token
  let refreshToken;
  try {
    refreshToken = await signRefreshToken({"userId": user._id.toString()});
  } catch (error) {
    return res.status(500).send(error)
  }
  // -------------------------------------------------------
  // send a refresh token
  return res.send({
    accessToken,
    refreshToken
  });
}

/**
 * 
 * @param req 
 * @param res 
 */
export async function refreshAccessTokenHandler(req: Request, res: Response){
  const refreshToken = get(req, 'headers.x-refresh', '');

  // -----------------------------------------------------------------
  const decoded = verifyJwt<{session: string}>(refreshToken.toString(), "refreshTokenPublicKey");
  if(!decoded){
    return res.status(401).send("Unable to update the access token!");
  }
  // -----------------------------------------------------------------
  const session = await findSessionById(decoded.session);
  if(!session || !session.valid){
    return res.status(401).send("Unable to update the access token!");
  }
  // -----------------------------------------------------------------
  const user = await findUserById(String(session.user))
  if(!user){
    return res.status(401).send("Unable to update the access token!");
  }
  // -----------------------------------------------------------------
  const accessToken = signAccessToken(user)

  return res.send({accessToken})
}