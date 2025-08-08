class AgendaPage {
  constructor() {
    this.date = document.getElementById("date");
    this.noteInput = document.getElementById("note");
    this.noteButton = document.getElementById("noteButton");
    this.noteUl = document.getElementById("noteUl");
  }

  async getNotes() {
    try {
      
      const res = await fetch("/api/getNotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: this.date.value }),
      });
      this.noteUl.innerHTML = "";

      const data = await res.json();
      if (data.length == 0) {
        const p = document.createElement("p");
        p.innerText = "Henüz NOT eklenmemiş..";
        this.noteUl.appendChild(p);
        return;
      }

      Object.keys(data).forEach((key) => {
        const deleteButton = document.createElement("button");

        deleteButton.innerText = "Sil";
        const li = document.createElement("li");
        li.textContent = data[key].content;

        li.setAttribute("data-id", data[key]._id);

        const statusSel = document.createElement("select");
        statusSel.className = "form-select w-50";

        ["default", "Tamamlandı", "Devam Ediyor"].forEach((ind) => {
          const opt = document.createElement("option");
          opt.text = ind;
          if (ind === "default") {
            opt.disabled = true;
            opt.selected = true;
            opt.hidden = true;
            opt.textContent = data[key]?.status || "Durum" 
          }
          statusSel.add(opt);
        });

        li.appendChild(statusSel);
        li.appendChild(deleteButton);

        statusSel.addEventListener(
          "change",
          async () =>{
            console.log(statusSel.value) 
            await this.updateStatus(statusSel.value,data[key]._id)
        });

        deleteButton.onclick = async () => {
          await this.deleteNote(data[key]._id);
          await this.getNotes();
        };

        this.noteUl.appendChild(li);
      });
    } catch (error) {
      console.error(error);
      alert("Formlar Alınamadı");
    }
  }

  async updateStatus(status,id) {
    try {
      const res = await fetch("/api/note-operations/updateStatus",{
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({status : status,_id : id})
      })
      await this.getNotes()
    } catch(error){
      alert("Güncellenemedi")
    }
  }

  async addNote() {
    if (!this.date.value) return;
    try {
      const res = await fetch("/api/note-operations/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: this.date.value,
          note: this.noteInput.value,
        }),
      });
      this.noteInput.value = "";
    } catch (error) {
      console.error(error.message);
      alert("Not Eklenemedi");
    }
  }

  async deleteNote(id) {
    const res = await fetch("/api/note-operations/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id }),
    });
  }

  init() {
    this.date.addEventListener("change", () => this.getNotes());
    this.noteInput.addEventListener("keypress", async(event) => {
      if (event.key === "Enter") {
        await this.addNote()
        await this.getNotes()
      }
    })
    this.noteButton.onclick = async () => {
      await this.addNote();
      await this.getNotes();
    };
  }
}

export default new AgendaPage();
