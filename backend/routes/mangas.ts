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
    const manga = mangaService.get(id)

    if(manga) {
        res.status(200).json({ data: manga });    
    } else {
        res.status(404).json({ error: { message: "Mangá não encontrado!"}})
    }
    
});

router.put('/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(req.body)
    const { data } = req.body
    const { title, number, price }  = data 

    if(title !== "" && !isNaN(number) && !isNaN(price)){
        const manga = mangaService.update(id, title, number, price)

        if(manga) {
            res.status(200).json({ data: manga });    
        } else {
            res.status(404).json({ error: { message: "Mangá não encontrado!"}})
        }
    } else {
        res.status(400).json({ error: { message: "Informações inválidas!"}})
    }

    
});

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id)
    
    if (mangaService.delete(id)) {
        res.redirect('/mangas');
    } else {
        res.status(404).json({ msg: "Mangá não encontrado!"});
    }
});
