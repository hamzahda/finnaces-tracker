/** Package imports */
import { Router } from "express";
import { tagRouter } from "./tag.router";
import { transactionRouter } from "./transaction.router";
import { userRouter } from "./user.router";
import { logTime } from "../module/logger";
import { Authentication } from "../module/authentication";

/** Variables */
export const globalRouter: Router = Router({ mergeParams: true });

/** Routes */
globalRouter.use("/tag", Authentication.verifyAccess, tagRouter);
globalRouter.use("/transaction",Authentication.verifyAccess,logTime,transactionRouter);
globalRouter.use("/user", userRouter);
