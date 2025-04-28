import express, { Request, Response } from 'express';
import { config } from './config';
import { requestLogger } from './middlewares/logger';
import { errorHandler } from './middlewares/errorHandler';
import router from './routes';

const app = express();
const port = 3002;

app.use(requestLogger);

app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript server!');
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});