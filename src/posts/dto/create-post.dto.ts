import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePostDto{
    
    @IsNotEmpty({message : "title is required"})
    @IsString({message : "title must be a string"})
    @MinLength(3 , {message: "title must be at least 3 characters"})
    @MaxLength(20 , {message: "title must be at most 20 characters"})
    title : string;

    @IsNotEmpty()
    @IsString({message : "content must be a string"})
    @MinLength(3 , {message: "content must be at least 3 characters"})
    content  : string;

    @IsNotEmpty()
    @IsString({message : "authorName must be a string"})
    authorName : string;
}