import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn({
        type: 'bigint',
        name: 'userId'

    })
    id: number;

    @Column()
    userName: string;

     @Column()
     password: string;

     @Column()
     email: string;

      
}