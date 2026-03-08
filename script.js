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

// ================= INISIALISASI =================
// Render cart saat halaman load
renderCart();
updateCartCount();

