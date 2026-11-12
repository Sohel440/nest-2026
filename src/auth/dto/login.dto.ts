import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto{
    @IsEmail({} ,{message : "email must be a valid email"})
    email: string;

    @IsNotEmpty({message : "Password is required !"})
    @IsString({message : "Password must be a string"})
    password: string;

    
}

