import FormController from "./form.js";
import { loadTable } from "./tables.js";

class SPAController {
  constructor() {
    this.formLoader = new FormController(); // formloder instancesi oluşturduk formcontroller sınıfından
    this.tableLoader = loadTable; // tableloader instancesi
    this.content = document.getElementById("contentContainer"); // spa sayfasi içindeki contentContainer divini aldık
  }
  // Sayfa içeriğini yükler
  async loadContent(type, kind, tableId) {
    try {
      const res = await fetch("/" + type); // partials htmllerime örneğin /myTodos buna istek attık res aldık
      const html = await res.text(); // gelen isteği text şeklinde htmlye attık
      this.content.innerHTML = html; // contentin içine innerHTML ile html yi yazdırdık ardık sayfamız gözüküyor
      if (kind === "form") {
        // kind === form ise
        await this.formLoader.loadForm(`${type}-form`); // form oluşturuyoz örneğin addTodo-form
      } else if (kind === "table") {
        await this.tableLoader(`${tableId}`, `${type}`); // table oluşturuyoz örneğin tdo-table
      }
    } catch (err) {
      console.error("Hata", err);
    }
  }

  async loadPage() {
    const hash = window.location.hash.substring(1); // #logout ---> logout
    this.content.innerHTML = "Yükleniyor..."; // içerik yüklenene kadar Yükleniyor yazcak

    const routes = {
      // routerlerimi belirledim ve routerlerimde neler göndericem bunları belirledim
      myTodos: ["myTodos", "table", "todo-table"],
      addTodo: ["addTodo", "form"],
      addUser: ["addUser", "form"],
      userList: ["userList", "table", "user-table"],
      logs: ["logs", "table", "log-table"],
      completedTodos: ["completedTodos", "table", "completedTodos-table"],
      addCategory: ["addCategory", "form"],
      categoryList: ["categoryList", "table", "category-table"],
    };
    document.querySelectorAll(".nav-link").forEach((el) => {
      el.classList.remove("blink");
      el.style.color = "";
    });
    const link = document.querySelector(`a[href="#${hash}"]`);
    link.classList.add("blink");

    if (Object.keys(routes).includes(hash)) {
      await this.loadContent(...routes[hash]);
      return;
    } else if (hash === "logout") {
      await fetch("/api/logout"); // logout apisine istek attik
      window.location.href = "/login";
      return;
    } else if (hash === "dashboard") {
      const res = await fetch("/" + hash); // hash sayfasinin getir
      const html = await res.text(); // text olarak al
      this.content.innerHTML = html; //content içine koy
      const module = await import("./dashboard.js"); // dashboard.js i import ettik await lie cünkü içindn bir response gelecek
      const dashboard = new module.default(this.content); // module.default(this.content) bunun ile export defaul yaptığım clasın constructoruna değişken gönderidm
      dashboard.init(); // dashboardi baslattim
      return;
    } else if (hash === "userProfile") {
      const module = await import("./userProfile.js");
      const userProfileP = new module.default(
        this.content,
        this.loadPage.bind(this)
      );
      userProfileP.init();
      return;
    }
  }


  async init() {
    // hash i dinle ve değiştiği an loadpage calistir
    // this.loadPage.bind(this) --> bind(this) diyerek şuanki bulunduğumuz class bazında erişiyoruz
    window.addEventListener("hashchange", this.loadPage.bind(this));

    window.addEventListener("DOMContentLoaded", () => {
      this.chooseTheme();
      if (window.location.hash) {
        this.loadPage();
      } else {
        window.location.hash = "";
      }
    });
  }
}

const spa = new SPAController();
spa.init();

export default SPAController;
