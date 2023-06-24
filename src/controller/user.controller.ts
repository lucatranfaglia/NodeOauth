import express, { Request, Response } from "express";
import { CreateUserInput, ForgotPasswordInput, ResetPasswordInput, VerifyUserInput } from "../schema/user.schema";
import { createUser, findUserById, findUserByEmail  } from "../services/user.service";
import sendEmail from "../utils/mailer";
import log from "../utils/logger";
import { nanoid } from "nanoid";


/**
 * Create User and send email
 * @param req : body
 * @param res 
 * @returns 
 */
export async function createUserHandler(req: Request<{},{}, CreateUserInput>, res: Response){
  const body = req.body;
  try {
    const user = await createUser(body);
    await sendEmail({
      from: 'tst@exampl.com',
      to: user.email,
      subject: "please verify your account",
      text: `verification code ${user.verificationCode}. Id: ${user._id}`
    });
    return res.send("User successfully created.");
  } catch (error: any) {
    if (error.code===11000){
      return res.status(409).send("Account already exists");
    }
    return res.status(500).send(error)
  }
}

// ------------------------------------------------------------------
/**
 * Verify user
 * @param req : params.id, params.verificationCode
 * @param res 
 * @returns 
 */
export async function verifyUserHandler(req: Request<VerifyUserInput>, res: Response){
  
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  // find the user by id
  const user  = await findUserById(id);
  // ---------------------------------------------------
  // 1. Check 
  if(!user){
    return res.send('Could not erify user');
  }
  // ---------------------------------------------------
  // 2. Check to see if they are already verified
  if(user.verified){
    return res.send('User is already verified');
  }
  // ---------------------------------------------------
  // 3. Check to see if the verificationCode matches 
  if(user.verificationCode===verificationCode){
    user.verified= true;
    await user.save();
    return res.send("User successfully verified");
  }

  return res.send("Could not verify user");
}

// ------------------------------------------------------------------
/**
 * Forgot password
 * @param req : req.body.email
 * @param res 
 * @returns 
 */
export async function forgotPasswordHandler(req: Request<{},{}, ForgotPasswordInput>, res: Response){
  const {email} = req.body;

  const message = "If a user with that email is registered you will receive a password reset email!";
  const user = await findUserByEmail(email);

  if(!user){
    log.debug(`User with email ${email}, does not exists!`);
    return res.send(message);
  }

  if(!user.verified){
    return res.send("User id not verified!");
  }

  // random string
  const passwordResetCode = nanoid();

  user.passwordResetCode = passwordResetCode;

  // TODO: save new passwordResetCode
  await user.save();

  await sendEmail({
    to: user.email,
    from: "test@example.com",
    subject: "Reset your paswword",
    text: `Paswword reset code: ${passwordResetCode}. Id ${user._id}`,

  })
  log.debug(`Password reset email sent to ${email}`);
  return res.send(message);
}

// ------------------------------------------------------------------
/**
 * Reset password
 * @param req 
 * @param res 
 * @returns 
 */
export async function resetPasswordHandler(req: Request<ResetPasswordInput["params"],{}, ResetPasswordInput["body"]>, res: Response){

  const {id, passwordResetCode} = req.params;
  const {password} = req.body;
  let user;
  try {
    user = await findUserById(id);    
  } catch (error) {
    return res.status(500).send(`findUserById: ${error}`);
  }

  if(!user || !user.passwordResetCode || user.passwordResetCode!==passwordResetCode){
    return res.status(400).send("Could not reset user password")
  }

  // reimposto il cmapo passwordResetCode a null
  user.passwordResetCode = null;
  // update new password
  user.password = password;

  try {
    await user.save();    
  } catch (error) {
    return res.status(500).send(`user.save: ${error}`);
  }

  return res.send("Successfully updated password!")
}

// ------------------------------------------------------------------
/**
 * Return user locals
 * @param req 
 * @param res 
 * @returns 
 */
export async function getCurrentUserHandler(req: Request, res: Response){
  return res.send(res.locals.user);
}


export default createUserHandler;