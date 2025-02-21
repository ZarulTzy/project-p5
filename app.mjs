import fs from 'fs/promises';
import express from 'express';
import cors from 'cors';


const app = express();
const aspirasiFile = 'data/aspirasi.json'

app.use(cors())
app.use(express.json())

async function loadFileAspirasi() {
    try{
        const data =JSON.parse(await fs.readFile(aspirasiFile, 'utf-8'));
        return data

    }catch(err){
        console.log(`terjadi error\n ${err}`)
        return []
    }
}

app.get('/', (req,res)=>{
    res.send("saya suka js");
    res.end()
})

app.post('/aspirasi', async(req,res) =>{
    const {nama, kelas, pesan} = req.body;
    
    if(!nama || !kelas || !pesan){
        console.log("lengkapi brosuere")
        res.status(400).json({error : "tolong isi data dengan bernar"})
        return false;
    }

    const tambahAspirasi = await loadFileAspirasi();
    tambahAspirasi.push({nama, kelas,pesan})

    try{
        await fs.writeFile(aspirasiFile,JSON.stringify(tambahAspirasi,null,2), 'utf-8')
        console.log("data berhasil ditambahkan")
        res.status(201).json({message : "data berhasil ditambahkan"})
        return true;
    }catch(err){
        console.log('error')
        res.status(500).json({error: "internal server error"})
        return false;
    }

    res.end()
})

// tampilkan ke layar
app.get('/aspirasi', async(req,res) =>{
    try{
        const aspirasi = await loadFileAspirasi()
        res.status(200).json({aspirasi})
        return true;
    }catch(err){
        console.log(err)
        res.status(500).json({error: "internal server error from get"})
        return false
    }
})

const port = 3000;
app.listen(port, () => {
    console.log(`Server berjalan pada http://localhost:${port}`);
  });