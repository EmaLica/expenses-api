import { ForbiddenException, Injectable } from "@nestjs/common";
import * as argon from 'argon2';
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

//Injectable cosi possiamo usare dependency injection
@Injectable({})
export class AuthService{

    constructor(private prisma : PrismaService, private jwt : JwtService, private config: ConfigService){}

    async signup(AuthDto: AuthDto){
        //bcrypt (72 bytes) 
        //argon più sicuro 
        //genero hash+
        const hash = await argon.hash(AuthDto.password)
        //salvo l'user nel db
        try {
            const user = await this.prisma.user.create({
            data: {
                email: AuthDto.email,
                hash,
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
            } 
        });

        return user
    } catch (error) {
            if (error instanceof PrismaClientKnownRequestError){
                if (error.code === 'P2002'){
                    throw new ForbiddenException(
                        'Credentials already taken'
                    )
                }
            }
            throw error
        }
    }
    
    async signin(AuthDto: AuthDto){
        const user = await this.prisma.user.findUnique({
            where: {
                email: AuthDto.email,
            },
        })

        if (!user) throw new ForbiddenException(
            'Credentials are incorrect'
        )

        const pwMatches = await argon.verify(
            user.hash,
            AuthDto.password,
        )

        if (!pwMatches) throw new ForbiddenException(
            'Credentials are incorrect'
        )

        return this.signToken(user.id, user.email)
    }

    async signToken(userId: number, email :string): Promise<{access_token: string}>{
        const payload = {
            sub: userId,
            email
        }

        const secret = this.config.get('JWT_SECRET')

        const token = await this.jwt.signAsync(payload, {
            //dopo 15 min token scade e l'utente deve rifare l'accesso
            expiresIn: '15m',
            secret: secret
        })

        return {
            access_token: token
        }
    }

}