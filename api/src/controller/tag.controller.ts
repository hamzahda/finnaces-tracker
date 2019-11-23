import { NextFunction, Response, Request } from 'express';
import { getRepository, Repository } from 'typeorm';
import { Tag } from '../entity/Tag';
export class TagController {
  /**
   * Get all available tags
   * TODO: Error handling if something fails
   * 
   * @param {Request} req Request
   * @param {Response} res Response
   * @param {NextFunction} next NextFunction
   * @returns {Promise<void>}
   */
  public static async getAllTags(req: Request, res: Response, next: NextFunction): Promise<void> {
    const tagRepository: Repository<Tag> = getRepository(Tag);
    const tags: Tag[] = await tagRepository.find();
    res.send({ status: 'ok', data: tags });
  }

  /**
   * Create a new tag
   * Required fields in body: name
   * TODO: Error handling if tag creation fails
   * TODO: Validation of attributes
   * 
   * @param {Request} req Request
   * @param {Response} res Response
   * @param {NextFunction} next NextFunction
   * @returns {Promise<void>}
   */
  public static async createTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    let { name } = req.body;

    let tag = new Tag();
    tag.name = name;

    const tagRepository: Repository<Tag> = getRepository(Tag);
    const createdTag: Tag = await tagRepository.save(tag);

    res.send({ status: 'ok', data: createdTag });
  }

  /**
   * Get a single tag by its id
   * - Required params: id
   * - Return 404 if not found
   *
   * @param {Request} req Request
   * @param {Response} res Response
   * @param {NextFunction} next NextFunction
   * @returns {Promise<void>}
   */
  public static async getSingleTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    const tagId: string = req.params.tagId;
    const tagRepository: Repository<Tag> = getRepository(Tag);

    try {
      const tag: Tag = await tagRepository.findOneOrFail(tagId);
      res.send({ status: 'ok', data: tag });
    } catch (error) {
      res.status(404).send({ status: 'not_found' });
    }
  }

  /**
   * Delete a tag by its id
   * - Required params: id
   * - Returns 404 if not found
   *
   * @param {Request} req Request
   * @param {Response} res Response
   * @param {NextFunction} next NextFunction
   * @returns {Promise<void>}
   */
  public static async deleteTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    const tagId: string = req.params.tagId;
    const tagRepository: Repository<Tag> = getRepository(Tag);

    try {
      const tag: Tag = await tagRepository.findOneOrFail(tagId);
      await tagRepository.remove(tag);
      res.send({ status: 'ok' });
    } catch (error) {
      res.status(404).send({ status: 'not_found' });
    }
  }

  /**
   * Update attributes of a tag by its id
   * - Attributes that can be updated: name
   * - Returns 404 if not found
   * TODO: Validation of attributes
   * 
   * @param {Request} req Request
   * @param {Response} res Response
   * @param {NextFunction} next NextFunction
   * @returns {Promise<void>}
   */
  public static async patchTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    const tagId: string = req.params.tagId;
    let { name } = req.body;

    const tagRepository: Repository<Tag> = getRepository(Tag);

    try {
      let tag: Tag = await tagRepository.findOneOrFail(tagId);
      tag.name = name;

      tag = await tagRepository.save(tag);
      res.send({ status: 'ok', data: tag });
    } catch (error) {
      res.status(404).send({ status: 'not_found' });
    }
  }
}
