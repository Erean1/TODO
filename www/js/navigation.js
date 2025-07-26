import FormController from "./form.js";
import { loadTable } from "./tables.js";

class SPAController {
  constructor() {
    this.formLoader = new FormController(); // formları yükler
    this.tableLoader = loadTable; // tabloları yükler
    this.content = document.getElementById("contentContainer"); // ana sayfadaki içerik divini alır 
  }
  // Sayfa içeriğini yükler
  async loadContent(type, kind, tableId) {
    try {
      const res = await fetch("/" + type); // partialsdaki type göre istek attık /addTodo
      const html = await res.text(); // o typenin htmlsini text olarak aldık
      this.content.innerHTML = html; // main pagedeki div altına yerlestirdik
      if (kind === "form") {
        await this.formLoader.loadForm(`${type}-form`); // loadforma gönderdik
      } else if (kind === "table") {
        await this.tableLoader(`${tableId}`, `${type}`); // loadtable gönderdik
      }
    } catch (err) {
      console.error("Hata", err);
    }
  }
  // gelen hashe göre sayfa yönlendirmesini ayarlar
  async loadPage() {
    const hash = window.location.hash.substring(1); // #myTodos ---> myTodos
    this.content.innerHTML = "Yükleniyor...";

    const routes = {
      myTodos: ["myTodos", "table", "todo-table"], // type = myTodos , kind = table, tableId = todo-table
      addTodo: ["addTodo", "form"],
      addUser: ["addUser", "form"],
      userList: ["userList", "table", "user-table"],
      logs : ["logs","table","log-table"],
      completedTodos : ["completedTodos","table","completedTodos-table"]
    };
    // ! burdaki karışıklılığı düzelt
    try {
      if (hash === "logout") {
        await fetch("/api/logout");
        window.location.href = "/login";
        return;
      }
      if (hash === "myTodos") {
        await this.loadContent(...routes[hash]); // routese gönder hashe göre
        return;
      }
      if (hash === "logs") {
        await this.loadContent(...routes[hash]); // routese gönder hashe göre
        return;
      }
      if (hash === "addTodo") {
        await this.loadContent(...routes[hash]);
        return;
      }
      if (hash === "addUser") {
        await this.loadContent(...routes[hash]);
        return;
      }
      if (hash === "userList") {
        await this.loadContent(...routes[hash]);
        return;
      }
      if (hash === "completedTodos"){
        await this.loadContent(...routes[hash])
        return;
      }
      if (hash === "dashboard"){
        const res = await fetch("/"+hash)
        const html = await res.text()
        this.content.innerHTML = html
        const module = await import("./dashboard.js");
        const dashboard = new module.default(this.content);
        dashboard.init()  
      }
    } catch (err) {
      throw new Error(err);
    }
  }
  // INIT FUNCTION
  async init() {
    window.addEventListener("hashchange", this.loadPage.bind(this)); // hashchange deki herhangi bir değişikliği (tarayıcı bunu sağlar) farkedince loadpage çalışıyor
    // bind(this) loadpage burda callback fonksiyonu olduğu için this.loadPage normalde undefined olur bind kullandık
    window.addEventListener("DOMContentLoaded", () => {
      //DOMContentLoaded yani içerik yüklendiğinde
      if (window.location.hash) {
        // eğer zaten bir hash varsa onu yükle
        this.loadPage();
      } else {
        // yoksa hashe "" yap
        window.location.hash = "";
      }
    });
  }
}

const spa = new SPAController(); // classtan instance oluşturdk
spa.init(); // initi calistirdik ve başlattık

export default SPAController;
