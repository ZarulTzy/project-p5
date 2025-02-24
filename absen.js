const loadDisplay = function(){
    fetch('http://localhost:3000/absen-view')
    .then(respone => respone.json())
    .then(data => {
        const dataAbsen = document.getElementById('absen-container')
        dataAbsen.innerHTML = ''

        data.dataAbsen.forEach(e => {
            e.absen.forEach(e => {
                const tempalte = `
                        <div class="row my-4">
                            <div class="col shadow bg-body-secondary rounded-2 d-flex p-3 mx-md-3 mx-4 justify-content-between">
                                <p class="my-auto">${e.nama}</p>
                                <div class="absensi-icon">
                                    <span class="mx-2 p-2 rounded-2 i-hadir"><i class="bi bi-check-lg" data-absen="hadir"></i></span>
                                    <span class="mx-2 p-2 rounded-2 i-sakit"><i class="bi bi-capsule" data-absen="sakit"></i></span>
                                    <span class="mx-2 p-2 rounded-2 i-izin"><i class="bi bi-exclamation-circle" data-absen="izin"></i></span>
                                    <span class="mx-2 p-2 rounded-2 i-tanpaket"><i class="bi bi-x-circle" data-absen="tanpa keterangan"></i></span>
                                </div>
                            </div>
                        </div>
                        `
                        dataAbsen.innerHTML += tempalte;
                    })
                });
            })
        }
        
document.getElementById('absen-container').addEventListener('click', function(e) {
    if(e.target && e.target.dataset.absen) {
        const spanParent = e.target.closest('span');
        const dateTime = new Date()

        const tahun = dateTime.getFullYear();
        const bulan = dateTime.getMonth() + 1;
        const tanggal = dateTime.getDate();

        const dateNow = `${tahun}/${bulan}/${tanggal}`

        const iconContainer = spanParent.parentElement;
        
        iconContainer.querySelectorAll('span').forEach(span => {
            span.classList.remove('active-absen');
        });
        
        spanParent.classList.add('active-absen');
        const rowContainer = e.target.closest('.row');
        // Cari tag <p> di dalam row tersebut, misalnya:
        const namaElement = rowContainer.querySelector('p').textContent;

        const status = {status : e.target.dataset.absen, nama : namaElement, date : dateNow}

        fetch('http://localhost:3000/absen', {
            method : "POST",
            headers : { "Content-Type": "application/json" },
            body : JSON.stringify(status)
        })
        .then(response => {
            if(response.ok) {
                // Panggil ulang loadDisplay untuk mengambil data terbaru
                loadDisplay();
            }
        })
        .catch(error => console.error('Error:', error));
        
        
        console.log(e.target.dataset.absen);
    }
});


loadDisplay()