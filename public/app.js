const daftarMenu = [
    { id: 1, nama: "Kopi Susu Aren", harga: 22000, kategori: "minuman", foto: "☕" },
    { id: 2, nama: "Matcha Premium", harga: 25000, kategori: "minuman", foto: "🍵" },
    { id: 3, nama: "Nasi Goreng Spesial", harga: 30000, kategori: "makanan", foto: "🍳" },
    { id: 4, nama: "Cireng Renyah", harga: 15000, kategori: "makanan", foto: "🥟" }
];

let keranjang = {};

function renderMenu(kategoriTerfilter = 'semua') {
    const container = document.getElementById('menuContainer');
    if (!container) return;
    container.innerHTML = '';
    
    const produkTampil = kategoriTerfilter === 'semua' ? daftarMenu : daftarMenu.filter(m => m.kategori === kategoriTerfilter);
    produkTampil.forEach(menu => {
        const qty = keranjang[menu.id] || 0;
        container.innerHTML += `
            <div class="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 flex gap-4 items-center">
                <div class="text-2xl bg-gray-50 w-12 h-12 rounded-xl flex items-center justify-center border border-gray-100">${menu.foto}</div>
                <div class="flex-1">
                    <h3 class="text-xs font-bold">${menu.nama}</h3>
                    <span class="text-xs font-bold text-accent-gold block mt-1">Rp ${menu.harga.toLocaleString('id-ID')}</span>
                </div>
                <div class="flex items-center gap-2">
                    ${qty > 0 ? `
                        <button onclick="ubahJumlah(${menu.id}, -1)" class="w-6 h-6 bg-gray-100 font-bold rounded-lg flex items-center justify-center text-xs">-</button>
                        <span class="text-xs font-bold w-4 text-center">${qty}</span>
                    ` : ''}
                    <button onclick="ubahJumlah(${menu.id}, 1)" class="w-6 h-6 bg-coffee-950 text-white font-bold rounded-lg flex items-center justify-center text-xs">+</button>
                </div>
            </div>
        `;
    });
}

function ubahJumlah(id, delta) {
    if (!keranjang[id]) keranjang[id] = 0;
    keranjang[id] += delta;
    if (keranjang[id] <= 0) delete keranjang[id];
    updateCartBar();
    renderMenu();
}

function updateCartBar() {
    let totalItems = 0; let totalHarga = 0;
    Object.keys(keranjang).forEach(id => {
        totalItems += keranjang[id];
        totalHarga += (daftarMenu.find(m => m.id == id).harga * keranjang[id]);
    });
    if (totalItems > 0) {
        document.getElementById('cartBar').classList.remove('hidden');
        document.getElementById('cartCount').innerText = `${totalItems} Item`;
        document.getElementById('cartTotal').innerText = `Rp ${totalHarga.toLocaleString('id-ID')}`;
    } else { document.getElementById('cartBar').classList.add('hidden'); }
}

function toggleCheckoutModal(isOpen) {
    const modal = document.getElementById('checkoutModal');
    if (isOpen) {
        modal.classList.remove('hidden');
        const container = document.getElementById('summaryItems'); container.innerHTML = '';
        let total = 0;
        Object.keys(keranjang).forEach(id => {
            const m = daftarMenu.find(i => i.id == id);
            total += m.harga * keranjang[id];
            container.innerHTML += `<div class="flex justify-between text-xs"><span>${m.nama} x${keranjang[id]}</span><span>Rp ${(m.harga*keranjang[id]).toLocaleString('id-ID')}</span></div>`;
        });
        container.innerHTML += `<div class="flex justify-between font-bold text-accent-gold pt-2 border-t border-gray-100"><span>Total</span><span>Rp ${total.toLocaleString('id-ID')}</span></div>`;
    } else { modal.classList.add('hidden'); }
}

// FUNGSI INTI MENYIMPAN DATA KE DATABASE TERPUSAT (LOCALSTORAGE)
function prosesCheckoutDatabase() {
    const nama = document.getElementById('inputNama').value;
    const meja = document.getElementById('inputMeja').value;
    const metodeBayar = document.querySelector('input[name="payment"]:checked').value;

    if (!nama || !meja) {
        alert("⚠️ Nama pemesan & nomor meja wajib diisi!");
        return;
    }

    let totalHarga = 0;
    let itemPesanan = [];
    Object.keys(keranjang).forEach(id => {
        const menu = daftarMenu.find(m => m.id == id);
        if (menu) {
            totalHarga += (menu.harga * keranjang[id]);
            itemPesanan.push({
                id: menu.id,
                nama: menu.nama,
                qty: keranjang[id],
                kategori: menu.kategori
            });
        }
    });

    const orderBaru = {
        idOrder: "ORD-" + Date.now(),
        namaPelanggan: nama,
        nomorMeja: meja,
        items: itemPesanan,
        total: totalHarga,
        metode: metodeBayar,
        statusPembayaran: metodeBayar === "QRIS" ? "Belum Diverifikasi" : "Bayar di Kasir",
        statusDapur: "Antrean Dapur" 
    };

    // AMBIL DB LAMA -> ISI DATA BARU -> KEMBALIKAN KE LOCALSTORAGE
    let localDB = JSON.parse(localStorage.getItem('databasePesanan')) || [];
    localDB.push(orderBaru);
    localStorage.setItem('databasePesanan', JSON.stringify(localDB));

    // Reset Form Pelanggan
    keranjang = {};
    document.getElementById('inputNama').value = '';
    updateCartBar();
    renderMenu();
    toggleCheckoutModal(false);

    if (metodeBayar === "QRIS") {
        document.getElementById('qrisTotalText').innerText = `Rp ${totalHarga.toLocaleString('id-ID')}`;
        document.getElementById('qrisModal').classList.remove('hidden');
        
        // Pengecekan otomatis real-time apakah kasir sudah memvalidasi uangnya
        let checkPaymentInterval = setInterval(() => {
            let currentDB = JSON.parse(localStorage.getItem('databasePesanan')) || [];
            let myOrder = currentDB.find(o => o.idOrder === orderBaru.idOrder);
            if (myOrder && myOrder.statusPembayaran === "Lunas / QRIS Sukses") {
                clearInterval(checkPaymentInterval);
                document.getElementById('qrisModal').classList.add('hidden');
                alert("🎉 Pembayaran QRIS Sukses Terverifikasi! Pesanan Anda dikirim dan sedang dimasak.");
            }
        }, 2000);
    } else {
        alert(`🛒 Pesanan terkirim!\nSilakan lakukan pembayaran tunai sebesar Rp ${totalHarga.toLocaleString('id-ID')} langsung ke meja Kasir.`);
    }
}

function filterMenu(kategori) { renderMenu(kategori); }
function closeQrisModal() { document.getElementById('qrisModal').classList.add('hidden'); }

window.filterMenu = filterMenu;
window.ubahJumlah = ubahJumlah;
window.toggleCheckoutModal = toggleCheckoutModal;
window.prosesCheckoutDatabase = prosesCheckoutDatabase;
window.closeQrisModal = closeQrisModal;

renderMenu();