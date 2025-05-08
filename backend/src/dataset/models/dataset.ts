import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("dataset")
export class DataSet {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    question: string;

    @Column("text")
    answer: string;

}
