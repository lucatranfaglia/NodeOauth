import express from 'express';
import validateResources from '../middleware/validateResource';
import { createUserSchema, forgotPasswordSchema, resetPasswordSchema, verifyUserSchema } from '../schema/user.schema';
import { createUserHandler, forgotPasswordHandler, resetPasswordHandler, verifyUserHandler } from '../controller/user.controller';
const router = express.Router();

/**
  Create User
 */
router.post(
  "api/users",
  validateResources(createUserSchema),
  createUserHandler
);

/**
  Verify User
 */
router.post(
  "api/users/verify/:id/:verificationCode",
  validateResources(verifyUserSchema),
  verifyUserHandler
);


/**
  Forgot password
 */
router.post(
  "api/users/forgotpassword",
  validateResources(forgotPasswordSchema),
  forgotPasswordHandler
)

/**
  Reset password
 */
router.post(
  "api/users/resetpassword/:id/:passwordResetCode",
  validateResources(resetPasswordSchema),
  resetPasswordHandler
)

export default router;  