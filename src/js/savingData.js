const save_form = document.getElementById("save-form");
const save_btn = document.getElementById("save");

const urlInput = document.getElementById("save-url-in");
const usernameInput = document.getElementById("save-username-in");
const passwordInput = document.getElementById("save-password-in");

save_form.addEventListener("submit", (event) => {
  event.preventDefault();

  const url = urlInput.value.trim();
  const username = event.target.username.value.trim();
  const password = event.target.password.value.trim();

  API.call("API:encrypt", password).then((encryptedPassword) => {
    API.call("API:saveNewPassword", url, username, encryptedPassword)
      .then((res) => {
        console.log(res);

        if (res.success) {
          setTimeout(() => {
            save_btn.style.border = "1px solid #59ff0b";
          }, 50);

          setTimeout(() => {
            save_btn.style.border = "1px solid #060606";
          }, 500);

          setTimeout(() => {
            save_btn.style.border = "1px solid #59ff0b";
          }, 600);

          setTimeout(() => {
            save_btn.style.border = "1px solid #060606";
          }, 700);

          urlInput.value = "";
          usernameInput.value = "";
          passwordInput.value = "";
        }
      })

      .catch((error) => {
        console.log(error);
        setTimeout(() => {
          save_btn.style.border = "1px solid #f50029";
        }, 50);

        setTimeout(() => {
          save_btn.style.border = "1px solid #060606";
        }, 500);

        setTimeout(() => {
          save_btn.style.border = "1px solid #f50029";
        }, 600);

        setTimeout(() => {
          save_btn.style.border = "1px solid #060606";
        }, 700);
      });
  });
});
