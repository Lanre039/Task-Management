import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credentials-dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload-interface';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    private logger = new Logger('AuthService');

    async signUp(authCredentialsDto: AuthCredentialDto): Promise<void> {
        return this.userRepository.signUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialDto): Promise<{ accessToken: string }> {
        const username = await this.userRepository.validateUserCredentials(authCredentialsDto);

        if (!username) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);
        this.logger.debug(`Generated JWT token with payoad ${JSON.stringify(payload)}`);
        
        return { accessToken };

    }
}
