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
    
    signin(){
        return {msg : 'I am signin in'}
    }

}