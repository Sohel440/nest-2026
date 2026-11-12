import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotAcceptableException, NotFoundException, Param, ParseIntPipe, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Posts } from './interface/post-interface';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostExistPipe } from './pipes/post-exist.pipes';

@Controller('posts')
export class PostsController {
    constructor (private readonly postsService: PostsService) {}

    @Get()
    async findAll():Promise< Posts[]>{
        
        const extractPosts = this.postsService.findAll();
        
        return extractPosts
        
    }
    @Get(":id")
    async getById(@Param('id' , ParseIntPipe , PostExistPipe)id : number): Promise<Posts>{

        
        const singlePost = await this.postsService.findById(id);
        if (!singlePost) {
            throw new NotFoundException(`Post with id ${id} not found !`)
        }
        return singlePost
    }

    @Post("create")
    @HttpCode(HttpStatus.CREATED)
    // create(@Body() payload : Omit<Posts, 'id' | 'createdAt'>){
    async create(@Body() payload : CreatePostDto): Promise<Posts>{
        return await this.postsService.create(payload)
    }
 
    @Put(":id")
    @HttpCode(HttpStatus.OK)
    // @UsePipes(
    //     new ValidationPipe({
    //         whitelist: true,
    //         forbidNonWhitelisted: true,
    //     })
    // )
    // update(@Param('id' , ParseIntPipe)id : number, @Body() payload: Partial<Omit<Posts, 'id'|'createdAt'>>) {
    async update(@Param('id' , ParseIntPipe , PostExistPipe)id : number, @Body() payload: UpdatePostDto): Promise<Posts> {
        
        return this.postsService.update(id, payload);
    }
    
    @Delete(":id")
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id', ParseIntPipe , PostExistPipe)id : number): Promise<void>{
       
         await this.postsService.delete(id);
    }
}
