import { Injectable, NotFoundException } from '@nestjs/common';
import { Posts } from './interface/post-interface';
import { Posts as PostEntity } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
    constructor(
    @InjectRepository(PostEntity)
    private PostRepository: Repository<Posts>,
  ) {}
    // private posts: Posts[] = [
    //     {
    //         id: 1,
    //         title: 'First Post',
    //         content: 'This is the first post',
    //         authorName: 'John Doe',
    //         createdAt: new Date(),
    //         // updatedAt: new Date()
    //     },
    //     {
    //         id: 2,
    //         title: 'Second Post',
    //         content: 'This is the second post',
    //         authorName: 'Jane Doe',
    //         createdAt: new Date(),
    //         // updatedAt: new Date()
    //     }
    // ]

    async findAll(): Promise<Posts[]> {
        return this.PostRepository.find();
    }
    async findById(id : number): Promise<Posts>{
    
        const res =  await this.PostRepository.findOneBy({id});

        if(!res) throw new NotFoundException(`${id} not found`);

        return res
    }
    async create(payload : Omit<Posts, 'id' | 'createdAt'>): Promise<Posts>{
       const res = await this.PostRepository.create(payload);

        return  this.PostRepository.save(res);
        
    }

    // update (id : number , payload : Partial<Omit<Posts, 'id'|'createdAt'>>){
    async update (id : number , payload :UpdatePostDto) : Promise<Posts>{
        const post = await this.PostRepository.findOneBy({id});
        if(!post) throw new NotFoundException(`${id} not found`);
        if(payload.title) post.title = payload.title
        if(payload.content) post.content = payload.content
        if(payload.authorName) post.authorName = payload.authorName
        post.updatedAt = new Date()
        return this.PostRepository.save(post);
    }

    async delete(id : number){
        const res = await this.findById(id);
       const New_posts = await this.PostRepository.remove(res);
       
       return {
           message : "Post deleted successfully"
       }
    }
}
