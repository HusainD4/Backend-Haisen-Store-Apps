backend-project/
├── .env                  # Simpanan variabel rahasia (Supabase Key, JWT Secret)
├── package.json          # Daftar dependency Node.js
└── src/
    ├── config/           # File konfigurasi utama
    │   ├── env.js        # Pengelola file .env
    │   └── supabase.js   # Koneksi ke database Supabase
    ├── utils/            # Fungsi bantuan/utility
    │   └── logger.js     # Custom console.log untuk debugging
    ├── middlewares/      # Penengah request (contoh: Pengecekan Token JWT)
    │   └── auth.js       
    ├── services/         # Logika Bisnis (Kueri Database, Hashing, Aturan)
    │   └── authService.js
    ├── controllers/      # Pengatur Request/Response HTTP  
    │   └── authController.js
    ├── routes/           # Definisi URL Endpoint (/login, /register)
    │   └── authRoutes.js
    └── server.js         # Entry Point (File yang dijalankan pertama kali)