import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeCheckInUseCase } from '@/shared/factories/make-check-in-use.case';
import { MaxDistanceError } from '@/shared/errors/max-distance-error';

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const createCheckInParamsSchema = z.object({
        gymId: z.string().uuid(),
    });

    const createCheckInBodySchema = z.object({
        latitude: z.number().refine((value) => Math.abs(value) <= 90),
        longitude: z.number().refine((value) => Math.abs(value) <= 180),
    });

    try {
        // Parse parameters from request
        const { gymId } = createCheckInParamsSchema.parse(request.params);
        const { latitude, longitude } = createCheckInBodySchema.parse(request.body);

        // Execute check-in use case
        const checkInUseCase = makeCheckInUseCase();
        await checkInUseCase.execute({
            gymId,
            userId: request.user.sub,
            userLatitude: latitude,
            userLongitude: longitude,
        });

        // Log success message
        console.log('[INFO] Check-in successful:', { gymId, latitude, longitude });

        // Send success response
        return reply.status(201).send({
            success: true,
            message: 'Check-in successful',
        });
    } catch (error) {
        // Handle MaxDistanceError separately
        if (error instanceof MaxDistanceError) {
            const { actualDistance, maxDistance } = error;
            console.error(`[ERROR] Max distance reached. Actual distance: ${actualDistance}, Max distance allowed: ${maxDistance}`);
        } else {
            console.error('[ERROR] Error during check-in:', error.message);
        }

        // Return error response with details
        return reply.status(400).send({
            success: false,
            error: {
                message: 'Bad Request',
                details: error instanceof MaxDistanceError ? error.message : error.message,
            },
        });
    }
}
