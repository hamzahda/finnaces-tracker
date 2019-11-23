/** Package imports */
import { Router } from 'express';
import { TransactionTagController } from '../controller/transaction-tag.controller';

/** Variables */
export const transactionTagRouter: Router = Router({ mergeParams: true });

/** Routes */
transactionTagRouter.post('/:tagId', TransactionTagController.addTagToTransaction);
transactionTagRouter.delete('/:tagId', TransactionTagController.removeTagFromTransaction);
