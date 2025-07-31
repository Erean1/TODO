import FormController from "./form.js";
import { loadTable } from "./tables.js";

class SPAController {
  constructor() {
    this.formLoader = new FormController(); // formloder instancesi oluşturduk formcontroller sınıfından
    this.tableLoader = loadTable;  // tableloader i çağpırcaz
    this.content = document.getElementById("contentContainer"); // spa sayfasi içindeki contentContainer divini aldık 
  }
  // Sayfa içeriğini yükler
  async loadContent(type, kind, tableId) { 
    try {
      const res = await fetch("/" + type);  // partials htmllerime örneğin /myTodos buna istek attık res aldık
      const html = await res.text();  // gelen isteği text şeklimde htmlye attık
      this.content.innerHTML = html;  // contentin içine innerHTML ile html yi yazdırdık ardık sayfamız gözüküyor
      if (kind === "form") { // kind === form ise 
        await this.formLoader.loadForm(`${type}-form`); // form oluşturuyoz örneğin addTodo-form 
      } else if (kind === "table") {
        await this.tableLoader(`${tableId}`, `${type}`); // table oluşturuyoz örneğin tdo-table
      }
    } catch (err) {
      console.error("Hata", err);
    }
  }

  async loadPage() {
    const hash = window.location.hash.substring(1); // #addTodo yu addTodo yaptik substring ile 1. yi çıkartık hash ile sadece # bundan sonrasını aldık
    this.content.innerHTML = "Yükleniyor..."; // içerik yüklenene kadar üykleniyor yazcak

    const routes = { // routerlerimi belirledim ve routerlerimde neler göndericem bunları belirledim
      myTodos: ["myTodos", "table", "todo-table"],
      addTodo: ["addTodo", "form"],
      addUser: ["addUser", "form"],
      userList: ["userList", "table", "user-table"],
      logs : ["logs","table","log-table"],
      completedTodos : ["completedTodos","table","completedTodos-table"],
      addCategory : ["addCategory","form"],
      categoryList : ["categoryList","table","category-table"]
    };
    // ! burdaki karışıklılığı düzelt
    try {
      if (hash === "logout") { // gelen hashe göre iflere yolluyuz
        await fetch("/api/logout"); // logout apisine istek attik
        window.location.href = "/login";
        return;
      }
      if (hash === "myTodos") {
        await this.loadContent(...routes[hash]);  // key üzerinden routesten loadcontente istek attık
        return;
      }
      if (hash === "logs") {
        await this.loadContent(...routes[hash]);
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
      if (hash === "categoryList"){
        await this.loadContent(...routes[hash]);
        return;
      }
      if (hash === "completedTodos"){
        await this.loadContent(...routes[hash])
        return;
      }
      if (hash === "addCategory"){
        await this.loadContent(...routes[hash])
      }
      if (hash === "dashboard"){
        const res = await fetch("/"+hash) // hash sayfasinin getir
        const html = await res.text() // text olarak al 
        this.content.innerHTML = html //content içine koy
        const module = await import("./dashboard.js"); // dashboard.js i import ettik await lie cünkü içindn bir response gelecek
        const dashboard = new module.default(this.content); // module.default(this.content) bunun ile export defaul yaptığım clasın constructoruna değişken gönderidm
        dashboard.init()  // dashboardi baslattim
      }
    } catch (err) {
      throw new Error(err);
    }
  }
  
  async init() {
    window.addEventListener("hashchange", this.loadPage.bind(this));  // hashchange dinledim ve this.loadPage.bind(this) ile çalıştıdım
    // this.loadPage yapsam undefined olacak cünkü bu gidip window içindeki thise odaklanacak ama bind(this) yaparak bu class spacontroller
    //  içindeki thisi aliriz 
    
    window.addEventListener("DOMContentLoaded", () => { // içerik  yüklendiğinde
      
      if (window.location.hash) { // hash varsa loadpage çalistir
        
        this.loadPage();
      } else {
        
        window.location.hash = ""; // yoksa boş hash anasayfa devam et
      }
    });
  }
}

const spa = new SPAController();  // spa instance oluştur
spa.init();  // spa calistir

export default SPAController;
