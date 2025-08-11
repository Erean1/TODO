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

      document.getElementById("totalUsers").textContent +=`${data.lastthreedaysusers} `
      document.getElementById("activeUsers").textContent +=`${data.activeUserCount} `
      document.getElementById("passiveUsers").textContent +=`${data.passiveUserCount} `
      document.getElementById("lastThreeDaysUsers").textContent +=`${data.lastthreedaysusers} `
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
      document.getElementById("totalTodos").textContent += `Toplam Todo Sayısı : ${data.todos} `
      document.getElementById("completedTodos").textContent += `Tamamlanan Todo Sayısı : ${data.completedTodos} `
      document.getElementById("uncompletedTodos").textContent += `Tamamlanmayan Todo Sayısı : ${data.unCompletedTodos} `
    } catch(error){
      console.error(error)
    }
  }

  async init() {
    this.loadUserStats();
    this.loadTodoStats()
  }
}


export default DashboardController;
