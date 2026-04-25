import { ForbiddenException, Injectable } from "@nestjs/common";
import * as argon from 'argon2';
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

//Injectable cosi possiamo usare dependency injection
@Injectable({})
export class AuthService{

    constructor(private prisma : PrismaService){}

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

        //delete user.hash

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

        // uso destructuring per estrarre hash e restituire l'utente senza di esso
        // non possiamo usare select nella query perché hash serve per argon.verify sopra
        const { hash, ...userWithoutHash } = user;
        return userWithoutHash;
    }

}