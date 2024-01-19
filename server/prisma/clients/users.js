import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.post('/api/verificarUsuario', async (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    const participante = await prisma.participantes.findUnique({
      where: {
        usuario: usuario,
        contrasena: contrasena
      },
    });

    if (!participante) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (participante.contrasena !== contrasena) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    res.json(participante);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error al verificar al usuario' });
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});