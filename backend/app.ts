import express from 'express'
import morgan from 'morgan';
import favicon from 'serve-favicon';
import path from 'path';
import { router as mangaRouter } from './routes/mangas';
import cors from 'cors'

const app = express();

app.use(favicon(path.join(__dirname, '../', 'public', 'favicon.png')));
app.use(morgan('tiny'));
app.use(express.static('./public'));
app.use(cors({
    origin: 'http://localhost:3000'
}))

app.use('/api/mangas', mangaRouter);

const PORT = 8080;

app.get('/', (req, res) => {
    res.redirect('/mangas');
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT} `);
})




