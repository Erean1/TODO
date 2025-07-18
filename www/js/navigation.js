import loadForm from "./form.js"; 
import { loadTable } from "./tables.js"

async function loadPage() {
    const hash = window.location.hash.substring(1);  
    const content = document.getElementById("contentContainer");
    content.innerHTML = `Yükleniyor...`;

    if (hash === "logout"){ 
      await fetch("/api/logout"); 
      location.href = "/login"; 
    }
    if (hash === ""){
      content.innerHTML = "<h1>ANASAYFA</h1>";
      return;
    }
    if (hash === "myTodos"){
      const res = await fetch("/myTodos");
      const html = await res.text();
      content.innerHTML = html;
      await loadTable("todo-table", "myTodos");
    }
    if (hash === "admin"){
      const res = await fetch("/user-list");
      const html = await res.text();
      content.innerHTML = html;
    }
    if (hash === "addTodo"){
      const res = await fetch("/addTodo");
      const html = await res.text();
      content.innerHTML = html;
      await loadForm("addTodo-form");
      return;
    }
    if (hash === "addUser"){
      const res = await fetch("/addUser");
      const html = await res.text();
      content.innerHTML = html;
      await loadForm("addUser-form");
      return;
    }
    if (hash === "userList"){
      const res = await fetch("/userList");
      const html = await res.text();
      content.innerHTML = html;
      await loadTable("user-table", "users");
      return;
    }
}

// Sayfa ilk yüklendiğinde ve hash değiştiğinde çağırmak için:
window.addEventListener("hashchange", loadPage);
window.addEventListener("DOMContentLoaded", () => {
  if (window.location.hash) {
    loadPage();
  } else {
    window.location.hash = "";
  }
});

export default loadPage;
