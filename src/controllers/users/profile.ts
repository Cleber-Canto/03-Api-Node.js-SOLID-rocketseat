import { makeGetUserProfileUseCase } from '@/shared/factories/make-get-user-profile-use.case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
    try {
        console.log('Iniciando obtenção do perfil do usuário...');

        const getUserProfile = makeGetUserProfileUseCase();

        const { user } = await getUserProfile.execute({
            userId: request.user.sub,
        });

        console.log('Perfil do usuário obtido com sucesso:', user);

        // Remova informações sensíveis antes de enviar a resposta
        const sanitizedUser = {
            ...user,
            password_hash: undefined,
        };

        return reply.status(200).send({
            user: sanitizedUser,
            message: 'Perfil do usuário obtido com sucesso',
        });
    } catch (error) {
        console.error('Erro ao obter o perfil do usuário:', error);

        // Determine o status apropriado com base no tipo de erro
        const status = error instanceof CustomError ? 400 : 500;

        return reply.status(status).send({
            message: 'Erro ao obter o perfil do usuário',
            error: error.message || 'Erro desconhecido',
        });
    }
}
