class userProfilePage {
  constructor(content, loadPage) {
    this.content = content;
    this.loadPage = loadPage;
    this.data = null;
  }

  async fetchUserProfileData() {
    const res = await fetch("/api/userProfile");
    const dataJson = await res.json();
    console.log(dataJson);
    this.data = dataJson;
  }
  async loadUserProfileHTML() {
    const res = await fetch("/userProfile");
    const html = await res.text();

    this.content.innerHTML = html;
  }
  async updateBio() {
    // const bioId = document.getElementById("profile-bio")

    // if (document.getElementById("bioInputArea")) return;

    // const newDiv = document.createElement("div");
    // newDiv.className = "d-flex align-center mt-3"
    // newDiv.id = "bioInputArea"
    // const bioInput = document.createElement("input");
    // bioInput.className = "form-control ";

    // const bioButton = document.createElement("button");
    // bioButton.innerText = "Güncelle"
    // bioButton.className = "btn btn-success ms-1";

    // const closeButton = document.createElement("button");
    // closeButton.innerText = "Kapat";
    // closeButton.className = "btn btn-warning ms-1"
    // closeButton.onclick = () => this.loadPage()

    // newDiv.appendChild(bioInput)
    // newDiv.appendChild(bioButton)
    // newDiv.appendChild(closeButton)
    // bioId.appendChild(newDiv)
    const value = prompt("Biyografi gir: ");

    const res = await fetch("/api/updateBio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio: value, userprof_id: this.data.userProf._id }),
    });
    this.loadPage();
  }

  async updateLocation() {
    let array = ["Samsun", "İstanbul", "Ankara"];

    const container = document.createElement("div");
    container.className = "d-flex p-3";

    const profloc = document.getElementById("profile-location");
    const sel = document.createElement("select");
    sel.className = "form-select mx-2";

    const selButton = document.createElement("button");
    selButton.innerText = "Onayla";
    selButton.className = "btn btn-success mx-2";

    const cancelButton = document.createElement("button");
    cancelButton.innerText = "Vazgeç";
    cancelButton.className = "btn btn-secondary mx-2";

    cancelButton.onclick = async () => await this.loadPage();

    for (let i = 0; i < array.length; i++) {
      const opt = new Option(array[i], array[i], false, false);
      sel.appendChild(opt);
    }
    container.append(sel);
    container.append(selButton);
    container.append(cancelButton);

    profloc.appendChild(container);

    selButton.onclick = async () => {
      const res = await fetch("/api/updateLocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: sel.value,
          userprof_id: this.data.userProf._id,
        }),
      });
      await this.loadPage();
    };
  }

  async loadPageContent() {
    //bioDiv
    const biodiv = document.createElement("div");
    biodiv.className = "d-flex align-center";

    const bio = document.getElementById("profile-bio");

    const biop = document.createElement("p");
    biop.innerText = this.data.userProf?.bio || "Henüz Bio Girmedin";
    biop.className = "w-75 card-text";

    const biob = document.createElement("button");
    biob.innerText = "Güncelle";
    biob.className = "w-25 btn btn-success";

    biodiv.appendChild(biop);
    biodiv.appendChild(biob);
    bio.appendChild(biodiv);

    biob.onclick = () => {
      biob.disabled = true;
      this.updateBio();
    };

    // locationdiv
    const locationdiv = document.createElement("div");

    const location = document.getElementById("profile-location");

    const locationp = document.createElement("p");
    locationp.innerText =
      this.data.userProf?.location || "Henüz Lokasyon Girmedin";

    const locationb = document.createElement("button");
    locationb.innerText = "Güncelle";
    locationb.className = "btn btn-warning";

    locationb.onclick = async () => {
      locationb.disabled = true;
      await this.updateLocation();
    };

    locationdiv.appendChild(locationp);
    locationdiv.appendChild(locationb);
    location.appendChild(locationdiv);

    // profile-img
    const profileImgDiv = document.createElement("div");
    const profileImg = document.getElementById("profile-img");
    const profileImgWrapper = document.getElementById("profile-img-wrapper");
    const profileButton = document.createElement("input");
    profileButton.innerText = "Güncelle";
    profileButton.type = "file";
    profileButton.accept = ".jpg,.jpeg,.png";
    profileButton.style.display = "none";
    profileImg.src =
      this.data.userProf?.profile_img || "../img/default_profile.jpeg";

    profileImgWrapper.appendChild(profileButton);

    const uploadImageText = document.createElement("p");

    profileImg.onclick = () => profileButton.click();
    profileImgWrapper.appendChild(uploadImageText);

    profileButton.addEventListener("change", async (e) => {
      const file = e.target.files[0];

      if (!file) return;

      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64data = reader.result.split(",")[1];

        const body = {
          filename: file.name,
          mimetpye: file.type,
          userprof_id: this.data.userProf._id,
          data: base64data,
        };
        await this.loadImage(body);
      };
      reader.readAsDataURL(file);
    });

    // date
    const dateField = document.getElementById("profile-created");
    dateField.innerText = new Date(
      this.data.userProf.stamps.createdAt
    ).toLocaleString("tr-TR");

    // completedTasks - unCompletedTasks

    const completedTasksF = document.getElementById("profile-completedTasks");
    completedTasksF.innerText = this.data.userStats.completedTasks.length;

    const unCompletedTasksF = document.getElementById(
      "profile-unCompletedTasks"
    );
    unCompletedTasksF.innerText = this.data.userStats?.unCompletedTasks.length;
  }
  async loadImage(body) {
    const res = await fetch("/api/updateImage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    await this.loadPage();
  }

  async init() {
    await this.fetchUserProfileData();
    if (this.data.userInf.validated === false) {
      alert("Lütfen hesabınızı onaylayınız");
      window.location = "/";
      return;
    }
    await this.loadUserProfileHTML();
    if (this.data.userProf.bio === "") {
      await this.updateBio();
    } else if (this.data.userProf.bio !== "") {
      this.loadPageContent();
    }
  }
}

export default userProfilePage;
