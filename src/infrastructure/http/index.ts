import 'reflect-metadata'; // necessário para tsyringe e decorators
import { createServer } from './server';

createServer()
    .then(() => console.log('Servidor inicializado com sucesso!'))
    .catch(err => console.error('Erro ao iniciar servidor:', err));
