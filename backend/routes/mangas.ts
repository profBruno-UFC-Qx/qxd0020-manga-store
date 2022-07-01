import express from 'express';
import { expressjwt } from "express-jwt"
import { UploadedFile } from 'express-fileupload';
import { MangaService } from '../services/mangaService';
import { SECRET_KEY } from '../services/authService'
import { isAdmin } from '../middleware/authorization';

const mangaService = new MangaService();

export const router = express.Router();

router.get('/', (req, res) => {
    const mangas = mangaService.getAll();
    res.status(200).json({ data: mangas});
})

router.post('/', expressjwt({ secret: SECRET_KEY, algorithms: ["HS256"] }), isAdmin, (req, res) => {
    const { data } = req.body
    const { title, number, price }  = JSON.parse(data)
    
    if(title !== "" && !isNaN(number) && !isNaN(price)){
        let coverPath = undefined 
        if(req.files) {
            try {
                const cover = req.files['files.cover'] as UploadedFile;
                coverPath = `/img/one_piece/upload/up${Date.now().toString()}-${cover.name}`
                console.log(coverPath)
                cover.mv(`${__dirname}/../../public/${coverPath}`)
            } catch (err) {
                res.status(500).json({ error: { message: err }});
            }
        }
        
        const addedManga = mangaService.create(title, Number(number), Number(price), coverPath)
        if(addedManga) {
            res.status(200).json({ data: addedManga })
        } else {
            res.status(400).json({ error: { message: "Não foi possível adicionar o mangá!"}})
        }
    } else {
        res.status(400).json({ error: { message: "Informações inválidas!"}})
    }
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

router.put('/:id', expressjwt({ secret: SECRET_KEY, algorithms: ["HS256"] }), isAdmin, (req, res) => {
    const id = Number(req.params.id)
    const { data } = req.body
    const { title, number, price }  = JSON.parse(data)
    
    if(title !== "" && !isNaN(number) && !isNaN(price)){
        let coverPath = undefined 
        if(req.files) {
            try {
                const cover = req.files['files.cover'] as UploadedFile;
                coverPath = `/img/one_piece/upload/up${Date.now().toString()}-${cover.name}`
                console.log(coverPath)
                cover.mv(`${__dirname}/../../public/${coverPath}`)
            } catch (err) {
                res.status(500).json({ error: { message: err }});
            }
        }
        const manga = mangaService.update(id, title, Number(number), Number(price), coverPath)
        if(manga) {
            res.status(200).json({ data: manga });    
        } else {
            res.status(404).json({ error: { message: "Mangá não encontrado!"}})
        }
    } else {
        res.status(400).json({ error: { message: "Informações inválidas!"}})
    }    
});

router.delete('/:id', expressjwt({ secret: SECRET_KEY, algorithms: ["HS256"] }), isAdmin, (req, res) => {
    const id = Number(req.params.id)
    
    if (mangaService.delete(id)) {
        res.redirect('/mangas');
    } else {
        res.status(404).json({ msg: "Mangá não encontrado!"});
    }
});