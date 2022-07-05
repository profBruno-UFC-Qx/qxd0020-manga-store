import {MigrationInterface, QueryRunner} from "typeorm"
import { parse } from 'csv-parse/sync';
import * as fs from "fs";
import path from "path";

const dbPath = path.join(__dirname, '../../../db/mangas.csv')

export class Initialization1656988250329 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const fileContent = fs.readFileSync(dbPath);
        const records = parse(fileContent, {columns: true});
        for (let record of records) {
            const title = record.title;
            const volumeNumber = Number(record.volumeNumber);
            const cover = `/img/one_piece/${path.basename(record['cover.href'])}`;
            const price = Number(record.price).toFixed(2);

            await queryRunner.query(
                `INSERT INTO cover 
                ("url", "alternativeText") VALUES ("${cover}", "${volumeNumber} - ${title}")`,
            )

            await queryRunner.query(
                `INSERT INTO manga 
                ("title", "number", price, coverId) VALUES ("${title}", ${volumeNumber}, ${price}, ${volumeNumber})`,
            )
        }

        await queryRunner.query(
            `INSERT INTO user 
            ("username", "email", password, role) VALUES ("Bruno", "brunomateus@gmail.com", "$2b$10$MFk6sTPo9KcDI6Go3obfCuhiAd5i6GOtp9l/hZpTMskDJDMBGBPIG", "admin")`,
        )
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE * FROM manga`)
    }

}
