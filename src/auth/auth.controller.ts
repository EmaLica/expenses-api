import { Body, Controller, ParseIntPipe, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { AuthDto } from "./dto";

@Controller('auth')
export class AuthController{
    constructor(private AuthService : AuthService){}

    @Post('signup')
            // @Body('email') email : string, 
        // @Body('password', ParseIntPipe) password : string){
        // console.log({
        //     email,
        //     typeOfEmail: typeof email,
        //     password,
        //     typeOfPassword: typeof password, 
        // })
        //Uso classvalidator e classtransformer
    signup(@Body() dto : AuthDto){
        console.log(dto);
        return this.AuthService.signup()
    }

    @Post('signin')
    signin(){
        return this.AuthService.signin()
    }
}