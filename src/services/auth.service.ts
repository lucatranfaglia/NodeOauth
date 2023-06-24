import { User, privateFields } from "../model/user.model";
import {DocumentType} from "@typegoose/typegoose";
import signJwt from "../utils/jwt";
import SessionModel from "../model/session.model";
import { omit } from "lodash";

/**
 * Sign access token
 * @param user 
 * @returns 
 */
export async function signAccessToken(user: DocumentType<User>){
  const payload = omit(user.toJSON(), privateFields);

  try {
    const accessToken = signJwt(payload, "accessTokenPrivateKey", {expiresIn: "15m"});
    return accessToken;    
  } catch (error) {
    throw new Error(`signAccessToken: ${error}`);
  }

} 

// -----------------------------------------------------------------
// -----------------------------------------------------------------

/**
 * Create session
 * @param userId: string 
 * @returns 
 */
export function createSession({userId}: {userId: string}){
  return SessionModel.create({"user": userId});
}

// -----------------------------------------------------------------
/**
 * Sign access token
 * @param user 
 * @returns 
 */
export async function signRefreshToken({userId}: {userId: string}){
  let session;
  try {
    session = createSession({userId});
  } catch (error) {
    throw new Error(`signRefreshToken - createSession: ${error}`);
  }
  // -----------------------------------------------------------------
  try {
    const refreshToken = signJwt({
      session: (await session)._id}, 
      "refreshTokenPrivate",
      {
        expiresIn: "1y"
      }
    );
    return refreshToken;        
  } catch (error) {
    throw new Error(`signRefreshToken - signJwt: ${error}`);
  }
} 

// -----------------------------------------------------------------
/**
 * Find session by id (session)
 * @param id : string
 * @returns 
 */
export async function findSessionById(id: string){
  return SessionModel.findById(id);
}



export default signAccessToken;