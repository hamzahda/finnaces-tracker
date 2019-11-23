import { Tag } from "./../entity/Tag";
import { User } from "./../entity/User";
import { Request, Response, NextFunction } from "express";
import { Repository, getRepository } from "typeorm";
import { Transaction } from "../entity/Transaction";
import { validate } from "class-validator";

export class TransactionController {
  /**
   * Get all transactions
   * TODO: Error handling
   *
   * @param {Request} req Request
   * @param {Response} res Response
   * @param {NextFunction} next NextFunction
   * @returns {Promise<void>}
   */
  public static async getAllTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const transactionRepository: Repository<Transaction> = getRepository(
      Transaction
    );
    const transactions: Transaction[] = await transactionRepository
      .createQueryBuilder("transaction")
      .leftJoinAndSelect("transaction.tags", "tags")
      .leftJoin("transaction.user", "user")
      .where("user.id=:id", { id: req.token.id })
      .getMany();
    res.send({ status: "ok", data: transactions });
  }

  /**
   * Create a transaction
   * Required body attributes: name, value, type
   * Optional body attributes: description
   * - Validate if all necessary fields are added
   * Return 400 if something is incorrect
   * - Create transaction
   * TODO: Error handling if create transaction fails
   *
   * @param {Request} req Request
   * @param {Response} res Response
   * @param {NextFunction} next NextFunction
   * @returns {Promise<void>}
   */
  public static async createTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    let { name, value, description, type, tags } = req.body;
    let dbTags = [];

    const checkExisiting = async tagName => {
      const existingTag = await getRepository(Tag).findOne({
        where: { label: tagName }
      });
      if (existingTag) {
        return existingTag;
      }
      const enTag = new Tag();
      enTag.label = tagName;

      return enTag;
    };

    console.log(tags);
    if (tags) {
      dbTags = await Promise.all(
        tags.reduce((prev, tag) => {
          if (tag.id) {
            prev.push(getRepository(Tag).findOne(tag.id));
          }
          if (tag.label) {
            prev.push(checkExisiting(tag.label));
          }
          return prev;
        }, [])
      );
    }

    let transaction = new Transaction();
    transaction.name = name;
    transaction.value = value;
    transaction.description = description;
    transaction.type = type;
    transaction.user = await getRepository(User).findOne(req.token!.id);
    transaction.tags = dbTags;

    const errors = await validate(transaction);
    if (errors.length > 0) {
      res.status(400).send({ status: "bad_request" });
      return;
    }

    const transactionRepository: Repository<Transaction> = getRepository(
      Transaction
    );
    const createdTransaction: Transaction = await transactionRepository.save(
      transaction
    );

    res.send({ status: "ok", data: createdTransaction });
  }

  /**
   * Get a transaction by id
   * Required params: transactionId
   * Return 404 if transaction not found
   *
   * @param {Request} req Request
   * @param {Response} res Response
   * @param {NextFunction} next NextFunction
   * @returns {Promise<void>}
   */
  public static async getSingleTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const transactionId: string = req.params.transactionId;
    const transactionRepository: Repository<Transaction> = getRepository(
      Transaction
    );

    try {
      const transaction: Transaction = await transactionRepository.findOneOrFail(
        transactionId
      );
      res.send({ status: "ok", data: transaction });
    } catch (error) {
      res.status(404).send({ status: "not_found" });
    }
  }

  /**
   * Delete a transaction by id
   * Required params: transactionId
   * Return 404 if transaction doesn't exist
   * - Delete transaction
   *
   * @param {Request} req Request
   * @param {Response} res Response
   * @param {NextFunction} next NextFunction
   * @returns {Promise<void>}
   */
  public static async deleteTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const transactionId: string = req.params.transactionId;
    const transactionRepository: Repository<Transaction> = getRepository(
      Transaction
    );

    try {
      const transaction: Transaction = await transactionRepository.findOneOrFail(
        transactionId
      );
      await transactionRepository.remove(transaction);
      res.send({ status: "ok" });
    } catch (error) {
      res.status(404).send({ status: "not_found" });
    }
  }

  /**
   * Update values of a transaction by id
   * Allowed attributes: name, value, description, type
   * Return 404 if transaction not found
   * TODO: Validation of attributes
   *
   * @param {Request} req Request
   * @param {Response} res Response
   * @param {NextFunction} next NextFunction
   * @returns {Promise<void>}
   */
  public static async patchTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const transactionId: string = req.params.transactionId;
    let { name, value, description, type } = req.body;

    const transactionRepository: Repository<Transaction> = getRepository(
      Transaction
    );

    try {
      let transaction: Transaction = await transactionRepository.findOneOrFail(
        transactionId
      );
      transaction.name = name;
      transaction.value = value;
      transaction.description = description;
      transaction.type = type;

      transaction = await transactionRepository.save(transaction);
      res.send({ status: "ok", data: transaction });
    } catch (error) {
      res.status(404).send({ status: "not_found" });
    }
  }
}
