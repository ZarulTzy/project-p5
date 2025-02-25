function loadAspirasi() {
  fetch('https://project-p5-two.vercel.app/aspirasi')
    .then(response => response.json())
    .then(data => {
      const mainRow = document.querySelector('.main-row');
      mainRow.innerHTML = '';

      data.aspirasi.forEach((e) => {
        const template = `
          <div class="aspirasi-item shadow p-3 mb-5 bg-body-secondary rounded-2 w-75 mx-auto position-relative">
            <div class="aspirasi-header d-flex justify-content-between">
              <div class="aspirasi-title">
                <h1 class="nama-siswa fs-3 flex-fill">${e.nama}</h1>
                <p class="kelas-p">${e.kelas}</p>
              </div>
              <div class="aspirasi-actions">
                <button class="btn btn-warning btn-sm edit-btn" data-id="${e.id}" data-bs-toggle="modal" data-bs-target="#kotak-aspirasi">Edit</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${e.id}">Hapus</button>
              </div>
            </div>
            <p class="aspirasi-siswa lh-sm fs-5">${e.pesan}</p>
          </div>
        `;
        mainRow.innerHTML += template;
      });
    })
    .catch(error => console.error("Error:", error));
}

// Panggil loadAspirasi saat halaman pertama kali dimuat
loadAspirasi();


// Tombol Kirim untuk tambah atau edit aspirasi
document.getElementById('kirim-aspirasi').addEventListener('click', function () {
  const nama = document.getElementById('nama').value;
  const kelas = document.getElementById('kelas').value;
  const pesan = document.getElementById('textarea-aspirasi').value;
  const id = this.getAttribute('data-edit-id');

  // Tentukan endpoint
  const url = id ? 'https://project-p5-two.vercel.app/edit' : 'https://project-p5-two.vercel.app/aspirasi';

  const payload = id ? { id, nama, kelas, pesan } : { nama, kelas, pesan };

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);

      document.getElementById('nama').value = '';
      document.getElementById('kelas').value = '';
      document.getElementById('textarea-aspirasi').value = '';
      document.getElementById('kirim-aspirasi').removeAttribute('data-edit-id');

      loadAspirasi();
    })
    .catch(error => console.error("Error:", error));
});

// Tombol Batal untuk mengosongkan form input
document.getElementById('batal').addEventListener('click', function () {
  document.getElementById('nama').value = '';
  document.getElementById('kelas').value = '';
  document.getElementById('textarea-aspirasi').value = '';
  document.getElementById('kirim-aspirasi').removeAttribute('data-edit-id');
});

const mainRow = document.querySelector('.main-row');

mainRow.addEventListener('click', function (e) {
  // Hapus aspirasi
  if (e.target.classList.contains('delete-btn')) {
    const id = e.target.getAttribute('data-id');
    fetch('https://project-p5-two.vercel.app/delate', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Refresh data setelah penghapusan
        loadAspirasi();
      })
      .catch(error => console.error("Error:", error));
  }

  // Edit aspirasi
  if (e.target.classList.contains('edit-btn')) {
    const id = e.target.getAttribute('data-id');
    const aspirasiItem = e.target.closest('.aspirasi-item');
    const namaText = aspirasiItem.querySelector('.nama-siswa').textContent;
    const kelasText = aspirasiItem.querySelector('.kelas-p').textContent;
    const pesanText = aspirasiItem.querySelector('.aspirasi-siswa').textContent;

    // Isi form modal dengan data yang dipilih
    document.getElementById('nama').value = namaText;
    document.getElementById('kelas').value = kelasText;
    document.getElementById('textarea-aspirasi').value = pesanText;

    // Tandai tombol kirim dengan id aspirasi agar mode edit aktif
    document.getElementById('kirim-aspirasi').setAttribute('data-edit-id', id);
  }
});
