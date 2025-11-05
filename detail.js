
window.addEventListener('DOMContentLoaded', async () => {
    const item = JSON.parse(localStorage.getItem('selectedItem'));
    const container = document.getElementById('detail');

    if(!item) return;

    container.innerHTML = `
        <div class="detail-left">
            <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="detail-right">
            <h2>${item.name}</h2>
            <p><strong>Vị trí:</strong> ${item.location}</p>
            <p><strong>Giá:</strong> ${item.price} triệu/tháng</p>
            <p><strong>Diện tích:</strong> ${item.area} m²</p>
            <p><strong>Loại hình:</strong> ${item.businessType}</p>
            <p><strong>Đánh giá:</strong> ${item.rating} ⭐</p>
            <p class="contact-box">Liên hệ: 0987 123 456</p>
            <div id="map" style="height: 400px; margin-top: 20px;"></div>
        </div>
    `;

    // Hàm hiển thị map
    async function showMap(address) {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
        try {
            const res = await fetch(url, {headers: {"Accept-Language":"vi"}});
            const data = await res.json();
            if(data.length === 0) return;

            const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            const map = L.map('map').setView(coords, 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
            L.marker(coords).addTo(map)
             .bindPopup(`<b>${item.name}</b><br>${item.location}`).openPopup();
        } catch(err){
            console.error("Không thể load map:", err);
        }
    }

    showMap(item.location);
});
window.addEventListener('DOMContentLoaded', async () => {
    const item = JSON.parse(localStorage.getItem('selectedItem'));
    const container = document.getElementById('detail');

    if(!item) return;

    container.innerHTML = `
        <div class="detail-left">
            <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="detail-right">
            <h2>${item.name}</h2>
            <p><strong>Vị trí:</strong> ${item.location}</p>
            <p><strong>Giá:</strong> ${item.price} triệu/tháng</p>
            <p><strong>Diện tích:</strong> ${item.area} m²</p>
            <p><strong>Loại hình:</strong> ${item.businessType}</p>
            <p><strong>Đánh giá:</strong> ${item.rating} ⭐</p>
            <p class="contact-box">Liên hệ: 0987 123 456</p>
            <div id="map" style="height: 400px; margin-top: 20px;"></div>
        </div>
    `;

    // hàm map
    async function showMap(address) {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
        try {
            const res = await fetch(url, {headers: {"Accept-Language":"vi"}});
            const data = await res.json();
            if(data.length === 0) return;

            const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            const map = L.map('map').setView(coords, 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
            L.marker(coords).addTo(map)
             .bindPopup(`<b>${item.name}</b><br>${item.location}`).openPopup();
        } catch(err){
            console.error("Không thể load map:", err);
        }
    }

    showMap(item.location);
});

