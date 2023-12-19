import { FastifyReply, FastifyRequest } from 'fastify';

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify({ onlyCookie: true });

        const { role } = request.user;

        const token = await reply.jwtSign(
            { role },
            {
                sign: {
                    sub: request.user.sub,
                },
            },
        );

        const refreshToken = await reply.jwtSign(
            { role },
            {
                sign: {
                    sub: request.user.sub,
                    expiresIn: '7d',
                },
            },
        );

        const response = reply
            .setCookie('refreshToken', refreshToken, {
                path: '/',
                secure: true,
                sameSite: true,
                httpOnly: true,
            })
            .status(200)
            .send({
                success: true,
                message: 'Refresh realizado com sucesso!',
                token,
            });

        // Adicionando mensagem de log para indicar sucesso
        console.log('Refresh realizado com sucesso!');

        return response;
    } catch (error) {
        // Adicionando mensagem de log para indicar erro
        console.error('Erro ao realizar o refresh:', error);

        return reply.status(500).send({
            success: false,
            error: 'Internal Server Error',
            message: 'Erro ao realizar o refresh. Consulte os logs para obter mais informações.',
        });
    }
}
