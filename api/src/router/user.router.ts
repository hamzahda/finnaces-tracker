/** Package imports */
import { Router } from 'express';
import { UserController } from '../controller/user.controller';
import { Authentication } from '../module/authentication';

/** Variables */
export const userRouter: Router = Router({ mergeParams: true });

/** Routes */
userRouter.get('/', Authentication.verifyAccess, UserController.getUsersFromExternalApi);
userRouter.post('/', UserController.createUser);
userRouter.post('/token', UserController.loginUser);
