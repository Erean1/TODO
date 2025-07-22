// ! import SPAController from "./navigation.js";
// type = storage/forms/type
class FormController {
  constructor() {
    // this.spa = new SPAController();
  }

  async showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "alert alert-danger";
    errorDiv.textContent = message;
    const errorExist = document.querySelector(".alert.alert-danger");
    if (errorExist) {
      errorExist.remove();
    }
    const surveyContainer = document.getElementById("surveyContainer");
    surveyContainer.parentNode.insertBefore(errorDiv, surveyContainer);
  }

  async loadForm(type,prefillData = {}) {
    const res = await fetch(`/api/forms/${type}`);
    const formJson = await res.json();


    let operationID = null;
    if (type==="editTodo-form" || type==="editUser-form"){
      const pathParts = window.location.pathname.split("/");
      operationID = pathParts[pathParts.length - 1]
    }



    if (type === "editTodo-form") {
      formJson.elements.push({
        type: "html",
        name : "cancel-button",
        html : `<a href="/" class="px-5 btn btn-danger btn-md">Vazgeç</a>`
      });
    }

    const survey = new Survey.Model(formJson);

    if (prefillData && Object.keys(prefillData).length > 0){
      survey.data = prefillData
    }



    if (type === "addUser-form" || type === "addTodo-form") {
      (survey.completeText = "Ekle"), (survey.showCompletedPage = false);
    } else if (type === "login-form") {
      survey.completeText = "Giriş yap";
      survey.showCompletedPage = false;
    } else if (type === "register-form") {
      survey.completeText = "Kayıt Ol";
      survey.showCompletedPage = false;
    } else if (type === "editTodo-form") {
      survey.completeText = "Güncelle";
      survey.showCompletedPage = false;
    }else if (type === "editUser-form") {
      survey.completeText = "Güncelle";
      survey.showCompletedPage = false;
    }

    const endpointMap = {
      "editTodo-form": "/api/operation/update",
      "addTodo-form": "/api/operation/add",
      "addUser-form": "/api/user-operation/add",
      "login-form": "/api/login",
      "editUser-form" : "/api/user-operation/update",
      "register-form": "/api/register",
    };

    survey.onComplete.add(async (sender) => {
      const formData = sender.data;

      if (operationID){
        formData._id = operationID
      }

      const endpoint = endpointMap[type];

      if (!endpoint) {
        console.error("Form tipi yok");
        return;
      }

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        console.log(res)
        if (!res.ok) {
          throw new Error("HATA", res.statusText);
        }
        const data = await res.json();
        if (data.success === false) {
          this.showError(data.error || "Bir şeyler yalnış gitti");
          // await loadForm(type)
          setTimeout(() => {
            window.location.reload();
          }, "1000");
          return;
        }
        switch (type) {
          case "login-form":
            window.location.href = "/";
            break;
          case "register-form":
            window.location.href = "/login";
            break;
          case "addTodo-form":
            window.location = "#myTodos";
            break;
          case "editTodo-form":
            window.location = `/#myTodos`
            break;
          case "editUser-form": 
            window.location = "/#userList";
            break;
          case "addUser-form":
            window.location = "#userList";
            break;
        }
      } catch (err) {
        console.error("HATA", err);
      }
    });
    $("#surveyContainer").Survey({ model: survey });
  }
}

export default FormController;
