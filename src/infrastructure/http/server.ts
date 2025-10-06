import express from 'express';
import cors from 'cors';

export const createServer = async () => {
  const app = express();
  const port = 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
  });

  // Iniciar servidor
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });

  return app;
};
