import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { UserAlreadyExistsError } from '@/shared/errors/user-already-exists-error';
import { makeRegisterUseCase } from '@/shared/factories/make-register-use-case';

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
    });

    try {
        const { name, email, password } = registerBodySchema.parse(request.body);

        const registerUseCase = makeRegisterUseCase();

        await registerUseCase.execute({
            name,
            email,
            password,
        });

        // Registro bem-sucedido
        console.log('Registro bem-sucedido:', { name, email });
        return reply.status(201).send({ message: 'Registro bem-sucedido' });
    } catch (err) {
        // Erro durante o registro
        console.error('Erro durante o registro:', err);
        if (err instanceof UserAlreadyExistsError) {
            console.error('Erro do tipo UserAlreadyExistsError:', err.message);
            return reply.status(409).send({ message: 'E-mail já está em uso.',
                error: 'USER_ALREADY_EXISTS',});
        }

        console.error('Erro inesperado:', err);
        throw err;
    }
}