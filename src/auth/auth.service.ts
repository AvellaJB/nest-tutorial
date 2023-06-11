import { ForbiddenException, Injectable } from "@nestjs/common";
import { User, Bookmark } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(private prisma:PrismaService, private jwt:JwtService, private config:ConfigService ) {}
    async signup(dto: AuthDto) {
        //Gererate a password hash
        const hash = await argon.hash(dto.password);
        try{
        //Create a new user
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash,
            },
        });
        return this.signToken(user.id, user.email);

        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials are already in use');
                }
            }
            throw error;
        }
       
    }

    async signin(dto: AuthDto) { 
        
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (!user) {
            throw new ForbiddenException('Wrong email or password');
        }
        const valid = await argon.verify(user.hash, dto.password);
        if (!valid) { 
            throw new ForbiddenException('Wrong email or password');
        }

        return this.signToken(user.id, user.email);
    }

    signToken(userId: number, email: string): Promise<string> {
        const payload = { sub: userId, email};
        return this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get('JWT_SECRET'),
        });
    }
}