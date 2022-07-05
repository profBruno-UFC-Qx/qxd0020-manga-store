import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity("mangas")
export class Manga {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    number: number

    @Column()
    summary: string

    @Column()
    chapters: string[]

    @Column()
    price: number

}
