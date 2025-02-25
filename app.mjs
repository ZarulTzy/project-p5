import fs from 'fs/promises';
import express from 'express';
import cors from 'cors';


const app = express();
const aspirasiFile = 'data/aspirasi.json'
const absensiFile = 'data/absensi.json'

app.use(cors())
app.use(express.json())

// membaca file aspirasi
async function loadFileAspirasi() {
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

// membaca file absensi
async function loadFileAbsensi() {
    try {
        await fs.access(absensiFile);
    } catch (err) {
        await fs.writeFile(absensiFile, '[]', 'utf-8');
    }

    // load file 
    try{
        const data =JSON.parse(await fs.readFile(absensiFile, 'utf-8'));
        return data

    }catch(err){
        console.log(`terjadi error\n ${err}`)
        return []
    }
}



app.get('/', (req,res)=>{
    res.send("lah kok");
    res.sendFile(path.resolve('home.html'));
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

const date = new Date()

// menerima request dan mengolahnya
app.post('/aspirasi', async(req,res) =>{
    const {nama, kelas, pesan} = req.body;
    const dateNow = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    
    if(!nama || !kelas || !pesan){
        res.status(400).json({error : "tolong isi data dengan bernar"})
        return false;
    }

    const tambahAspirasi = await loadFileAspirasi();
    const id = await idAspirasi()

    tambahAspirasi.push({nama, kelas,pesan, id, date : dateNow})


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

app.post('/edit', async (req, res) => {
    const { id, nama, kelas, pesan } = req.body;

    if (!id || !nama || !kelas || !pesan) {
      res.status(400).json({ error: "Data tidak lengkap" });
      return;
    }
    
    let dataAspirasi = await loadFileAspirasi();

    const index = dataAspirasi.findIndex(item => item.id === Number(id));

    if (index === -1) {
      res.status(404).json({ error: "Data tidak ditemukan" });
      return;
    }
    
    dataAspirasi[index] = { ...dataAspirasi[index], nama, kelas, pesan };
    
    try {
      await fs.writeFile(aspirasiFile, JSON.stringify(dataAspirasi, null, 2), 'utf-8');
      console.log("Data berhasil diperbarui");
      res.status(200).json({ message: "Data berhasil diperbarui" });
    } catch (err) {
      console.log('Error:', err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
//   absensi

// tampilkan daftar siswa
app.get('/absen-view', async(req, res) => {
    try{
        const dataAbsen = await loadFileAbsensi();
        res.status(200).json({dataAbsen})
        return true
    }catch(err){
        console.log(err);
        return false;
    }

})

app.post('/absen', async(req,res) =>{
    const {status, nama, date} = req.body;
    let dataAbsensi = await loadFileAbsensi();
    
    let dataUpdated = false;

    dataAbsensi.forEach(e => {
        e.absen.forEach(person => {
            if(person.nama === nama) {
                person.status = status;
                dataUpdated = true;
            }
        });
    });

    if (dataUpdated) {
        try {
            await fs.writeFile(absensiFile, JSON.stringify(dataAbsensi, null, 2), 'utf-8');
            console.log(`Status ${nama} berhasil diperbarui menjadi ${status}`);
            res.status(200).json({message: `Status ${nama} berhasil diperbarui`});
        } catch (err) {
            console.log("Error menyimpan data:", err);
            res.status(500).json({error: "Gagal menyimpan perubahan"});
        }
    } else {
        res.status(404).json({error: "Nama tidak ditemukan dalam daftar absensi"});
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server berjalan pada http://localhost:${port}`);
  });
