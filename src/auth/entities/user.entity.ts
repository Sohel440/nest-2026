
import { Posts } from "src/posts/entities/post.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserRole{

    USER= "user",
    ADMIN="admin"
}

@Entity()
export class User{

    @PrimaryGeneratedColumn()
    id : number

    @Column({unique : true})
    email : string

    @Column()
    name : string

    @Column()
    password : string

    @Column({
        type : "enum",
        enum : UserRole,
        default : UserRole.USER
    })
    role : UserRole

    @OneToMany (()=> Posts , (post)=>post.authorName)
    posts : Posts[]

    @CreateDateColumn()
    createdAt : Date

    @UpdateDateColumn()
    updatedAt : Date
}