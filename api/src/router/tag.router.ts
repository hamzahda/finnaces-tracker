/** Package imports */
import { Router } from 'express';
import { TagController } from '../controller/tag.controller';

/** Variables */
export const tagRouter: Router = Router({ mergeParams: true });

/** Routes */
tagRouter.get('/', TagController.getAllTags);
tagRouter.post('/', TagController.createTag);
tagRouter.get('/:tagId', TagController.getSingleTag);
tagRouter.delete('/:tagId', TagController.deleteTag);
tagRouter.patch('/:tagId', TagController.patchTag);
