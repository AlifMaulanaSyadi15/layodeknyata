const userInfo = document.getElementById("userInfo");

// Ambil username dari localStorage
const username = localStorage.getItem("username");

if (username) {
    // Jika user sudah login → tampilkan username
    userInfo.innerHTML = `
        <div class="user-logged">
            <span class="username">${username}</span>
            <img src="assets/user-icon.png" class="user-icon">
        </div>
    `;
} else {
    // Jika belum login → tampilkan tombol login
    userInfo.innerHTML = `
        <a href="login.html">
            <button class="login-btn">
                <span>Login</span>
                <img src="assets/user-icon.png" class="user-icon">
            </button>
        </a>
    `;
}
