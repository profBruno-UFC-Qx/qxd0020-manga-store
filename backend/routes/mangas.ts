import express from 'express';
import { expressjwt } from "express-jwt"
import { UploadedFile } from 'express-fileupload';
import { MangaService } from '../services/mangaService';
import { SECRET_KEY } from '../services/authService'
import { isAdmin } from '../middleware/authorization';

const mangaService = new MangaService();

export const router = express.Router();

router.get('/', async (req, res) => {
    const mangas = await mangaService.getAll();
    res.status(200).json({ data: mangas});
})

router.post('/', expressjwt({ secret: SECRET_KEY, algorithms: ["HS256"] }), isAdmin, async (req, res) => {
    const { data } = req.body
    const { title, number, price }  = JSON.parse(data)
    
    if(title !== "" && !isNaN(number) && !isNaN(price)){
        let coverPath = undefined 
        if(req.files) {
            try {
                const cover = req.files['files.cover'] as UploadedFile;
                coverPath = `/img/one_piece/upload/up${Date.now().toString()}-${cover.name}`
                cover.mv(`${__dirname}/../../public/${coverPath}`)
            } catch (err) {
                res.status(500).json({ error: { message: err }});
            }
        }
        
        const addedManga = await mangaService.create(title, Number(number), Number(price), coverPath)
        if(addedManga) {
            res.status(200).json({ data: addedManga })
        } else {
            res.status(400).json({ error: { message: "Não foi possível adicionar o mangá!"}})
        }
    } else {
        res.status(400).json({ error: { message: "Informações inválidas!"}})
    }
});

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id)
    const manga = await mangaService.get(id)

    if(manga) {
        res.status(200).json({ data: manga });    
    } else {
        res.status(404).json({ error: { message: "Mangá não encontrado!"}})
    }
    
});

router.put('/:id', expressjwt({ secret: SECRET_KEY, algorithms: ["HS256"] }), isAdmin, async (req, res) => {
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
        const manga = await mangaService.update(id, title, Number(number), Number(price), coverPath)
        if(manga) {
            res.status(200).json({ data: manga });    
        } else {
            res.status(404).json({ error: { message: "Mangá não encontrado!"}})
        }
    } else {
        res.status(400).json({ error: { message: "Informações inválidas!"}})
    }    
});

router.delete('/:id', expressjwt({ secret: SECRET_KEY, algorithms: ["HS256"] }), isAdmin, async (req, res) => {
    const id = Number(req.params.id)
    const manga = await mangaService.delete(id)
    if (manga) {
        res.status(200).json({ data: manga});
    } else {
        res.status(404).json({ msg: "Mangá não encontrado!"});
    }
});