import { db } from "./firebase.js";
import { ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

// Thêm dòng này ngay sau khi lấy item từ localStorage
const item = JSON.parse(localStorage.getItem('selectedItemForReview'));
if (!item) {
    alert("Không có dữ liệu mặt bằng!");
    window.location.href = "index.html";
}

// 🔥🔥 THÊM DÒNG NÀY ĐỂ DEBUG 🔥🔥
console.log("ID mặt bằng đang xét (item.id):", item.id); 
console.log("Đường dẫn Firebase dự kiến:", `reviews/${item.id}`);
// 🔥🔥 THÊM DÒNG NÀY ĐỂ DEBUG 🔥🔥

document.getElementById('placeName').textContent = item.name;
// ...

document.getElementById('placeName').textContent = item.name;

const reviewsList = document.getElementById('reviewsList');
const reviewerNameInput = document.getElementById('reviewerName');
const reviewTextInput = document.getElementById('reviewText');
const ratingSelect = document.getElementById('rating');
const submitBtn = document.getElementById('submitReview');

// Lấy và hiển thị đánh giá từ Firebase
const reviewsRef = ref(db, `reviews/${item.id}`);
onValue(reviewsRef, (snapshot) => {
    const data = snapshot.val();
    reviewsList.innerHTML = '';
    if (!data) {
        reviewsList.innerHTML = '<p>Chưa có đánh giá nào.</p>';
        return;
    }
    const reviews = Object.values(data);
    reviews.forEach(r => {
        const div = document.createElement('div');
        div.style.border = "1px solid #ccc";
        div.style.padding = "10px";
        div.style.marginBottom = "10px";
        div.innerHTML = `<strong>${r.name}</strong> - ${r.rating} ⭐<br>${r.text}`;
        reviewsList.appendChild(div);
    });
});

// Gửi đánh giá mới
submitBtn.addEventListener('click', () => {
    const name = reviewerNameInput.value.trim();
    const text = reviewTextInput.value.trim();
    const rating = ratingSelect.value;

    if(!name || !text) {
        alert("Vui lòng điền đầy đủ thông tin đánh giá!");
        return;
    }

    push(reviewsRef, {
        name,
        text,
        rating,
        timestamp: Date.now()
    }).then(() => {
        reviewerNameInput.value = '';
        reviewTextInput.value = '';
    }).catch(err => {
        console.error(err);
        alert("Gửi đánh giá thất bại!");
    });
});
