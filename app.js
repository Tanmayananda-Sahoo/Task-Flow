import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRoutes from './src/routes/auth.routes.js';
import projectRoutes from './src/routes/project.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use('/v1/users', userRoutes);
app.use('/v1/projects', projectRoutes);

export default app;
