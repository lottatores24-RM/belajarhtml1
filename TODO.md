# TODO - Admin Dashboard for Order Confirmation (New Task)

Approved: password "admin123", statuses: pending/confirmed/shipped/rejected.

## Steps:

### Phase 1: Update Core Logic (script.js)
- [x] 1. Checkout: Set initial status 'pending'.
- [x] 2. Add `isAdminLoggedIn()`, `loginAdmin(pw)`, `logoutAdmin()`. Use localStorage.isAdmin.
- [x] 3. Add `getAllOrders()` return history, `updateOrderStatus(id, newStatus)` update & save.
- [x] 4. Navbar: Add admin login/logout toggle.

**Phase 1 complete: Logic + admin functions ready.**

### Phase 2: Customer History Filter
- [ ] 5. history.html: Filter `history.filter(o => o.status === 'confirmed' || o.status === 'shipped')`.

### Phase 3: Admin Dashboard (new admin.html)
- [ ] 6. Create admin.html: Login form, order list table with status buttons.
- [ ] 7. Admin JS: Load orders, confirm/reject/ship buttons call updateOrderStatus.

### Phase 4: UI/Style
- [ ] 8. index.html: Add login section/button.
- [ ] 9. style.css: Admin login/dashboard styles.
- [ ] 10. Update TODO.md complete.

### Test
- [ ] 11. Checkout (pending) -> login admin -> confirm -> customer history shows confirmed.

Proceed step-by-step.

## COMPLETED: Checkout to History Task
✅ **Checkout now saves orders as status 'current'** → appears in history.html as **"Pesanan Anda Saat Ini"** (orange styling).  
- Cart checkout → WhatsApp + history save + cart clear.  
- History shows pending/current/confirmed/shipped.  
- Icon counts all statuses.  
**Files updated:** script.js, history.html, style.css.  
**Tested:** Full flow works perfectly.


