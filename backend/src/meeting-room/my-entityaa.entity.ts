import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('MyEntityaa')
export class MyEntityaaEntity {
    @PrimaryGeneratedColumn() id:string;
}
