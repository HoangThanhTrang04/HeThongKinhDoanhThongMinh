// manage.js
// =========================================================
// 1. IMPORT
// =========================================================
import { db } from "./firebase.js";
import { ref as dbRef, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {

    let listings = [];
    const manageListingsContainer = document.getElementById('manageListingsContainer');
    const manageStatus = document.getElementById('manageStatus');
    const logoutBtn = document.getElementById("logoutBtn"); 
    const loginBtn = document.getElementById("loginBtn"); 
    
    // Biến cho form Owner (Post/Edit Modal)
    const postModal = document.getElementById('postModal');
    const closePostModalBtn = document.getElementById('closePostModalBtn');
    const newListingForm = document.getElementById('new-listing-form');
    const postIdInput = document.getElementById('post-id'); 
    const postModalTitle = document.getElementById('postModalTitle');
    const submitPostBtn = document.getElementById('submitPostBtn');
    
    let currentUser = localStorage.getItem('currentUser');

    // =========================================================
    // 2. LOGIC ĐĂNG NHẬP/ĐĂNG XUẤT (TỐI GIẢN)
    // =========================================================
    function checkAuth() {
        if (!currentUser) {
            manageStatus.textContent = "⚠️ Bạn chưa đăng nhập. Vui lòng quay lại trang chủ để đăng nhập.";
            manageListingsContainer.innerHTML = '';
            loginBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
        } else {
            loginBtn.textContent = "Xin chào " + currentUser;
            loginBtn.style.display = 'block'; // Hiển thị tên
            logoutBtn.style.display = 'block';
            fetchListings(currentUser); // Nếu có user, bắt đầu fetch data
        }
    }

    function handleLogout() {
        localStorage.removeItem('currentUser'); 
        alert("Bạn đã đăng xuất!");
        window.location.href = 'index.html'; // Chuyển về trang chủ sau khi đăng xuất
    }

    if (logoutBtn) logoutBtn.onclick = handleLogout;
    
    // =========================================================
    // 3. LẤY DATA VÀ HIỂN THỊ (QUẢN LÝ)
    // =========================================================
    function fetchListings(owner) {
        const listingsRef = dbRef(db, "listings");
        
        // Lắng nghe thay đổi trên toàn bộ data
        onValue(listingsRef, (snapshot) => { 
            listings = [];
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    const item = childSnapshot.val();
                    item.id = childSnapshot.key;
                    listings.push(item);
                });
            } 
            displayManagedListings(owner);
        });
    }
    
    // Hàm hiển thị bài đăng của Owner hiện tại
    function displayManagedListings(owner) {
        manageListingsContainer.innerHTML = '';
        
        // FIX: CHUẨN HÓA VỀ CHỮ THƯỜNG TRƯỚC KHI LỌC
        const lowerCaseOwner = owner.toLowerCase();
        
        const managed = listings.filter(item => {
            const itemOwner = item.owner ? item.owner.toLowerCase() : '';
            return itemOwner === lowerCaseOwner;
        });

        if (managed.length === 0) {
            manageListingsContainer.innerHTML = '<p>Bạn chưa đăng tin nào.</p>';
            return;
        }

        managed.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('managed-item');

            div.innerHTML = `
                <img src="${item.image || 'placeholder.jpg'}" alt="${item.name}">
                <div class="managed-content">
                    <h4>${item.name} (${item.location})</h4>
                    <p>Giá: ${item.price} tr/tháng | DT: ${item.area} m²</p>
                </div>
                <div class="managed-actions">
                    <button class="edit-btn" data-id="${item.id}">Sửa</button>
                    <button class="delete-btn" data-id="${item.id}">Xóa</button>
                </div>
            `;
            manageListingsContainer.appendChild(div);
        });

        // Gán sự kiện Sửa/Xóa
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.onclick = (e) => handleEdit(e.target.dataset.id);
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = (e) => handleDelete(e.target.dataset.id, owner);
        });
    }
    
    // =========================================================
    // 4. CHỨC NĂNG XÓA
    // =========================================================
    function handleDelete(id, owner) {
        if (!confirm("Bạn có chắc chắn muốn xóa tin đăng này không?")) return;

        const itemToDelete = listings.find(item => item.id === id);
        if (!itemToDelete || itemToDelete.owner.toLowerCase() !== owner.toLowerCase()) {
            alert("Lỗi: Không tìm thấy tin đăng hoặc bạn không phải chủ sở hữu.");
            return;
        }

        const listingRef = dbRef(db, `listings/${id}`);
        
        remove(listingRef)
        .then(() => {
            alert("Tin đăng đã được xóa thành công!");
            // Data tự cập nhật nhờ onValue, chỉ cần hiển thị thông báo
        })
        .catch(error => {
            console.error("Lỗi xóa tin đăng:", error);
            alert("Xóa tin đăng thất bại!");
        });
    }

    // =========================================================
    // 5. CHỨC NĂNG SỬA (Dùng Modal Post/Edit)
    // =========================================================
    if (closePostModalBtn) closePostModalBtn.onclick = () => postModal.style.display = 'none';
    window.addEventListener('click', function(event) {
        if (event.target == postModal) {
            postModal.style.display = 'none';
        }
    });

    function handleEdit(id) {
        const itemToEdit = listings.find(item => item.id === id);

        if (!itemToEdit) {
            alert("Không tìm thấy tin đăng để sửa!");
            return;
        }
        
        postModal.style.display = 'block';
        postModalTitle.textContent = "Chỉnh Sửa Tin Đăng ✏️";
        submitPostBtn.textContent = "Cập nhật Tin đăng";
        
        // Đổ dữ liệu vào form
        postIdInput.value = itemToEdit.id;
        document.getElementById('post-title').value = itemToEdit.name;
        document.getElementById('post-price').value = itemToEdit.price;
        document.getElementById('post-area').value = itemToEdit.area;
        document.getElementById('post-location').value = itemToEdit.location;
        document.getElementById('post-businessType').value = itemToEdit.businessType;
        document.getElementById('post-image-url').value = itemToEdit.image;
        document.getElementById('post-description').value = itemToEdit.description;
    }
    
    // Xử lý sự kiện Submit Form Sửa bài (cần copy toàn bộ logic update từ script.js sang)
    if (newListingForm) {
        newListingForm.onsubmit = function(e) {
            e.preventDefault();
            
            const id = postIdInput.value; 
            if (!id) {
                alert("Lỗi: Không tìm thấy ID bài đăng để cập nhật.");
                return;
            }
            
            const title = document.getElementById('post-title').value;
            const price = parseFloat(document.getElementById('post-price').value);
            const area = parseInt(document.getElementById('post-area').value);
            const location = document.getElementById('post-location').value;
            const businessType = document.getElementById('post-businessType').value;
            const description = document.getElementById('post-description').value;
            const imageUrl = document.getElementById('post-image-url').value.trim(); 
            const owner = localStorage.getItem('currentUser'); 

            if (!owner || !imageUrl) { 
                alert("Lỗi hệ thống: Không tìm thấy thông tin chủ sở hữu hoặc ảnh.");
                return;
            }
            
            const currentListing = listings.find(l => l.id === id);
            
            const updatedListingData = {
                name: title,
                location: location,
                price: price, 
                area: area,
                businessType: businessType,
                description: description,
                image: imageUrl,
                rating: currentListing.rating,
                owner: currentListing.owner, 
            };
            
            const listingRef = dbRef(db, `listings/${id}`);
            update(listingRef, updatedListingData)
            .then(() => {
                alert(`🎉 Tin đăng ID ${id} đã cập nhật thành công!`);
                postModal.style.display = 'none';
                newListingForm.reset();
            })
            .catch(error => {
                console.error(`Lỗi quá trình sửa tin:`, error);
                alert(`Thao tác sửa tin thất bại!`);
            });
        };
    }
    
    // =========================================================
    // KHỞI CHẠY
    // =========================================================
    checkAuth();
});