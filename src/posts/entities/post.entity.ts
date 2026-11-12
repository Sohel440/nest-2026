import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Posts{
    @PrimaryGeneratedColumn()
    id : number
    
    @Column({length: 50})
    title: string;

    @Column({type: 'text'})
    content: string;

    @Column({length: 50})
    authorName: string;

    @CreateDateColumn()
    createdAt : Date

}