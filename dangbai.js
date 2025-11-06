import { db } from "./firebase.js";
// Cần import thêm 'orderByChild' và 'limitToLast'
import { ref as dbRef, onValue, set, get, query, limitToLast, orderByChild, push, update } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
// Biến cho form Owner
    const postModal = document.getElementById('postModal');
    const postBtn = document.getElementById('postBtn');
    const closePostModalBtn = document.getElementById('closePostModalBtn');
    const newListingForm = document.getElementById('new-listing-form');
    const postImageInput = document.getElementById('post-images');

// KHỞI TẠO: KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP BỀN VỮNG
    // =========================================================
    const storedUsername = localStorage.getItem('currentUser');
    if (storedUsername) {
        updateAuthStatus(storedUsername); // Cập nhật giao diện nếu đã đăng nhập
    }

    //--đăng bài--
    // 1. Mở Modal đăng bài
    if (postBtn) {
        postBtn.onclick = function() {
            postModal.style.display = 'block';
        }
    }

    // 2. Đóng Modal đăng bài (nút X)
    if (closePostModalBtn) {
        closePostModalBtn.onclick = function() {
            postModal.style.display = 'none';
        }
    }

    // 3. Đóng Modal đăng bài (click ngoài)
    window.addEventListener('click', function(event) {
        if (event.target == postModal) {
            postModal.style.display = 'none';
        }
    });

    // =========================================================
    // 5. LOGIC ĐĂNG BÀI CHỦ NHÀ (SUBMIT FORM VÀ UPLOAD ẢNH)
    // =========================================================

    // Mở Modal đăng bài
    if (postBtn) {
        postBtn.onclick = function() {
            if (!localStorage.getItem('currentUser')) {
                alert("Bạn cần đăng nhập để đăng tin!");
                modal.style.display = "block";
                showMode('login');
                return;
            }
            postModal.style.display = 'block';
        }
    }

    // Đóng Modal đăng bài
    if (closePostModalBtn) {
        closePostModalBtn.onclick = function() {
            postModal.style.display = 'none';
        }
    }
    window.addEventListener('click', function(event) {
        if (event.target == postModal) {
            postModal.style.display = 'none';
        }
    });

    
    // Xử lý sự kiện Submit Form Đăng bài (LƯU VÀO FIREBASE)
    if (newListingForm) {
        newListingForm.onsubmit = function(e) {
            e.preventDefault();
            
            // 1. Lấy dữ liệu từ form
const title = document.getElementById('post-title').value;
            const price = parseFloat(document.getElementById('post-price').value);
            const area = parseInt(document.getElementById('post-area').value);
            const location = document.getElementById('post-location').value;
            const businessType = document.getElementById('post-businessType').value;
            const description = document.getElementById('post-description').value;
            
            const imageFiles = postImageInput.files;
            const owner = localStorage.getItem('currentUser');

            if (!owner || imageFiles.length === 0) {
                alert("Vui lòng đăng nhập và chọn ít nhất một ảnh!");
                return;
            }
            
            const firstFile = imageFiles[0];
            
            // 1. Dữ liệu ban đầu (Metadata)
            const initialData = {
                name: title,
                location: location,
                price: price, 
                area: area,
                businessType: businessType,
                description: description,
                rating: 0,
                owner: owner,
                image: "LOADING..." // Placeholder tạm thời
            };

            const listingsDbRef = dbRef(db, 'listings');
            const newPostDbRef = push(listingsDbRef);
            const postId = newPostDbRef.key;
            
            // BẮT ĐẦU QUY TRÌNH TẢI LÊN (Chaining .then())
            
            // Bước 1: Tạo bản ghi Database TẠM THỜI
            set(newPostDbRef, initialData)
            .then(() => {
                // Bước 2: TẠO THAM CHIẾU VÀ TẢI ẢNH LÊN STORAGE
                const path = `listings/${postId}/${firstFile.name}`;
                const imageStorageRef = storageRef(storage, path);
                
                return uploadBytes(imageStorageRef, firstFile);
            })
            .then((snapshot) => {
                // Bước 3: LẤY URL CÔNG KHAI
                return getDownloadURL(snapshot.ref);
            })
            .then((downloadURL) => {
                // Bước 4: CẬP NHẬT DATABASE VỚI URL THẬT
                const updatePayload = { image: downloadURL };
                return update(dbRef(db, `listings/${postId}`), updatePayload);
            })
            .then(() => {
                // HOÀN THÀNH QUY TRÌNH
                alert(`🎉 Tin đăng và hình ảnh đã hoàn tất!`);
                document.getElementById('new-listing-form').reset();
                postModal.style.display = 'none';
            })
            .catch(error => {
                // Xử lý lỗi toàn bộ quy trình (cả DB và Storage)
                console.error("Lỗi quá trình đăng tin/upload:", error);
                alert("Đăng tin thất bại! Vui lòng kiểm tra Storage Rules.");
// Nếu lỗi xảy ra sau khi tạo bản ghi tạm thời, xóa nó đi.
                set(dbRef(db, `listings/${postId}`), null);
            });
        };
    }
    

}); // KẾT THÚC KHỐI DOMContentLoaded