import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserRepository } from "./user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtPayload } from "./jwt-payload-interface";
import { UnauthorizedException, Injectable } from "@nestjs/common";
import * as config from 'config';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret')
        });
    }


    async validate(payload: JwtPayload) {
        const { username } = payload;
        const user = this.userRepository.findOne({ username });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }


}