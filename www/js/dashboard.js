class DashboardController {
  constructor(content) {
    this.content = content
  }

  async loadUserStats() {
    try {
      const res = await fetch("/api/userStats");
      if (!res.ok) {
        throw new Error("Could not fetch resources");
      }
      const data = await res.json();

      document.getElementById("totalUsers").textContent +=`Toplam Kullanıcı Sayısı : ${JSON.stringify(data.lastthreedaysusers)} `
      document.getElementById("activeUsers").textContent +=`Aktif Kullanıcı Sayısı : ${JSON.stringify(data.activeUserCount)} `
      document.getElementById("passiveUsers").textContent +=`Pasif Kullanıcı Sayısı : ${JSON.stringify(data.passiveUserCount)} `
    } catch (error) {
      console.error(error);
    }
  }

  async loadTodoStats(){
    try {
      const res = await fetch("/api/todoStats");
      if (!res.ok){
        throw new Error("Cold not fetch resources");
      }
      const data = await res.json();
      document.getElementById("totalTodos").textContent += `Toplam Todo Sayısı : ${JSON.stringify(data.todos)} `
      document.getElementById("completedTodos").textContent += `Tamamlanan Todo Sayısı : ${JSON.stringify(data.completedTodos)} `
      document.getElementById("uncompletedTodos").textContent += `Tamamlanmayan Todo Sayısı : ${JSON.stringify(data.unCompletedTodos)} `
    } catch(error){
      console.error(error)
    }
  }

  async init() {
    this.loadUserStats();
    this.loadTodoStats()
  }
}

const dash = new DashboardController();

export default DashboardController;
