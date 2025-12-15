// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
import webhookRoutes from './routes/webhook.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/webhook', webhookRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor Bot escuchando en puerto ${PORT}`);
});