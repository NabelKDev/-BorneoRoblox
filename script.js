// script.js - Perbaikan Error

// Global variables
let currentUser = null;
let appData = {
  stok: 10000,
  harga_per_robux: 1.5,
  pesanan: 0,
  robux_terjual: 0,
  total_pendapatan: 0
};

// Load data from memory on page load
document.addEventListener('DOMContentLoaded', function() {
  loadAppData();
  updateDisplay();
  generatePaketCards();
  checkUserLogin();
  
  // Event listeners untuk form
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('registerForm').addEventListener('submit', handleRegister);
  document.getElementById('orderForm').addEventListener('submit', handleOrder);
  
  // Update harga saat jumlah robux berubah
  document.getElementById('jumlahRobux').addEventListener('input', updateHargaTotal);
  
  // Update price example when price changes
  document.getElementById('pricePerRobux').addEventListener('input', updatePriceExample);
});

// Modal functions
function showLoginModal() {
  document.getElementById("loginModal").classList.add("active");
}

function showRegisterModal() {
  document.getElementById("registerModal").classList.add("active");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("active");
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.classList.remove('active');
    }
  });
});

// User authentication functions
function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  
  if (!username || !password) {
    showNotification('Username dan password harus diisi!', 'error');
    return;
  }

  // Ambil data user dari localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.username === username && u.password === password);
  const user = users[userIndex];

if (user) {
  currentUser = user;

  // Deteksi admin berdasarkan username
  if (user.username.toLowerCase() === "nabil") {
    currentUser.role = "admin";
  }

  saveCurrentUser(); // Tambahkan agar tersimpan
  updateUserUI();
  closeModal('loginModal');
  showNotification('Login berhasil!', 'success');

  // Tampilkan panel admin jika role = admin
  if (currentUser.role === 'admin') {
    document.getElementById('adminPanel').classList.add('active');
  }
}
 else {
    showNotification('Username atau password salah!', 'error');
  }
}


function handleRegister(e) {
  e.preventDefault();
  
  const username = document.getElementById('regUsername').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  
  if (!username || !email || !password) {
    showNotification('Semua field harus diisi!', 'error');
    return;
  }
  
  // Simulate registration
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  if (users.find(u => u.username === username)) {
    showNotification('Username sudah digunakan!', 'error');
    return;
  }
  
  if (users.find(u => u.email === email)) {
    showNotification('Email sudah digunakan!', 'error');
    return;
  }
  
  const newUser = {
    id: Date.now(),
    username,
    email,
    password,
    role: username === 'admin' ? 'admin' : 'user',
    orders: []
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  showNotification('Registrasi berhasil! Silakan login.', 'success');
  closeModal('registerModal');
  
  // Clear form
  document.getElementById('registerForm').reset();
}

function logout() {
  currentUser = null;
  updateUserUI();
  document.getElementById('adminPanel').classList.remove('active');
  showNotification('Logout berhasil!', 'info');
}

function updateUserUI() {
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const userInfo = document.getElementById('userInfo');
  const welcomeText = document.getElementById('welcomeText');
  const loginRequired = document.getElementById('loginRequired');
  const orderForm = document.getElementById('orderForm');
  
  if (currentUser) {
    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    userInfo.classList.remove('hidden');
    userInfo.classList.add('flex');
    welcomeText.textContent = `Halo, ${currentUser.username}!`;
    
    // Show order form
    loginRequired.classList.add('hidden');
    orderForm.classList.remove('hidden');
    
    // Load user history
    loadUserHistory();
  } else {
    loginBtn.style.display = 'block';
    registerBtn.style.display = 'block';
    userInfo.classList.add('hidden');
    userInfo.classList.remove('flex');
    
    // Hide order form
    loginRequired.classList.remove('hidden');
    orderForm.classList.add('hidden');
    
    // Clear history
    document.getElementById('historyList').innerHTML = '<p class="text-gray-400 italic">Belum ada pemesanan</p>';
  }
}

function checkUserLogin() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);

    // Set admin jika username adalah "nabil"
    if (currentUser.username.toLowerCase() === 'nabil') {
      currentUser.role = 'admin';
    }

    updateUserUI();

    if (currentUser.role === 'admin') {
      document.getElementById('adminPanel').classList.add('active');
    }
  }
}

// Load and save app data
function loadAppData() {
  const savedData = localStorage.getItem('appData');
  if (savedData) {
    appData = JSON.parse(savedData);
  }
}

function saveAppData() {
  localStorage.setItem('appData', JSON.stringify(appData));
}

// Update display functions
function updateDisplay() {
  updateStokDisplay();
  updateAdminStats();
  updatePriceExample();
}

function updateStokDisplay() {
  const stokDisplay = document.getElementById('stok-display');
  stokDisplay.innerHTML = `<span class="text-2xl font-bold text-green-400">${appData.stok.toLocaleString()}</span> Robux`;
}

function updateAdminStats() {
  if (document.getElementById('currentStock')) {
    document.getElementById('currentStock').value = appData.stok;
    document.getElementById('totalOrders').textContent = appData.pesanan.toLocaleString();
    document.getElementById('totalRobuxSold').textContent = appData.robux_terjual.toLocaleString();
    document.getElementById('totalRevenue').textContent = `Rp ${appData.total_pendapatan.toLocaleString()}`;
    document.getElementById('pricePerRobux').value = appData.harga_per_robux;
  }
}

function updatePriceExample() {
  const priceExample = document.getElementById('priceExample');
  if (priceExample) {
    const examplePrice = (100 * appData.harga_per_robux).toLocaleString();
    priceExample.value = examplePrice;
  }
}

function updateHargaTotal() {
  const jumlahRobux = parseInt(document.getElementById('jumlahRobux').value) || 0;
  const hargaTotal = jumlahRobux * appData.harga_per_robux;
  document.getElementById('hargaTotal').value = `Rp ${hargaTotal.toLocaleString()}`;
}

// Generate paket cards
function generatePaketCards() {
  const container = document.getElementById('paketContainer');
  const pakets = [
    { robux: 50, color: 'green' },
    { robux: 100, color: 'blue' },
    { robux: 500, color: 'purple' },
    { robux: 1000, color: 'orange' }
  ];
  
  container.innerHTML = '';
  
  pakets.forEach(paket => {
    const harga = paket.robux * appData.harga_per_robux;
    const card = document.createElement('div');
    card.className = `paket-card ${paket.color}`;
    card.innerHTML = `
      <h4>${paket.robux} Robux</h4>
      <div class="price">Rp ${harga.toLocaleString()}</div>
      <button onclick="selectPaket(${paket.robux})">Pilih Paket</button>
    `;
    container.appendChild(card);
  });
}

function selectPaket(robuxAmount) {
  if (!currentUser) {
    showNotification('Silakan login terlebih dahulu!', 'error');
    showLoginModal();
    return;
  }
  
  document.getElementById('jumlahRobux').value = robuxAmount;
  updateHargaTotal();
  document.getElementById('form').scrollIntoView({ behavior: 'smooth' });
}

// Order handling
function handleOrder(e) {
  e.preventDefault();
  
  if (!currentUser) {
    showNotification('Silakan login terlebih dahulu!', 'error');
    return;
  }
  
  const username = document.getElementById('username').value;
  const jumlahRobux = parseInt(document.getElementById('jumlahRobux').value);
  const metode = document.getElementById('metode').value;
  
  if (!username || !jumlahRobux || jumlahRobux < CONFIG.robuxMin || jumlahRobux > CONFIG.robuxMax) {
    showNotification('Harap isi semua field dengan benar!', 'error');
    return;
  }
  
  if (jumlahRobux > appData.stok) {
    showNotification('Stok tidak mencukupi!', 'error');
    return;
  }
  
  const hargaTotal = jumlahRobux * appData.harga_per_robux;
  const orderId = Date.now();
  
  // Create order
  const order = {
    id: orderId,
    userId: currentUser.id,
    username: currentUser.username,
    robloxUsername: username,
    jumlahRobux,
    hargaTotal,
    metode,
    status: 'pending',
    tanggal: new Date().toLocaleString('id-ID')
  };
  
  // Save to user orders
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex(u => u.id === currentUser.id);
  if (userIndex !== -1) {
    users[userIndex].orders = users[userIndex].orders || [];
    users[userIndex].orders.push(order);
    localStorage.setItem('users', JSON.stringify(users));
  }
  
  // Update app data
  appData.stok -= jumlahRobux;
  appData.pesanan += 1;
  appData.robux_terjual += jumlahRobux;
  appData.total_pendapatan += hargaTotal;
  saveAppData();
  
  // Update displays
  updateDisplay();
  generatePaketCards();
  loadUserHistory();
  
  // Create WhatsApp message
  const message = `*PEMESANAN ROBUX BARU*
  
ID Pesanan: ${orderId}
Nama: ${currentUser.username}
Username Roblox: ${username}
Jumlah Robux: ${jumlahRobux.toLocaleString()}
Harga Total: Rp ${hargaTotal.toLocaleString()}
Metode Pembayaran: ${metode}
Tanggal: ${order.tanggal}

Silakan lakukan pembayaran dan kirim bukti transfer.`;
  
  const whatsappURL = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, '_blank');
  
  showNotification('Pesanan berhasil dikirim ke WhatsApp!', 'success');
  
  // Reset form
  document.getElementById('orderForm').reset();
  document.getElementById('jumlahRobux').value = 100;
  updateHargaTotal();
}

// Load user history
function loadUserHistory() {
  if (!currentUser) return;
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.id === currentUser.id);
  const historyList = document.getElementById('historyList');
  
  if (!user || !user.orders || user.orders.length === 0) {
    historyList.innerHTML = '<p class="text-gray-400 italic">Belum ada pemesanan</p>';
    return;
  }
  
  historyList.innerHTML = user.orders.map(order => `
    <div class="history-card">
      <h4>Pesanan #${order.id}</h4>
      <div class="history-info">
        <p><strong>Username Roblox:</strong> ${order.robloxUsername}</p>
        <p><strong>Jumlah Robux:</strong> ${order.jumlahRobux.toLocaleString()}</p>
        <p><strong>Harga Total:</strong> Rp ${order.hargaTotal.toLocaleString()}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Tanggal:</strong> ${order.tanggal}</p>
      </div>
    </div>
  `).join('');
}

// Admin functions
function updateStock() {
  if (!currentUser || currentUser.role !== 'admin') {
    showNotification('Akses ditolak!', 'error');
    return;
  }
  
  const newStock = parseInt(document.getElementById('newStock').value);
  if (isNaN(newStock) || newStock < 0) {
    showNotification('Stok harus berupa angka positif!', 'error');
    return;
  }
  
  appData.stok = newStock;
  saveAppData();
  updateDisplay();
  generatePaketCards();
  
  showNotification('Stok berhasil diperbarui!', 'success');
  document.getElementById('newStock').value = '';
}

function updatePrice() {
  if (!currentUser || currentUser.role !== 'admin') {
    showNotification('Akses ditolak!', 'error');
    return;
  }
  
  const newPrice = parseFloat(document.getElementById('pricePerRobux').value);
  if (isNaN(newPrice) || newPrice <= 0) {
    showNotification('Harga harus berupa angka positif!', 'error');
    return;
  }
  
  appData.harga_per_robux = newPrice;
  saveAppData();
  updateDisplay();
  generatePaketCards();
  updateHargaTotal();
  
  showNotification('Harga berhasil diperbarui!', 'success');
}

function resetStats() {
  if (!currentUser || currentUser.role !== 'admin') {
    showNotification('Akses ditolak!', 'error');
    return;
  }
  
  if (confirm('Apakah Anda yakin ingin mereset semua statistik?')) {
    appData.pesanan = 0;
    appData.robux_terjual = 0;
    appData.total_pendapatan = 0;
    saveAppData();
    updateDisplay();
    
    showNotification('Statistik berhasil direset!', 'success');
  }
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 4000);
}

function saveCurrentUser() {
  if (currentUser) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  } else {
    localStorage.removeItem('currentUser');
  }
}
