// Dashboard JavaScript - Enhanced for Dark Mode UI
// Handle API Key Management dan Projects menggunakan Fetch API

// Cek apakah user sudah login
if (!isLoggedIn()) {
    window.location.href = 'login.html';
}

const user = getFromStorage('user');
let apiKey = getFromStorage('apiKey');

// Tampilkan informasi user
document.getElementById('userName').textContent = user.name;
document.getElementById('userRole').textContent = user.role;

// Set user avatar initial
const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
document.getElementById('userAvatar').textContent = initials;

