import { Request, Response, NextFunction } from 'express';
import { Repository, getRepository } from 'typeorm';
import { Transaction } from '../entity/Transaction';
import { Tag } from '../entity/Tag';

export class TransactionTagController {
  /**
   * Add a given tag by id to a transaction by id
   * Return 404 if tag not found
   * Return 404 if transaction not found
   * - check if Tag and transaction exists
   * - check if the tag is already added to the transaction
   * - if tag is not added, save it
   *
   * @param {Request} req Request
   * @param {Response} res Response
   * @param {NextFunction} next NextFunction
   * @returns {Promise<void>}
   */
  public static async addTagToTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    const tagId: string = req.params.tagId;
    const transactionId: string = req.params.transactionId;

    const transactionRepository: Repository<Transaction> = getRepository(Transaction);
    const tagRepository: Repository<Tag> = getRepository(Tag);

    try {
      const tag: Tag = await tagRepository.findOneOrFail(tagId);
      let transaction: Transaction = await transactionRepository.findOneOrFail(transactionId);

      // Check if tag already exists in transaction
      if (!transaction.tags.some((addedTag: Tag) => addedTag.id === tagId)) {
        transaction.tags.push(tag);
        transaction = await transactionRepository.save(transaction);
      }

      res.send({ status: 'ok', data: transaction });
    } catch (e) {
      res.status(404).send({ status: 'not_found' });
    }
  }

  /**
   * Remove a given tag by id from a transaction by id
   * - Returns 404 if transaction not found
   * - Filter all tags and return only the tags that don't have the tagId that should be removed
   * - Save updated array to remove the tag from the jointable
   *
   * @param {Request} req Request
   * @param {Response} res Response
   * @param {NextFunction} next NextFunction
   * @returns {Promise<void>}
   */
  public static async removeTagFromTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    const tagIdToRemove: string = req.params.tagId;
    const transactionId: string = req.params.transactionId;

    const transactionRepository: Repository<Transaction> = getRepository(Transaction);

    try {
      let transaction: Transaction = await transactionRepository.findOneOrFail(transactionId);
      transaction.tags = transaction.tags.filter((transactionTag: Tag) => transactionTag.id !== tagIdToRemove);
      transaction = await transactionRepository.save(transaction);
      res.send({ status: 'ok', data: transaction });
    } catch (e) {
      res.status(404).send({ status: 'not_found' });
    }
  }
}
