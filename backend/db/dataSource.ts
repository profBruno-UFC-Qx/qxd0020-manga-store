import 'dotenv/config'
import { DataSource } from "typeorm"
import { User } from '../entities/User'
import { Manga, Comment, Cover } from '../entities/Manga'
import { Initialization1656988250329 } from '../db/migrations/1656988250329-Initialization'


const DB_DATABASE = process.env.DB_DATABASE as string

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: DB_DATABASE,
    entities: [User, Manga, Cover, Comment],
    synchronize: true,
    logging: false,
    migrations: [Initialization1656988250329]
})