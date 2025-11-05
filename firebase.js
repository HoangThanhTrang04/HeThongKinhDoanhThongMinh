import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
const firebaseConfig = {
    apiKey: "AIzaSyCZg4fINZgmKXmbpa88Js2z24Z4z2C5-EU",
    authDomain: "batdongsan-dc15d.firebaseapp.com",
    databaseURL: "https://batdongsan-dc15d-default-rtdb.firebaseio.com/",
    projectId: "batdongsan-dc15d",
    messagingSenderId: "1078364484591",
    appId: "1:1078364484591:web:9faf98002a47c57545bc1a",
    measurementId: "G-7RGQ9WV66R"
  };
  
  export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);