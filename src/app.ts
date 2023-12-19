import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import fastify from 'fastify';
import { ZodError } from 'zod';
import { env } from '@/env';
import { usersRoutes } from '@/routes/users.routes';
import { gymsRoutes } from '@/routes/gyms.routes';
import { checkInsRoutes } from '@/routes/check-ins.routes';

export const app = fastify();

// Registrar os plugins
app.register(fastifyCookie);
app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false,
    },
    sign: {
        expiresIn: '10m',
    },
});

// Registrar as rotas
app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

// Manipulador de erro global
app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        return reply
            .status(400)
            .send({ message: 'Validation error.', issues: error.format() });
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error);
    } else {
        // TODO: Aqui devemos fazer log em uma ferramenta externa como DataDog/NewRelic/Sentry
    }

    return reply.status(500).send({ message: 'Internal server error.' });
});
