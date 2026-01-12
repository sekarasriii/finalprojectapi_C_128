// Configuration untuk Frontend
// Base URL Backend API

const API_CONFIG = {
    BASE_URL: 'http://localhost:3000/api'
};

// Helper function untuk menyimpan data ke localStorage
function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Helper function untuk mengambil data dari localStorage
function getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}
// Helper function untuk menghapus data dari localStorage
function removeFromStorage(key) {
    localStorage.removeItem(key);
}

// Helper function untuk cek apakah user sudah login
function isLoggedIn() {
    return getFromStorage('user') !== null;
}

// Helper function untuk logout
function logout() {
    removeFromStorage('user');
    removeFromStorage('apiKey');
    window.location.href = 'login.html';
}