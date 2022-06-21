import express from 'express';
import { MangaService } from '../services/mangaService';

const mangaService = new MangaService();

export const router = express.Router();

router.get('/', (req, res) => {
    const mangas = mangaService.getAll();
    res.status(200).json({ data: mangas});
})

router.post('/', (req, res) => {
    res.status(200).send('TODO');
});

router.get('/:id', (req, res) => {
    const id = Number(req.params.id)
    const manga = mangaService.getById(id)

    if(manga) {
        res.status(200).json({ data: manga });    
    } else {
        res.status(404).json({ msg: "Mangá não encontrado!"})
    }
    
});

router.put('/:id', (req, res) => {
    res.status(200).send('TODO');
});

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id)
    
    if (mangaService.delete(id)) {
        res.redirect('/mangas');
    } else {
        res.status(404).json({ msg: "Mangá não encontrado!"});
    }
});
