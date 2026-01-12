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

// Load API Key saat halaman dimuat
window.addEventListener('DOMContentLoaded', async () => {
    await loadApiKey();
    if (apiKey) {
        await loadProjects();
    }
});

// Load API Key dari backend
async function loadApiKey() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/apikey/${user.id}`);
        const data = await response.json();

        if (data.success) {
            apiKey = data.data.api_key;
            saveToStorage('apiKey', apiKey);
            showApiKey();
        } else {
            showNoApiKey();
        }
    } catch (error) {
        console.error('Error loading API Key:', error);
        showNoApiKey();
    }
}

// Tampilkan API Key
function showApiKey() {
    document.getElementById('noApiKey').classList.add('hidden');
    document.getElementById('hasApiKey').classList.remove('hidden');
    document.getElementById('apiKeyDisplay').textContent = apiKey;
    document.getElementById('addProjectBtn').style.display = 'flex';
}

// Tampilkan pesan belum ada API Key
function showNoApiKey() {
    document.getElementById('noApiKey').classList.remove('hidden');
    document.getElementById('hasApiKey').classList.add('hidden');
    document.getElementById('addProjectBtn').style.display = 'none';
}

// Generate API Key baru
async function generateApiKey() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/apikey/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: user.id })
        });

        const data = await response.json();

        if (data.success) {
            apiKey = data.data.api_key;
            saveToStorage('apiKey', apiKey);
            showApiKey();
            showNotification('success', 'API Key berhasil di-generate!');
            await loadProjects();
        } else {
            showNotification('error', 'Gagal generate API Key: ' + data.message);
        }
    } catch (error) {
        console.error('Error generating API Key:', error);
        showNotification('error', 'Terjadi kesalahan saat generate API Key.');
    }
}

// Regenerate API Key
async function regenerateApiKey() {
    if (!confirm('Regenerate API Key akan menonaktifkan API Key lama. Lanjutkan?')) {
        return;
    }
    await generateApiKey();
}
