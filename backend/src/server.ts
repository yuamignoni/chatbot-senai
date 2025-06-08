// src/server.ts
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes'; 

dotenv.config(); 

const app = express();
app.use(express.json()); 

const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.send('API de Login em construção!');
});


app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});