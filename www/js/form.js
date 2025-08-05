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

  async loadForm(type, prefillData = {}) {
    const res = await fetch(`/api/forms/${type}`); // form jsonu getirmek için istek attık
    const formJson = await res.json(); // gelen yanıtı javascriptte kullanmak için javascript nesnesine çevirir

    let operationID = null;
    if (type === "editTodo-form" || type === "editUser-form") {
      const pathParts = window.location.pathname.split("/"); // /edit /:id olark böldük
      operationID = pathParts[pathParts.length - 1]; // son indexi aldik
    }

    if (type === "editTodo-form" && "editUser-form") {
      formJson.elements.push({
        type: "html",
        name: "cancel-button",
        html: `<a href="/" class="px-5 btn btn-danger btn-md">Vazgeç</a>`,
      });
    }
    if (type === "addTodo-form") {
      const res = await fetch("/api/categoryList");
      const data = await res.json();
      formJson.elements.push({
        type: "dropdown",
        name: "categoryId",
        title: "Kategoriler",
        isRequired: true,
        requiredErrorText: "Lütfen Doldurunuz",
        choices: data.map((cat) => ({ value: cat._id, text: cat.name })),
      });
    }

    const survey = new Survey.Model(formJson); // formJson bir survey modeli diye tanımlıyoruz

    if (prefillData && Object.keys(prefillData).length > 0) {
      survey.data = prefillData;
    }

    if (
      type === "addUser-form" ||
      type === "addTodo-form" ||
      type === "addCategory-form"
    ) {
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
    } else if (type === "editUser-form") {
      survey.completeText = "Güncelle";
      survey.showCompletedPage = false;
    } else if (type === "resetpw-form") {
      survey.completeText = "Gönder";
      survey.showCompletedPage = false;
    }

    const endpointMap = {
      "editTodo-form": "/api/operation/update",
      "addTodo-form": "/api/operation/add",
      "addUser-form": "/api/user-operation/add",
      "login-form": "/api/login",
      "editUser-form": "/api/user-operation/update",
      "register-form": "/api/register",
      "resetpw-form": "/api/resetpw",
      "verifytoken-form": "/api/verifytoken",
      "newpw-form": "/api/newpassword",
      "addCategory-form": "/api/category-operation/add",
    };

    survey.onComplete.add(async (sender) => {
      const formData = sender.data;

      if (operationID) {
        formData._id = operationID;
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
        if (!res.ok) {
          throw new Error("HATA", res.statusText);
        }
        const data = await res.json();
        if (data.success === false) {
          this.showError(data.error || "Bir şeyler yanlış gitti");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
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
            window.location = `/#myTodos`;
            break;
          case "editUser-form":
            window.location = "/#userList";
            break;
          case "addUser-form":
            window.location = "#userList";
            break;
          case "addCategory-form":
            window.location = "/";
            break;
          case "resetpw-form":
            window.location = "/login";
            break;
          case "verifytoken-form":
            window.location = "/newpassword";
            break;
          case "newpw-form":
            window.location = "/login";
            break;
        }
      } catch (err) {
        console.error("HATA", err);
      }
    });
    $("#surveyContainer").Survey({ model: survey }); // $surveyContainer etkiketine survey modelini koy formu oluştur
  }
}

export default FormController;
