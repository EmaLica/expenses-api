import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'

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
        const user = await this.prisma.user.create({
            data: {
                email: AuthDto.email,
                hash,
            }
        })
        return user
    }
    
    signin(){
        return {msg : 'I am signin in'}
    }

}