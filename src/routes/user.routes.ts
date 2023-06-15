import express from 'express';
import validateResources from '../middleware/validateResource';
import { createUserSchema } from '../schema/user.schema';
import { createUserHandler } from '../controller/user.controller';
const router = express.Router();

router.post("api/users", validateResources(createUserSchema), createUserHandler)


export default router;  