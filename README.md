# ☕ Kopi Senja - Self-Service QR-Ordering System (Frontend Prototype)

Kopi Senja adalah prototipe aplikasi berbasis web untuk sistem pemesanan mandiri (self-service) di kafe menggunakan QR Code. Aplikasi ini dirancang untuk mensimulasikan alur kerja operasional kafe modern secara *end-to-end*, memisahkan hak akses antara **Pelanggan (Customer)**, **Kasir (Cashier)**, dan **Staf Dapur (Kitchen Display System/KDS)**.

Proyek ini dibangun murni di sisi *frontend* menggunakan arsitektur *Simulated Centralized Database* memanfaatkan browser storage. Sangat cocok digunakan untuk keperluan demonstrasi portofolio atau presentasi produk pada satu perangkat.

## 🔗 Live Demo & Tautan Akses

Karena proyek ini dideploy menggunakan GitHub Pages, Anda dapat langsung menguji coba sistem *Point of Sale* (POS) mandiri ini melalui tautan di bawah:

* **Halaman Menu Pelanggan:** `https://habiljabbal.github.io/kopi-senja-pos/public/`
* **Halaman Login Staf:** `https://habiljabbal.github.io/kopi-senja-pos/public/login`

> ⚠️ **Catatan Penting untuk Uji Coba:** Untuk melihat simulasi sinkronisasi data secara *real-time*, silakan buka kedua link di atas secara bersamaan pada satu browser menggunakan metode *split-screen* (sandingkan jendela kanan dan kiri).

---

## 🚀 Fitur Utama

1. **Menu Pelanggan (`index.html`)**
   - Antarmuka responsif ramah pengguna (Mobile-first design).
   - Filter kategori menu interaktif (Semua, Makanan, Minuman).
   - Sistem keranjang belanja dinamis (*Live Cart Computation*).
   - Formulir *checkout* dengan opsi metode pembayaran (QRIS / Tunai).
   - Modal pop-up QRIS premium interaktif dengan status *loading/polling verifikasi otomatis*.

2. **Sistem Autentikasi Staf (`login.html`)**
   - Pembatasan hak akses halaman internal menggunakan *Session Check*.
   - Pemisahan pengalihan (*redirection*) otomatis berdasarkan *Role* akun staf.

3. **Dashboard Kasir (`kasir.html`)**
   - Pantauan arus validasi transaksi masuk secara *real-time* (sinkronisasi otomatis via `localStorage`).
   - Fitur **Validasi Uang** untuk menyetujui pembayaran QRIS pelanggan.
   - Papan metrik finansial: Akumulasi Omzet Lunas dan Jumlah Transaksi Pending.

4. **Monitor KDS Dapur (`dapur.html`)**
   - Tiket antrean memasak yang masuk secara *real-time* (bahkan sebelum kasir memvalidasi pembayaran tunai).
   - Tombol **Selesai Masak / Sajikan** untuk memperbarui status antrean dapur.

---

## 🛠️ Tech Stack & Arsitektur Data

- **Frontend Framework:** Tailwind CSS v4.0 (Utility-first CSS)
- **Icons:** FontAwesome v6.5.1
- **Typography:** Plus Jakarta Sans (Google Fonts)
- **State Management & Database:** `window.localStorage` (Simulasi DB Pusat) & `window.sessionStorage` (Simulasi Session Token Login)

---

## 🖥️ Panduan Cara Menjalankan & Demo (Metode Split-Screen)

Karena aplikasi ini menggunakan `localStorage` untuk bertukar data antar halaman, browser memerlukan **Origin/Domain/Port yang sama** agar data dapat menyeberang. Ikuti langkah pengujian berikut:

### Langkah 1: Jalankan Server Lokal
Buka proyek ini di VS Code, lalu jalankan menggunakan ekstensi **Live Server** (Klik **Go Live** pada file `index.html`). Pastikan alamat di browser Anda berawalan URL HTTP (contoh: `http://127.0.0.1:5500/public/index.html`).

### Langkah 2: Setup Layar Demo (Split Screen)
1. Buka halaman pelanggan utama pada jendela browser sebelah kiri (Tab 1).
2. Buka **Tab Baru** di browser yang sama, tarik ke sebelah kanan layar (Tab 2), lalu akses halaman login staf dengan mengubah ujung URL menjadi: `/public/login.html`.

### Langkah 3: Gunakan Akun Demo Staf
Gunakan kredensial berikut pada halaman `login.html` (Tab 2):
* **Mode Kasir:** Username: `kasir1` | PIN Password: `1234`
* **Mode Dapur:** Username: `dapur1` | PIN Password: `5678`

### Langkah 4: Simulasikan Pesanan
1. Pada **Tab Pelanggan (Kiri)**, pilih beberapa menu lalu lakukan *checkout* dengan metode **QRIS**. Pop-up QRIS akan muncul dalam status berputar (menunggu verifikasi).
2. Buka **Tab Kasir (Kanan)**, data pesanan dari meja pelanggan akan langsung muncul otomatis dalam waktu 2 detik.
3. Klik tombol **✓ Validasi Uang** pada Dashboard Kasir.
4. Perhatikan **Tab Pelanggan (Kiri)**, pop-up QRIS akan mendeteksi persetujuan tersebut, menutup secara otomatis, dan memunculkan notifikasi sukses!

---

## 📄 Pemeliharaan Data (Reset Database)
Jika antrean transaksi demo sudah terlalu penuh dan Anda ingin membersihkan data dari awal, buka **Developer Tools (F12)** di browser Anda, masuk ke tab **Console**, lalu ketik perintah berikut kemudian tekan Enter:
```javascript
localStorage.clear(); sessionStorage.clear(); location.reload();    