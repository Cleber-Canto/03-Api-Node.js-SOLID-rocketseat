import { FastifyInstance } from 'fastify';
import { verifyJwt } from '@/shared/middlewares/verify-jwt';
import { search } from '../controllers/gyms/search';
import { nearby } from '../controllers/gyms/nearby';
import { create } from '../controllers/gyms/create';
import { verifyUserRole } from '@/shared/middlewares/verify-user-role';

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJwt);

    app.get('/gyms/search', search);
    app.get('/gyms/nearby', nearby);

    app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create);
}