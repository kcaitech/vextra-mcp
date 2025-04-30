import { Router } from 'express';
import { exampleController } from '../controllers/exampleController';
import { translateController } from '../controllers/translateController';
import { fileContextController } from '../controllers/fileContextController';

const router = Router();

const v1Router = Router();
v1Router.get('/example', exampleController);
v1Router.get('/translate', translateController);
v1Router.get('/:fileKey', fileContextController);

router.use('/v1', v1Router);

export default router;