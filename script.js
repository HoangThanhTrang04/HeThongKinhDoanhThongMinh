// =========================================================
// 1. IMPORT PHẢI LUÔN Ở ĐẦU FILE (KHẮC PHỤC LỖI IMPORT)
// =========================================================
import { db } from "./firebase.js";
import { ref, onValue, set, get, child, query, limitToFirst } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

// =========================================================
// 2. BỌC TOÀN BỘ CODE TRONG DOMContentLoaded (KHẮC PHỤC LỖI NULL)
// =========================================================
document.addEventListener('DOMContentLoaded', () => {

    let listings = [];
// ... (Khai báo biến DOM) ...

// =========================================================
// LẤY DATA TỪ FIREBASE (CHỈ LẤY MAX 6 BẢN GHI)
// =========================================================

// 1. Tạo một tham chiếu (reference) đến nút 'listings'
const listingsRef = ref(db, "listings");

// 2. Tạo một truy vấn (query) giới hạn số lượng
const limitedQuery = query(listingsRef, limitToFirst(6));

// 3. Sử dụng limitedQuery trong hàm onValue
onValue(limitedQuery, (snapshot) => { 
    const data = snapshot.val();
    
    listings = [];
    if (snapshot.exists()) {
        snapshot.forEach(childSnapshot => {
            const item = childSnapshot.val();
            item.id = childSnapshot.key;
            listings.push(item);
        });
    } else {
        console.warn("⚠️ Firebase trả về null, chưa có dữ liệu trong 'properties'");
    }
    
    displayListings(listings);
});
    // =========================================================
    // KHAI BÁO BIẾN DOM
    // =========================================================
    const modal = document.getElementById("loginModal");
    const loginBtn = document.getElementById("loginBtn");
    const closeModalBtn = document.getElementById("closeModal");
    const loginView = document.getElementById('loginView'); 
    const registerView = document.getElementById('registerView');
    const switchToRegisterBtn = document.getElementById('switchToRegister');
    const switchToLoginBtn = document.getElementById('switchToLogin');
    
    const filterBtnHeader = document.getElementById('filterBtn');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');

    // Biến cho form Login/Register
    const registerUsernameInput = document.getElementById('registerUsername');
    const registerPasswordInput = document.getElementById('registerPassword');
    const loginUsernameInput = document.getElementById('loginUsername');
    const loginPasswordInput = document.getElementById('loginPassword');
    const registerButton = document.getElementById('signUpBtn');
    const loginButton = document.getElementById('signInBtn');


    // =========================================================
    // HÀM QUẢN LÝ TRẠNG THÁI ĐĂNG NHẬP BỀN VỮNG (localStorage)
    // =========================================================

    function updateAuthStatus(username = null) {
        let logoutBtn = document.getElementById("logoutBtn");

        if (username) {
            // Trạng thái ĐĂNG NHẬP
            localStorage.setItem('currentUser', username); // LƯU VÀO LOCAL STORAGE

            loginBtn.textContent = "Xin chào " + username;
            loginBtn.dataset.logged = "true";

            // Thêm nút Đăng xuất nếu chưa tồn tại
            if (!logoutBtn) {
                logoutBtn = document.createElement("button");
                logoutBtn.id = "logoutBtn";
                logoutBtn.textContent = "Đăng xuất";
                logoutBtn.style.marginLeft = "10px";
                loginBtn.parentNode.appendChild(logoutBtn);
                
                // Gán sự kiện Đăng xuất
                logoutBtn.onclick = handleLogout; 
            }

        } else {
            // Trạng thái ĐĂNG XUẤT
            localStorage.removeItem('currentUser'); // XÓA KHỎI LOCAL STORAGE

            loginBtn.textContent = "Đăng nhập/Đăng ký";
            delete loginBtn.dataset.logged;
            if (logoutBtn) {
                logoutBtn.remove();
            }
        }
    }

    // Hàm xử lý Đăng xuất
    function handleLogout() {
        alert("Bạn đã đăng xuất!");
        updateAuthStatus(null); 
    }


    // =========================================================
    // LẤY DATA TỪ FIREBASE
    // =========================================================
    onValue(ref(db, "listings"), (snapshot) => {
        const data = snapshot.val();
        
        listings = [];
        if (snapshot.exists()) {
            snapshot.forEach(childSnapshot => {
                const item = childSnapshot.val();
                item.id = childSnapshot.key;
                listings.push(item);
            });
        } else {
            console.warn("⚠️ Firebase trả về null, chưa có dữ liệu trong 'properties'");
        }
        
        displayListings(listings);
    });

    // =========================================================
    // HIỂN THỊ LISTINGS
    // =========================================================
    function displayListings(data) {
        const container = document.getElementById('listing');
        if (!container) return;

        container.innerHTML = '';
        if (data.length === 0) {
            container.innerHTML = '<p>Không tìm thấy mặt bằng phù hợp.</p>';
            return;
        }
        data.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('listing-item');
            
            const itemToSave = { ...item, id: item.id || Math.random().toString(36).substring(2, 9) }; 
            div.innerHTML = `
                <img src="${itemToSave.image || 'placeholder.jpg'}" alt="${itemToSave.name}">
                <div class="listing-content">
                    <h3>${itemToSave.name}</h3>
                    <p>Vị trí: ${itemToSave.location}</p>
                    <p>Giá: ${itemToSave.price} triệu/tháng</p>
                    <p>Diện tích: ${itemToSave.area} m²</p>
                    <p>Loại hình: ${itemToSave.businessType}</p>
                    <p class="rating">Đánh giá: ${itemToSave.rating} ⭐</p>
                </div>
            `;
            div.addEventListener('click', () => {
                localStorage.setItem('selectedItem', JSON.stringify(itemToSave));
                window.location.href = 'detail.html';
            });
            container.appendChild(div);
        });
    }

    // =========================================================
    // BỘ LỌC
    // =========================================================
    function handleFiltering() {
        const location = document.getElementById('location').value.toLowerCase();
        const minPrice = Number(document.getElementById('minPrice').value);
        const maxPrice = Number(document.getElementById('maxPrice').value);
        const minArea = Number(document.getElementById('minArea').value);
        const maxArea = Number(document.getElementById('maxArea').value);
        const businessType = document.getElementById('businessType').value;

        const filtered = listings.filter(item => {
            return (!location || item.location.toLowerCase().includes(location)) &&
                    (!minPrice || item.price >= minPrice) &&
                    (!maxPrice || item.price <= maxPrice) &&
                    (!minArea || item.area >= minArea) &&
                    (!maxArea || item.area <= maxArea) &&
                    (!businessType || item.businessType === businessType);
        });

        displayListings(filtered);
    }
    
    if (filterBtnHeader) filterBtnHeader.addEventListener('click', handleFiltering);
    if (applyFiltersBtn) applyFiltersBtn.addEventListener('click', handleFiltering);


    // =========================================================
    // QUẢN LÝ POPUP LOGIN/REGISTER
    // =========================================================

    // Hàm chuyển đổi giữa Đăng nhập và Đăng ký
    function showMode(mode) {
        if (loginView && registerView) { 
            loginView.style.display = (mode === 'login' ? 'block' : 'none');
            registerView.style.display = (mode === 'register' ? 'block' : 'none');
        }
    }

    // Mở modal
    if (loginBtn && modal) {
        loginBtn.onclick = () => {
            if (loginBtn.dataset.logged === "true") return; // Không mở nếu đã đăng nhập
            modal.style.display = "block";
            showMode('login'); 
        }
    }

    // Chuyển đổi giữa hai form
    if (switchToRegisterBtn) switchToRegisterBtn.onclick = (e) => { e.preventDefault(); showMode('register'); };
    if (switchToLoginBtn) switchToLoginBtn.onclick = (e) => { e.preventDefault(); showMode('login'); };

    // Đóng modal
    if (closeModalBtn) closeModalBtn.onclick = () => modal.style.display = "none";
    if (window && modal) {
        window.onclick = (event) => { if(event.target==modal) modal.style.display="none"; }
    }


    // =========================================================
    // LOGIN / REGISTER (FIREBASE DATABASE)
    // =========================================================

    // --- Đăng Ký ---
    if (registerButton) { 
        registerButton.onclick = () => {
            const username = registerUsernameInput.value.trim();
            const password = registerPasswordInput.value.trim();
            
            if (!username || !password) {
                alert("Vui lòng điền đầy đủ thông tin đăng ký!");
                return;
            }

            const userRef = ref(db, `users/${username}`);

            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    alert("Tên đăng nhập đã tồn tại!");
                    return;
                }

                set(userRef, { password: password, createdAt: Date.now() })
                .then(() => {
                    alert("Đăng ký thành công! Vui lòng đăng nhập.");
                    registerUsernameInput.value = "";
                    registerPasswordInput.value = "";
                    showMode('login');
                })
                .catch(error => {
                    console.error("Lỗi khi đăng ký:", error);
                    alert("Đăng ký thất bại!");
                });

            }).catch((error) => {
                console.error("Lỗi khi kiểm tra người dùng:", error);
                alert("Đăng ký thất bại!");
            });
        }
    }

    // --- Đăng Nhập ---
    if (loginButton) { 
        loginButton.onclick = () => {
            const username = loginUsernameInput.value.trim();
            const password = loginPasswordInput.value.trim();
            
            if (!username || !password) {
                alert("Vui lòng điền đầy đủ thông tin đăng nhập!");
                return;
            }

            const userRef = ref(db, `users/${username}`);

            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    
                    if (userData.password === password) {
                        alert("Đăng nhập thành công!");
                        modal.style.display = "none";

                        // GỌI HÀM MỚI ĐỂ LƯU VÀ CẬP NHẬT TRẠNG THÁI
                        updateAuthStatus(username); 
                        
                        loginUsernameInput.value = "";
                        loginPasswordInput.value = "";
                    } else {
                        alert("Mật khẩu không đúng!");
                    }
                } else {
                    alert("Tên đăng nhập không tồn tại!");
                }
            }).catch((error) => {
                console.error("Lỗi khi đăng nhập:", error);
                alert("Đăng nhập thất bại!");
            });
        }
    }
    
    // =========================================================
    // KHỞI TẠO: KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP BỀN VỮNG
    // =========================================================
    const storedUsername = localStorage.getItem('currentUser');
    if (storedUsername) {
        updateAuthStatus(storedUsername); // Cập nhật giao diện nếu đã đăng nhập
    }

}); // KẾT THÚC KHỐI DOMContentLoaded