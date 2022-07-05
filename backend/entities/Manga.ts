import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, ManyToOne, JoinColumn } from "typeorm"

@Entity()
export class Cover {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    url: string = ""

    @Column()
    alternativeText: string = ""
}

@Entity()
export class Manga {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @Column()
    number!: number

    @Column({nullable: true, default: ""})
    summary: string = ""

    @Column()
    price!: number

    @OneToOne(() => Cover, { nullable: true, cascade: true, onDelete: "CASCADE" })
    @JoinColumn()
    cover!: Cover

    @OneToMany(() => Comment, (comment) => comment.manga)
    @JoinColumn()
    comments?: Comment[]

}


@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    rating: number = 0;

    @Column()
    description!: string

    @ManyToOne(() => Manga, (manga) => manga.comments)
    @JoinColumn()
    manga!: Manga
}