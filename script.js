// ================= DATA PRODUK =================
const products = [
    { id: 1, name: "Nike Air Zoom Pegasus", price: 1200000, stock: 10 },
    { id: 2, name: "Adidas Ultraboost 22", price: 1500000, stock: 8 },
    { id: 3, name: "Puma Velocity Nitro", price: 900000, stock: 12 },
    { id: 4, name: "New Balance Fresh Foam 1080", price: 1300000, stock: 6 },
    { id: 5, name: "Asics Gel-Kayano 30", price: 1400000, stock: 5 },
    { id: 6, name: "Reebok Floatride Energy", price: 800000, stock: 9 }
];

// Nomor WhatsApp toko
const WHATSAPP_NUMBER = "6281993371188";

// ================= STATE =================
let cart = [];
let shippingAddress = null;

// ================= DOM ELEMENTS =================
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const totalPriceElement = document.getElementById('totalPrice');
const cartCountElement = document.getElementById('cart-count');

// ================= EVENT LISTENERS =================

// Buka/tutup keranjang saat klik icon
cartIcon.addEventListener('click', () => {
    toggleCart(true);
});

// Tutup keranjang saat klik tombol close
closeCartBtn.addEventListener('click', () => {
    toggleCart(false);
});

// Tutup keranjang saat klik overlay
cartOverlay.addEventListener('click', () => {
    toggleCart(false);
});

// ================= FUNGSI UTAMA =================

// Fungsi untuk toggle cart sidebar
function toggleCart(show) {
    if (show) {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Fungsi untuk update jumlah item di cart icon
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountElement.textContent = totalItems;
    
    if (totalItems > 0) {
        cartIcon.classList.add('has-items');
    } else {
        cartIcon.classList.remove('has-items');
    }
}

// Fungsi untuk menambahkan produk ke keranjang
function addToCart(id) {
    const product = products.find(p => p.id === id);
    
    if (!product) {
        alert('Produk tidak ditemukan!');
        return;
    }
    
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        if (existingItem.qty < product.stock) {
            existingItem.qty++;
        } else {
            alert('Maaf, stok tidak mencukupi!');
            return;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            qty: 1,
            checked: true
        });
    }
    
    renderCart();
    updateCartCount();
    
    // Feedback ke user
    showNotification(`${product.name} ditambahkan ke keranjang!`);
}

// Fungsi untuk beli langsung (langsung WhatsApp)
function buyNow(id) {
    const product = products.find(p => p.id === id);
    
    if (!product) {
        alert('Produk tidak ditemukan!');
        return;
    }
    
    const message = `Halo Toko Riki, saya ingin membeli:\n\n${product.name} x1 = Rp ${product.price.toLocaleString()}\n\nTerima kasih.`;
    
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Fungsi untuk merender keranjang
function renderCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Keranjang belanja kosong</p>
            </div>
        `;
        totalPriceElement.textContent = 'Rp0';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <input type="checkbox" 
                   ${item.checked ? 'checked' : ''} 
                   onchange="toggleItem(${item.id})">
            
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-price">Rp ${item.price.toLocaleString()}</div>
            </div>
            
            <div class="qty-controls">
                <button onclick="decreaseQty(${item.id})">-</button>
                <span>${item.qty}</span>
                <button onclick="increaseQty(${item.id})">+</button>
            </div>
            
            <div class="item-total">Rp ${(item.price * item.qty).toLocaleString()}</div>
            
            <button class="remove-item" onclick="removeItem(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItemsContainer.appendChild(itemElement);
    });
    
    calculateTotal();
}

// Fungsi untuk menambah jumlah item
function increaseQty(id) {
    const item = cart.find(p => p.id === id);
    const product = products.find(p => p.id === id);
    
    if (item && product) {
        if (item.qty < product.stock) {
            item.qty++;
            renderCart();
            updateCartCount();
        } else {
            alert('Maaf, stok tidak mencukupi!');
        }
    }
}

// Fungsi untuk mengurangi jumlah item
function decreaseQty(id) {
    const item = cart.find(p => p.id === id);
    
    if (item) {
        if (item.qty > 1) {
            item.qty--;
            renderCart();
            updateCartCount();
        } else {
            // Jika qty = 1, hapus item
            removeItem(id);
        }
    }
}

// Fungsi untuk menghapus item dari keranjang
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
    updateCartCount();
}

// Fungsi untuk toggle checkbox item
function toggleItem(id) {
    const item = cart.find(p => p.id === id);
    
    if (item) {
        item.checked = !item.checked;
        calculateTotal();
    }
}

// Fungsi untuk menghitung total harga
function calculateTotal() {
    let total = 0;
    
    cart.forEach(item => {
        if (item.checked) {
            total += item.price * item.qty;
        }
    });
    
    totalPriceElement.textContent = 'Rp ' + total.toLocaleString();
}

// Fungsi untuk checkout
function checkout() {
    const checkedItems = cart.filter(item => item.checked);
    
    if (checkedItems.length === 0) {
        alert('Silakan pilih produk yang ingin dibeli terlebih dahulu!');
        return;
    }
    
    let message = "Halo Toko Riki, saya ingin memesan:\n\n";
    
    let totalOrder = 0;
    
    checkedItems.forEach(item => {
        const subtotal = item.price * item.qty;
        totalOrder += subtotal;
        message += `• ${item.name}\n`;
        message += `  Jumlah: ${item.qty} x Rp ${item.price.toLocaleString()}\n`;
        message += `  Subtotal: Rp ${subtotal.toLocaleString()}\n\n`;
    });
    
    message += "================================\n";
    message += `TOTAL PEMBAYARAN: Rp ${totalOrder.toLocaleString()}\n`;
    message += "================================\n\n";
    message += "Mohon konfirmasi pesanan saya. Terima kasih!";
    
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message) {
    // Buat element notifikasi
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #27ae60, #219a52);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    // Tambahkan ke body
    document.body.appendChild(notification);
    
    // Hapus setelah 3 detik
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Tambah animasi CSS untuk notifikasi
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ================= FUNGSI ALAMAT PENGIRIMAN =================

// Fungsi untuk memulai checkout (tampilkan form alamat)
function startCheckout() {
    const checkedItems = cart.filter(item => item.checked);
    
    if (checkedItems.length === 0) {
        alert('Silakan pilih produk yang ingin dibeli terlebih dahulu!');
        return;
    }
    
    // Jika sudah ada alamat tersimpan, langsung checkout ke WhatsApp
    if (shippingAddress) {
        checkoutWithAddress();
        return;
    }
    
    // Tampilkan form alamat
    showShippingForm();
}

// Tampilkan form alamat pengiriman
function showShippingForm() {
    const shippingForm = document.getElementById('shippingForm');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.querySelector('.cart-footer');
    
    // Jika sudah ada alamat tersimpan, tampilkan
    if (shippingAddress) {
        showSavedAddress();
        return;
    }
    
    // Tampilkan form
    shippingForm.classList.add('active');
    cartItems.style.display = 'none';
    cartFooter.style.display = 'none';
}

// Tampilkan alamat yang sudah disimpan
function showSavedAddress() {
    const shippingForm = document.getElementById('shippingForm');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.querySelector('.cart-footer');
    
    // Cek apakah element saved-address sudah ada
    let savedAddressEl = document.getElementById('savedAddress');
    
    if (!savedAddressEl) {
        // Buat element saved-address
        savedAddressEl = document.createElement('div');
        savedAddressEl.id = 'savedAddress';
        savedAddressEl.className = 'saved-address';
        
        // Insert sebelum form
        shippingForm.parentNode.insertBefore(savedAddressEl, shippingForm);
    }
    
    // Update konten
    savedAddressEl.innerHTML = `
        <h4><i class="fas fa-check-circle"></i> Alamat Pengiriman:</h4>
        <p><strong>${shippingAddress.recipientName}</strong></p>
        <p>${shippingAddress.phoneNumber}</p>
        <p>${shippingAddress.address}</p>
        <p>${shippingAddress.city} - ${shippingAddress.postalCode}</p>
        <button onclick="editAddress()" class="edit-address">
            <i class="fas fa-edit"></i> Ubah Alamat
        </button>
    `;
    
    savedAddressEl.classList.add('active');
    shippingForm.classList.remove('active');
    cartItems.style.display = 'block';
    cartFooter.style.display = 'block';
}

// Fungsi untuk mengubah alamat
function editAddress() {
    const savedAddressEl = document.getElementById('savedAddress');
    const shippingForm = document.getElementById('shippingForm');
    
    // Isi form dengan data yang ada
    document.getElementById('recipientName').value = shippingAddress.recipientName || '';
    document.getElementById('phoneNumber').value = shippingAddress.phoneNumber || '';
    document.getElementById('shippingAddress').value = shippingAddress.address || '';
    document.getElementById('city').value = shippingAddress.city || '';
    document.getElementById('postalCode').value = shippingAddress.postalCode || '';
    
    // Tampilkan form, sembunyikan saved address
    if (savedAddressEl) {
        savedAddressEl.classList.remove('active');
    }
    shippingForm.classList.add('active');
    
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.querySelector('.cart-footer');
    cartItems.style.display = 'none';
    cartFooter.style.display = 'none';
}

// Konfirmasi alamat dan lanjut ke checkout
function confirmAddress() {
    const recipientName = document.getElementById('recipientName').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const address = document.getElementById('shippingAddress').value.trim();
    const city = document.getElementById('city').value.trim();
    const postalCode = document.getElementById('postalCode').value.trim();
    
    // Validasi
    if (!recipientName) {
        alert('Silakan masukkan nama penerima!');
        document.getElementById('recipientName').focus();
        return;
    }
    if (!phoneNumber) {
        alert('Silakan masukkan nomor telepon!');
        document.getElementById('phoneNumber').focus();
        return;
    }
    if (!address) {
        alert('Silakan masukkan alamat lengkap!');
        document.getElementById('shippingAddress').focus();
        return;
    }
    if (!city) {
        alert('Silakan masukkan kota/kabupaten!');
        document.getElementById('city').focus();
        return;
    }
    if (!postalCode) {
        alert('Silakan masukkan kode pos!');
        document.getElementById('postalCode').focus();
        return;
    }
    
    // Simpan alamat
    shippingAddress = {
        recipientName,
        phoneNumber,
        address,
        city,
        postalCode
    };
    
    // Sembunyikan form dan tampilkan ringkasan
    const shippingForm = document.getElementById('shippingForm');
    shippingForm.classList.remove('active');
    
    // Tampilkan alamat tersimpan
    showSavedAddress();
    
    // Tampilkan kembali item cart dan footer
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.querySelector('.cart-footer');
    cartItems.style.display = 'block';
    cartFooter.style.display = 'block';
    
    showNotification('Alamat pengiriman telah disimpan!');
}

// Batalkan input alamat
function cancelAddress() {
    const shippingForm = document.getElementById('shippingForm');
    const savedAddressEl = document.getElementById('savedAddress');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.querySelector('.cart-footer');
    
    // Jika tidak ada alamat tersimpan, sembunyikan form
    if (!shippingAddress) {
        shippingForm.classList.remove('active');
        cartItems.style.display = 'block';
        cartFooter.style.display = 'block';
    } else {
        // Tampilkan alamat tersimpan
        showSavedAddress();
    }
    
    // Clear form
    document.getElementById('recipientName').value = '';
    document.getElementById('phoneNumber').value = '';
    document.getElementById('shippingAddress').value = '';
    document.getElementById('city').value = '';
    document.getElementById('postalCode').value = '';
}

// Fungsi checkout utama (dengan alamat)
function checkoutWithAddress() {
    const checkedItems = cart.filter(item => item.checked);
    
    if (checkedItems.length === 0) {
        alert('Silakan pilih produk yang ingin dibeli!');
        return;
    }
    
    let message = "Halo Toko Riki, saya ingin memesan:\n\n";
    
    let totalOrder = 0;
    let totalItems = 0;
    
    // Detail produk
    checkedItems.forEach(item => {
        const subtotal = item.price * item.qty;
        totalOrder += subtotal;
        totalItems += item.qty;
        message += `• ${item.name}\n`;
        message += `  Jumlah: ${item.qty} x Rp ${item.price.toLocaleString()}\n`;
        message += `  Subtotal: Rp ${subtotal.toLocaleString()}\n\n`;
    });
    
    message += "================================\n";
    message += `TOTAL ITEM: ${totalItems} pcs\n`;
    message += `TOTAL PEMBAYARAN: Rp ${totalOrder.toLocaleString()}\n`;
    message += "================================\n\n";
    
    // Tambahkan alamat pengiriman
    message += "📦 ALAMAT PENGIRIMAN:\n";
    message += `Nama: ${shippingAddress.recipientName}\n`;
    message += `Telepon: ${shippingAddress.phoneNumber}\n`;
    message += `Alamat: ${shippingAddress.address}\n`;
    message += `${shippingAddress.city} - ${shippingAddress.postalCode}\n\n`;
    
    message += "Mohon konfirmasi pesanan saya. Terima kasih!";
    
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Override fungsi checkout asli untuk menggunakan alamat
const originalCheckout = checkout;
checkout = function() {
    if (shippingAddress) {
        checkoutWithAddress();
    } else {
        startCheckout();
    }
};

// ================= INISIALISASI =================
// Render cart saat halaman load
renderCart();
updateCartCount();

