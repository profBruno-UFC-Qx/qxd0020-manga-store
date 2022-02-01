import express from 'express';
import { MangaService } from '../services/mangaService';

const mangaService = new MangaService();

export const router = express.Router();

router.get('/', (req, res) => {
    const mangas = mangaService.getAll();
    res.status(200).json(mangas);
})

router.get('/novo', (req, res) => {
   res.status(200).send('TODO'); 
});

router.post('/', (req, res) => {
    res.status(200).send('TODO');
});

router.get('/:id', (req, res) => {
    const id = Number(req.params.id)
    const manga = mangaService.getById(id)
    if(manga) {
        res.status(200).json(manga);    
    } else {
        res.status(404).json({ msg: "Mangá não encontrado!"})
    }
    
});

router.get('/:id/editar', (req, res) => {
    res.status(200).send('TODO');
});

router.put('/:id', (req, res) => {
    res.status(200).send('TODO');
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    
    if (mangaService.delete(Number(id))) {
        res.redirect('/mangas');
    } else {
        res.status(404).send('Mangá não existe');
    }
});
