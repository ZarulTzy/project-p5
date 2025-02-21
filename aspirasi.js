
const kirim = document.getElementById('kirim-aspirasi');
kirim.addEventListener('click', function(){
    const nama = document.getElementById('nama');
    const kelas = document.getElementById('kelas');
    const aspirasi = document.getElementById('textarea-aspirasi');

    fetch('http://localhost:3000/aspirasi', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama : nama.value, kelas : kelas.value, pesan : aspirasi.value }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error:", error));

})

const batal = document.getElementById('batal').addEventListener('click', function(){
    const nama = document.getElementById('nama');
    const kelas = document.getElementById('kelas');
    const aspirasi = document.getElementById('textarea-aspirasi');
    nama.value = '';
    kelas.value = '';
    aspirasi.value = '';
})

fetch('http://localhost:3000/aspirasi')
    .then(response => response.json())
    .then(data => {
        const mainRow = document.querySelector('.main-row')
        const dataAspirasiSiswa = data.aspirasi;
        
        const pecahData = dataAspirasiSiswa.forEach((e,i) => {
            const template = `<div class="shadow p-3 mb-5 bg-body-secondary rounded-2 w-75 mx-auto">
                                    <h1 class="nama-siswa fs-3">${e.nama}</h1>
                                    <p class="kelas-p">${e.kelas}</p>
                                    <p class="aspirasi-siswa lh-1 fs-5">${e.pesan}</p>
                                </div>`;
            mainRow.innerHTML += template

        });
    })
    .catch(error => console.error("Error:", error));


  