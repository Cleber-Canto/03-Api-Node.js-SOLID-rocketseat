import { UsersRepository } from '@/repositories/users-repository';
import { UserAlreadyExistsError } from '@/shared/errors/user-already-exists-error';
import { User } from '@prisma/client';
import { hash } from 'bcryptjs';

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute({
        name,
        email,
        password,
    }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const password_hash = await hash(password, 6);

        const userWithSameEmail = await this.usersRepository.findByEmail(email);
        console.log('User with same email:', userWithSameEmail);

        if (userWithSameEmail) {
            console.log('User with same email found. Throwing error.');
            throw new UserAlreadyExistsError(email);
        }

        const user = await this.usersRepository.create({
            name,
            email,
            password_hash,
        });

        return {
            user,
        };
    }
}