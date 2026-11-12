import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdatePostDto{
    @IsOptional()
    @IsNotEmpty({message : "title is required"})
    @IsString({message : "title must be a string"})
    @MinLength(3 , {message: "title must be at least 3 characters"})
    @MaxLength(20 , {message: "title must be at most 20 characters"})
    title ?: string;
    
    @IsOptional()
    @IsNotEmpty()
    @IsString({message : "content must be a string"})
    @MinLength(3 , {message: "content must be at least 3 characters"})
    content ?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString({message : "authorName must be a string"})
    authorName ? : string;
}