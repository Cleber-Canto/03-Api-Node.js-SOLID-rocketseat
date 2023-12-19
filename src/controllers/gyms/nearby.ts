import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeFetchNearbyGymsUseCase } from '@/shared/factories/make-fetch-nearby-gyms-use-case';

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
    try {
        // Validar e extrair parâmetros da consulta
        const nearbyGymsQuerySchema = z.object({
            latitude: z.number().refine((value) => !isNaN(value) && Math.abs(value) <= 90, {
                message: 'Latitude deve ser um número válido entre -90 e 90',
            }).default(0),
            longitude: z.number().refine((value) => !isNaN(value) && Math.abs(value) <= 180, {
                message: 'Longitude deve ser um número válido entre -180 e 180',
            }).default(0),
        });

        const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query);

        // Executar caso de uso para buscar ginásios próximos
        const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase();
        console.log(`[INFO] Executando busca de academias próximas: Latitude=${latitude}, Longitude=${longitude}`);

        const { gyms } = await fetchNearbyGymsUseCase.execute({
            userLatitude: latitude,
            userLongitude: longitude,
        });

        // Responder com os resultados e registrar no terminal
        console.log(`[INFO] Requisição para /gyms/nearby: Latitude=${latitude}, Longitude=${longitude}`);
        
        if (gyms.length === 0) {
            console.log('[INFO] Nenhuma academia encontrada nas proximidades.');
        } else {
            console.log(`[INFO] Academias encontradas: ${JSON.stringify(gyms)}`);
        }

        return reply.status(200).send({
            gyms,
        });
    } catch (error) {
        // Em caso de erro, registrar no terminal e responder com erro
        console.error('[ERROR] Erro ao processar a solicitação:', error);
        return reply.status(500).send({
            error: 'Internal Server Error',
            message: 'Erro ao processar a solicitação. Consulte os logs para obter mais informações.',
        });
    }
}

