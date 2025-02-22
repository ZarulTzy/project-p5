import fs from 'fs/promises';
import express from 'express';
import cors from 'cors';


const app = express();
const aspirasiFile = 'data/aspirasi.json'

app.use(cors())
app.use(express.json())

// membaca file aspirasi
async function loadFileAspirasi() {
    // pencegahan error karena tidak ada file dan array
    try {
        await fs.access(aspirasiFile);
    } catch (err) {
        await fs.writeFile(aspirasiFile, '[]', 'utf-8');
    }

    // load file 
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

// id untuk setiap aspirasi
async function idAspirasi(){
    let id;
    let dataAspirasi = await loadFileAspirasi();
    
    do {
        id = Math.floor(Math.random() * (9999 - 1111 + 1) + 1111);
    } while (dataAspirasi.some((e) => e.id === id));
    
    return id
}

// menerima request dan mengolahnya
app.post('/aspirasi', async(req,res) =>{
    const {nama, kelas, pesan} = req.body;
    
    if(!nama || !kelas || !pesan){
        res.status(400).json({error : "tolong isi data dengan bernar"})
        return false;
    }

    const tambahAspirasi = await loadFileAspirasi();
    const id = await idAspirasi()

    tambahAspirasi.push({nama, kelas,pesan, id})


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

// mengahpus data dari database
app.post('/delate', async(req,res) => {
    const {id} = req.body;
    const parseId = Number(id)
    const dataAspirasi = await loadFileAspirasi()
    const checkId = dataAspirasi.filter(e => e.id !== parseId)
    
    if(checkId){
        try{
            await fs.writeFile(aspirasiFile,JSON.stringify(checkId,null,2), 'utf-8')
            console.log("data berhasil dihapus")
            res.status(200).json({message : "data berhasil dihapus"})
            return true;
        }catch(err){
            console.log('error')
            res.status(500).json({error: "internal server error"})
            return false;
        }
    }else{
        console.log("terjadi kesalahan")
    }
})

const port = 3000;
app.listen(port, () => {
    console.log(`Server berjalan pada http://localhost:${port}`);
  });