const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs"); // Pastikan sudah diinstall: npm install bcryptjs
const db = require("./db");         // Import koneksi database (Pool dari mysql2/promise)
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.json()); // Untuk parse application/json

// Middleware CORS (Penting untuk komunikasi frontend/backend)
app.use((req, res, next) => {
  // Izinkan semua domain (*) untuk pengembangan
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// ===================================
// Endpoint untuk REGISTRASI (Sign Up)
// URL: POST http://localhost:3000/users/register
// ===================================
app.post("/users/register", async (req, res) => {
  const { username, password, confirm_password } = req.body;
  
  // Log body request untuk debugging
  console.log("Menerima request registrasi:", req.body);
  
  // 1. Validasi Input Dasar
  if (!username || !password || !confirm_password) {
    return res.status(400).json({ message: "Semua kolom harus diisi!" });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ message: "Password dan Konfirmasi Password tidak cocok!" });
  }

  let connection;
  try {
    // Baris ini memanggil .getConnection() dari pool yang di-export db.js
    connection = await db.getConnection(); 

    // 2. Cek apakah Username sudah terdaftar
    console.log("cek username")
    const [existingUsers] = await db.query(
      "SELECT *FROM users id WHERE username = ?",
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: "Username sudah digunakan." });
    }

    // 3. Hash Password dengan bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Simpan User Baru ke Database
    console.log("simpan user baru")
    const defaultNama = username;
    
    const [result] = await db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );

    res.status(201).json({
      message: "Registrasi berhasil!",
      userId: result.insertId,
    });
  } catch (error) {
    // Jika ada error, error akan dicetak di sini (termasuk error SQL)
    console.error("Error saat registrasi:", error.message || error);
    res.status(500).json({ message: "Terjadi kesalahan server saat registrasi." });
  } finally {
    // Pastikan koneksi dilepaskan
    if (connection) connection.release(); 
  }
});


// ===============================
// Endpoint untuk LOGIN
// URL: POST http://localhost:3000/users/login
// ===============================
app.post("/users/login", async (req, res) => {
  const { username, password } = req.body;
  
  // 1. Validasi Input Dasar
  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password harus diisi." });
  }

  let connection;
  try {
    connection = await db.getConnection();

    // 2. Cari User di Database berdasarkan Username
    console.log("cari user")
    const [users] = await db.query(
      "SELECT *FROM users WHERE username = ?",
      [username]
    );

    // Cek apakah user ditemukan
    console.log("cek user")
    if (users.length === 0) {
      return res.status(401).json({ message: "Username atau password salah." });
    }

    const user = users[0];
    const hashedPassword = user.password;

    // 3. Bandingkan Password yang diinput dengan yang di-hash di DB
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Username atau password salah." });
    }

    // 4. Login Berhasil! Kirim data yang dibutuhkan frontend
    console.log("jika login berhasil")
    res.status(200).json({
      message: "Login Berhasil!",
      data: {
        username: user.username,
      },
    });

  } catch (error) {
    console.error("Error saat login:", error.message || error);
    res.status(500).json({ message: "Terjadi kesalahan server saat login." });
  } finally {
    if (connection) connection.release();
  }
});

// Jalankan Server
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});