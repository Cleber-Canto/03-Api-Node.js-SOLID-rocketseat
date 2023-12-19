/* eslint-disable semi */
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeCreateGymUseCase } from '@/shared/factories/make-create-gym-use-case';

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const createGymBodySchema = z.object({
        title: z.string(),
        description: z.string().nullable(),
        phone: z.string().nullable(),
        latitude: z.number().refine((value) => Math.abs(value) <= 90),
        longitude: z.number().refine((value) => Math.abs(value) <= 180),
    });

    try {
        // Log para verificar os dados recebidos na requisição
        console.log('Dados da Requisição:', request.body);

        const { title, description, phone, latitude, longitude } = createGymBodySchema.parse(request.body);

        // Log para verificar os dados antes de executar createGymUseCase
        console.log('Dados antes de executar createGymUseCase:', { title, description, phone, latitude, longitude });

        const createGymUseCase = makeCreateGymUseCase();

        await createGymUseCase.execute({
            title,
            description,
            phone,
            latitude,
            longitude,
        });

        console.log('Academia criada com sucesso:', { title, latitude, longitude });
        return reply.status(201).send({ message: 'Academia criada com sucesso' });
    } catch (error) {
        console.error('[ERROR] Erro ao processar a solicitação:', error);
        console.error('[ERROR] Detalhes:', JSON.stringify(error, null, 2));
        return reply.status(500).send({
            error: 'Internal Server Error',
            message: 'Erro ao processar a solicitação. Consulte os logs para obter mais informações.',
        });
    }
}
