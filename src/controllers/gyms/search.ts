import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeSearchGymsUseCase } from '@/shared/factories/make-search-gyms-use-case';

export async function search(request: FastifyRequest, reply: FastifyReply) {
    const searchGymsQuerySchema = z.object({
        q: z.string().default(''), // Torna o campo "q" opcional com um valor padrão vazio
        page: z.coerce.number().min(1).default(1),
    });

    const { q, page } = searchGymsQuerySchema.parse(request.query);

    const searchGymsUseCase = makeSearchGymsUseCase();

    try {
        const { gyms } = await searchGymsUseCase.execute({
            query: q,
            page,
        });

        return reply.status(200).send({
            gyms,
        });
    } catch (error) {
        console.error('[ERROR] Erro ao processar a solicitação:', error);
        return reply.status(500).send({
            error: 'Internal Server Error',
            message: 'Erro ao processar a solicitação. Consulte os logs para obter mais informações.',
        });
    }
}
