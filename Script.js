// =====================
// Popup login/registration
// =====================
const modal = document.getElementById("loginModal");
const loginBtn = document.getElementById("loginBtn");
const closeBtn = document.getElementsByClassName("close")[0];

// Bật/tắt popup
loginBtn.onclick = () => {
    // Nếu đã đăng nhập, không mở popup
    if(loginBtn.dataset.logged === "true") return;
    modal.style.display = "block";
}
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (event) => { if(event.target==modal) modal.style.display="none"; }

// =====================
// Lấy input và button
// =====================
const inputs = document.querySelectorAll(".modal-content input");
const loginUsernameInput = inputs[0];
const loginPasswordInput = inputs[1];
const registerUsernameInput = inputs[2];
const registerPasswordInput = inputs[3];

const loginButton = document.querySelector(".modal-content button:nth-of-type(1)");
const registerButton = document.querySelector(".modal-content button:nth-of-type(2)");

// =====================
// Đăng ký
// =====================
registerButton.onclick = () => {
    const username = registerUsernameInput.value.trim();
    const password = registerPasswordInput.value.trim();
    if(!username || !password){
        alert("Vui lòng điền đầy đủ thông tin đăng ký!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if(users.find(u=>u.username===username)){
        alert("Tên đăng nhập đã tồn tại!");
        return;
    }

    users.push({username,password});
    localStorage.setItem("users", JSON.stringify(users));
    alert("Đăng ký thành công!");
    registerUsernameInput.value = "";
    registerPasswordInput.value = "";
}

// =====================
// Đăng nhập
// =====================
loginButton.onclick = () => {
    const username = loginUsernameInput.value.trim();
    const password = loginPasswordInput.value.trim();
    if(!username || !password){
        alert("Vui lòng điền đầy đủ thông tin đăng nhập!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username===username && u.password===password);

    if(user){
        alert("Đăng nhập thành công!");
        modal.style.display = "none";

        // Đổi nút login thành Xin chào + data-logged
        loginBtn.textContent = "Xin chào " + username;
        loginBtn.dataset.logged = "true";

        // Nếu chưa có nút logout, tạo nút logout
        if(!document.getElementById("logoutBtn")){
            const logoutBtn = document.createElement("button");
            logoutBtn.id = "logoutBtn";
            logoutBtn.textContent = "Đăng xuất";
            logoutBtn.style.marginLeft = "10px";
            loginBtn.parentNode.appendChild(logoutBtn);

            // Xử lý đăng xuất
            logoutBtn.onclick = () => {
                alert("Bạn đã đăng xuất!");
                loginBtn.textContent = "Đăng nhập/Đăng ký";
                delete loginBtn.dataset.logged;
                logoutBtn.remove();
            }
        }

        // Xóa input login
        loginUsernameInput.value = "";
        loginPasswordInput.value = "";
    } else {
        alert("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
}