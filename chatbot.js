// File: chatbot.js

// Lấy các phần tử Chatbot
const chatbotIcon = document.getElementById('chatbot-icon');
const chatbotWindow = document.getElementById('chatbot-window');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

// Hàm quản lý việc ẩn/hiện cửa sổ chat
function toggleChatbot(show) {
    if (show) {
        chatbotWindow.classList.add('visible');
        chatbotIcon.style.display = 'none';
        chatInput.focus(); 
    } else {
        chatbotWindow.classList.remove('visible');
        chatbotIcon.style.display = 'flex';
    }
}

// 🔴 CẢNH BÁO: KEY NÀY BỊ LỘ TRÊN MÃ NGUỒN FRONTEND!
// THAY THẾ KEY CỦA BẠN VÀO ĐÂY!
const OPENAI_API_KEY = ""; 
// TRUY CẬP TRỰC TIẾP API CỦA OPENAI
const API_ENDPOINT = "https://api.openai.com/v1/chat/completions";

const systemPrompt = "Bạn là trợ lý tư vấn mặt bằng cho thuê chuyên nghiệp. Tên website là SmartRent. Hãy trả lời các câu hỏi về giá, diện tích, vị trí và loại hình kinh doanh (Cafe, Shop, Office) dựa trên dữ liệu mặt bằng của chúng tôi. Giữ câu trả lời ngắn gọn và hữu ích.";

// Lịch sử cuộc trò chuyện để duy trì ngữ cảnh
let conversationHistory = [{ role: "system", content: systemPrompt }];

// Hàm hiển thị tin nhắn
function displayMessage(content, sender) {
    const div = document.createElement('div');
    div.classList.add('message', `${sender}-message`);
    div.textContent = content;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hàm gọi OpenAI API trực tiếp
async function callOpenAI() {
    const userText = chatInput.value.trim();
    if (userText === "") return;

    displayMessage(userText, 'user');
    chatInput.value = '';
    sendBtn.disabled = true; 
    
    // Thêm tin nhắn người dùng vào lịch sử
    conversationHistory.push({ role: "user", content: userText });

    displayMessage("...", 'bot');

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // GỬI KEY TRONG HEADER TRỰC TIẾP ĐẾN OPENAI
                'Authorization': `Bearer ${OPENAI_API_KEY}` 
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: conversationHistory,
                max_tokens: 200,
                temperature: 0.7 
            })
        });

        if (!response.ok) {
            // Lấy chi tiết lỗi từ OpenAI (nếu có)
            const errorData = await response.json();
            console.error("Lỗi OpenAI chi tiết:", errorData);
            throw new Error(`Lỗi API: ${response.status}. ${errorData.error ? errorData.error.message : response.statusText}`);
        }

        const data = await response.json();
        const botReply = data.choices[0].message.content.trim();
        
        // Xóa trạng thái đang nhập
        chatMessages.removeChild(chatMessages.lastChild);
        
        // Hiển thị và thêm phản hồi của Bot vào lịch sử
        displayMessage(botReply, 'bot');
        conversationHistory.push({ role: "assistant", content: botReply });

    } catch (error) {
        console.error("Lỗi gọi OpenAI:", error);
        
        // Xóa trạng thái đang nhập và hiển thị lỗi
        chatMessages.removeChild(chatMessages.lastChild); 
        // Lỗi này thường do hết tiền/key sai
        displayMessage("Xin lỗi, có lỗi xảy ra. (Key/Thanh toán không hợp lệ). Vui lòng thử lại.", 'bot');
        
        // Xóa tin nhắn người dùng khỏi lịch sử để tránh lỗi lặp
        conversationHistory.pop(); 
    } finally {
        sendBtn.disabled = false; // Kích hoạt lại nút gửi
    }
}

// Gắn sự kiện cho nút Gửi và phím Enter
sendBtn.addEventListener('click', callOpenAI);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        callOpenAI();
    }
});