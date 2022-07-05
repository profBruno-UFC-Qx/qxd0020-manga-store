import 'dotenv/config'
import { DataSource } from "typeorm"
import { User } from '../entities/User'


const DB_DATABASE = process.env.DB_DATABASE as string

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: DB_DATABASE,
    entities: [User],
    synchronize: true,
    logging: false,
})