import { Injectable } from "@nestjs/common";

//Injectable cosi possiamo usare dependency injection
@Injectable({})
export class AuthService{

    signup(){
        return {msg : 'I am signed up'}
    }
    
    signin(){
        return {msg : 'I am signin in'}
    }

}