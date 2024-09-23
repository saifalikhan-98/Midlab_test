import express from 'express';
import './config/env';
import { json } from 'body-parser';
import cors from 'cors';
import router from './routes/api';
import { errorHandler } from './utils/errorHandler';
import { connectDatabase } from './config/database';

const app = express();

app.use(cors());
app.use(json());

app.use('/api', router);

app.use(errorHandler);

connectDatabase().then(() => {
    // Start your server or perform other initialization steps
    app.listen(process.env.PORT, () => console.log('Server is running on port 3000'));
  }).catch(error => {
    console.error('Unable to start the application:', error);
    process.exit(1);
  });

export default app;