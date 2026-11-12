import { IsEmail, IsNotEmpty, IsString, length } from "class-validator";

export class ReggisterDto{
    @IsEmail({} ,{message : "email must be a valid email"})
    email: string;

    @IsNotEmpty({message : "Name is required !"})
    @IsString({message : "Name must be a string"})
    
    name: string;

    @IsNotEmpty({message : "Password is required !"})
    @IsString({message : "Password must be a string"})
    
    password: string;

    
}

