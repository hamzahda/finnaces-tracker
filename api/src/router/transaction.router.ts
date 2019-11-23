/** Package imports */
import { Router } from "express";
import { TransactionController } from "../controller/transaction.controller";
import { transactionTagRouter } from "./transaction-tag.router";

/** Variables */
export const transactionRouter: Router = Router({ mergeParams: true });

/** Transaction-Tag routes */
transactionRouter.use("/:transactionId/tag", transactionTagRouter);

/** Routes */
transactionRouter.get("/", TransactionController.getAllTransactions);
transactionRouter.post("/", TransactionController.createTransaction);
transactionRouter.get(
  "/:transactionId",
  TransactionController.getSingleTransaction
);
transactionRouter.delete(
  "/:transactionId",
  TransactionController.deleteTransaction
);
transactionRouter.patch(
  "/:transactionId",
  TransactionController.patchTransaction
);
