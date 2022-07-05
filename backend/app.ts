import express from 'express'
import morgan from 'morgan';
import favicon from 'serve-favicon';
import path from 'path';
import cors from 'cors'
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload'
import "reflect-metadata"
import { AppDataSource } from './db/dataSource'
import { authorizathonHandler } from './middleware/authorization';
import { router as mangaRouter } from './routes/mangas';
import { router as userRouter } from './routes/user';

const app = express();

app.use(favicon(path.join(__dirname, '../', 'public', 'favicon.png')))
app.use(fileUpload({
    createParentPath: true,
}))

app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.static('./public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(morgan('tiny'))


app.use('/api/', userRouter)
app.use('/api/mangas', mangaRouter);
app.use(authorizathonHandler)

const PORT = 8080;

app.get('/', (req, res) => {
    res.redirect('/mangas');
});


app.listen(PORT, async () => {
    const connection = await AppDataSource.initialize()
    console.log(`Server listening on http://localhost:${PORT} `);
})




