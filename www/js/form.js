  import loadPage from "./navigation.js";

  function showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "alert alert-danger";
    errorDiv.textContent = message;
    const errorexist = document.querySelector(".alert.alert-danger");
    if (errorexist){
      errorexist.remove()
    }

    const surveyContainer = document.getElementById("surveyContainer");
    surveyContainer.parentNode.insertBefore(errorDiv,surveyContainer)
  }



  export default async function loadForm(type) {
        
    const res = await fetch(`/api/forms/${type}`); // Form modelini storageden çeken apiye istek attık
    const formJson = await res.json(); // formJsona responseyi json yapıp atadık
    console.log(formJson);
    const survey = new Survey.Model(formJson); // survey değişkenine formJsonun bir SurveyModeli olduğunu belirttik
    if (type === "addTodo-form" || type === "addUser-form") {
      survey.completeText = "Ekle";
    } else if (type === "login-form") {
      survey.completeText = "Giriş Yap";
      survey.showCompletedPage = false;
    } else if (type === "register-form"){
      survey.completeText = "Kayıt OL";
      survey.showCompletedPage = false
    }

    const endpointMap = {
      "addTodo-form": "/api/operation/add", // burda gelen type göre operation işlemlerini gerçekleştiriyoruz,
      "addUser-form": "/api/user-operation/add",
      "login-form": "/api/login",
      "register-form" : "/api/register"
    };

    survey.onComplete.add(async function (sender) {
      // ekleye bastığı gibi burası çalışcak
      const formData = sender.data; // sender.data yanii formdan gelen verileri çektik

      const endpoint = endpointMap[type]; // endpoint tanımladık
      if (!endpoint) {
        console.error(`Form tipi bulunamadı`);
        return;
      }
      try {
        const response = await fetch(endpoint, {
          // endpointe post isteğini attık formDatayı yolladık
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("API HATASI" + response.statusText);
        }
        // yeni
        const data = await response.json()
        console.log(data)

          // yeni
        if (data.success === false){
          showError(data.error || "Bir Hata oluştu");
          await loadForm(type)
          return;
        }

        switch (type) {
          case "addTodo-form":
          case "addUser-form":
            window.location = "#myTodos";
            await loadPage();
            break;
          case "login-form":
            window.location.href = "/"
            break;
          case "register-form":
            window.location.href = "/login";
            break;
        }
        console.log("Veri başarıyla kaydedildi", endpoint);

      } catch (err) {
        console.error("HATA", err);
      }
    });

    $("#surveyContainer").Survey({ model: survey }); // render ettik formu

    // survey.render("surveyContainer");
  }
