import FormController from "./form.js";
import { loadTable } from "./tables.js";

class SPAController {
  constructor() {
    this.formLoader = new FormController();
    this.tableLoader = loadTable; 
    this.content = document.getElementById("contentContainer");
  }
  // LOADCONTENT FUNCTION
  async loadContent(type, kind, tableId) {
    try {
      const res = await fetch("/"+type);
      const html = await res.text();
      this.content.innerHTML = html;
      if (kind === "form") {
        await this.formLoader.loadForm(`${type}-form`);
      } else if (kind === "table") {
        await this.tableLoader(`${tableId}`, `${type}`);
      }
    } catch (err) {
      console.error("Hata",err)
    }
  }
  // LOADPAGE FUNCTIONS
  async loadPage() {
    const hash = window.location.hash.substring(1);
    this.content.innerHTML = "Yükleniyor...";

    const routes = {
      myTodos : ["myTodos","table","todo-table"],
      addTodo : ["addTodo","form",],
      addUser : ["addUser","form",],
      userList : ["userList","table","user-table"],
    }

    if (hash === "logout") {
      await fetch("/api/logout");
      window.location.href = "/login";
      return;
    }
    if (hash === "myTodos") {
      await this.loadContent(...routes[hash])
      return;
    }
    if (hash === "addTodo") {
      await this.loadContent(...routes[hash])
      return;
    }
    if (hash === "addUser") {
      await this.loadContent(...routes[hash])
      return;
    }
    if (hash === "userList") {
      await this.loadContent(...routes[hash])
      return;
    }
  }
  // INIT FUNCTION 
  async init(){
    window.addEventListener("hashchange",this.loadPage.bind(this));
    window.addEventListener("DOMContentLoaded",() => {
      if (window.location.hash){
        this.loadPage();
      } else {
        window.location.hash = ""
      }
    })
  }


}

const spa = new SPAController();

spa.init()

export default SPAController;
