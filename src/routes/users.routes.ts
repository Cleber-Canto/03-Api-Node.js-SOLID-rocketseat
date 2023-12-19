import { FastifyInstance } from 'fastify';
import { verifyJwt } from '@/shared/middlewares/verify-jwt';
import { authenticate } from '../controllers/users/authenticate';
import { profile } from '../controllers/users/profile';
import { register } from '../controllers/users/register';
import { refresh } from '../controllers/users/refresh';

export async function usersRoutes(app: FastifyInstance) {
    app.post('/users', register);
    app.post('/sessions', authenticate);
  
    app.patch('/token/refresh', refresh);
  
    /** Authenticated */
    app.get('/me', { onRequest: [verifyJwt] }, profile);
}