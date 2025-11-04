let listings = [
    {
        name: "Mặt bằng Cầu Giấy",
        location: "Cầu Giấy",
        price: 15,
        area: 50,
        businessType: "Cafe",
        rating: 4.5,
        image: "https://tuart.net/wp-content/uploads/2019/11/foody-mobile-kat-jpg-425-636110858031788437.jpg"
    },
    {
        name: "Mặt bằng Đống Đa",
        location: "Đống Đa",
        price: 25,
        area: 80,
        businessType: "Shop",
        rating: 4.0,
        image: "https://thing.vn/wp-content/uploads/2022/02/y-tuong-thiet-ke-shop-quan-ao-9.jpg"
    },
    {
        name: "Văn phòng Hai Bà Trưng",
        location: "Hai Bà Trưng",
        price: 30,
        area: 120,
        businessType: "Office",
        rating: 4.2,
        image: "https://maisoninterior.vn/wp-content/uploads/2025/02/mau-van-phong-lam-viec-dep-02.jpg"
    },
    {
        name: "Căn hộ mặt phố Tây Hồ",
        location: "Tây Hồ",
        price: 20,
        area: 60,
        businessType: "Shop",
        rating: 4.3,
        image: "https://www.deco-crystal.com/wp-content/uploads/2021/11/thiet-ke-quan-quan-ao.jpg"
    },
    {
        name: "Mặt bằng Trần Duy Hưng",
        location: "Cầu Giấy",
        price: 18,
        area: 55,
        businessType: "Cafe",
        rating: 4.1,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8V_lliC9IWOftdBfekJGY_cmc1f7XSn-Big&s"
    },
    {
        name: "Văn phòng Nguyễn Chí Thanh",
        location: "Đống Đa",
        price: 35,
        area: 150,
        businessType: "Office",
        rating: 4.6,
        image: "https://dplusvn.com/wp-content/uploads/2020/01/hinh-anh-van-phong-cong-ty-seongon-2.jpg"
    },
    {
        name: "Mặt bằng phố Bà Triệu",
        location: "Hai Bà Trưng",
        price: 28,
        area: 90,
        businessType: "Shop",
        rating: 4.4,
        image: "https://png.pngtree.com/thumb_back/fh260/background/20230715/pngtree-3d-render-of-interior-for-clothing-boutique-image_3853787.jpg"
    },
    {
        name: "Mặt bằng Láng Hạ",
        location: "Đống Đa",
        price: 22,
        area: 70,
        businessType: "Cafe",
        rating: 4.2,
        image: "https://www.vietnamairlines.com/~/media/SEO-images/2025%20SEO/Traffic%20TV/quan-cafe-chill-o-ha-noi/khong-gian-quan-ca-phe-xi-nghiep.jpg?la=vi-VN"
    },
    {
        name: "Văn phòng Hoàng Quốc Việt",
        location: "Cầu Giấy",
        price: 32,
        area: 130,
        businessType: "Office",
        rating: 4.5,
        image: "ihttps://noithathoaphat.info.vn/wp-content/uploads/2020/03/hinh-anh-van-phong-lam-viec-04.jpg"
    },
    {
        name: "Căn hộ mặt phố Trần Phú",
        location: "Hà Đông",
        price: 16,
        area: 45,
        businessType: "Shop",
        rating: 4.0,
        image: "https://www.vietnamairlines.com/~/media/SEO-images/2025%20SEO/Traffic%20TV/quan-cafe-chill-o-ha-noi/khong-gian-quan-ca-phe-xi-nghiep.jpg?la=vi-VN"
    }
];

function displayListings(data) {
    const container = document.getElementById('listing');
    container.innerHTML = '';
    if(data.length === 0) {
        container.innerHTML = '<p>Không tìm thấy mặt bằng phù hợp.</p>';
        return;
    }
    data.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('listing-item');
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="listing-content">
                <h3>${item.name}</h3>
                <p>Vị trí: ${item.location}</p>
                <p>Giá: ${item.price} triệu/tháng</p>
                <p>Diện tích: ${item.area} m²</p>
                <p>Loại hình: ${item.businessType}</p>
                <p class="rating">Đánh giá: ${item.rating} ⭐</p>
            </div>
        `;
        div.addEventListener('click', () => {
            localStorage.setItem('selectedItem', JSON.stringify(item));
            window.location.href = 'detail.html';
        });
        container.appendChild(div);
    });
}

displayListings(listings);

document.getElementById('filterBtn').addEventListener('click', () => {
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
});