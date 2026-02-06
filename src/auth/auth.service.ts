import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

//Injectable cosi possiamo usare dependency injection
@Injectable({})
export class AuthService{

    constructor(private prisma : PrismaService){}

    signup(){
        return {msg : 'I have signed up'}
    }
    
    signin(){
        return {msg : 'I am signin in'}
    }

}