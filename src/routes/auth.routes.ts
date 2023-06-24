import express from 'express';
import validateResources from '../middleware/validateResource';
import { createSessionHandler, refreshAccessTokenHandler } from '../controller/auth.controller';
import { createSessionSchema } from '../schema/auth.schema';
const router = express.Router();


/**
  Create User
 */
router.post(
  "/api/session",
  validateResources(createSessionSchema),
  createSessionHandler
);

/**
  Create User
 */
router.post(
  "/api/session/refresh",
  refreshAccessTokenHandler
); 


export default router;  