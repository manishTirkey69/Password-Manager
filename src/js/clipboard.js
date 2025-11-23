let UpdateForm = false;
let Current_Payload = null;

window.addEventListener("load", () => {
  const form = document.getElementById("clipboard-form");
  const clipboard_btn = document.getElementById("clipboard");

  // submit the clipboard form
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const password = event.target.password.value.trim();

    // clipping the password to the clipboard
    if (!UpdateForm) {
      clipboard.writeText(password).then((res) => {
        setTimeout(() => {
          clipboard_btn.style.border = "1px solid #59ff0b";
        }, 50);

        setTimeout(() => {
          clipboard_btn.style.border = "1px solid #060606";
        }, 500);

        setTimeout(() => {
          clipboard_btn.style.border = "1px solid #59ff0b";
        }, 600);

        setTimeout(() => {
          clipboard_btn.style.border = "1px solid #060606";
        }, 700);
      });
    }
    // update the form
    else {
      const url = event.target.url.value.trim();
      const userId = event.target.username.value.trim();
      const id = event.target.id.value;

      API.call("API:updatePassword", id, url, userId, password).then((res) => {
        if (res) {
          setTimeout(() => {
            clipboard_btn.style.border = "1px solid #59ff0b";
          }, 50);

          setTimeout(() => {
            clipboard_btn.style.border = "1px solid #060606";
          }, 500);

          setTimeout(() => {
            clipboard_btn.style.border = "1px solid #59ff0b";
          }, 600);

          setTimeout(() => {
            clipboard_btn.style.border = "1px solid #060606";
          }, 700);

          clipboard_btn.innerText = "Clipboard";
          UpdateForm = false;
        }
      });
    }
  });
});

// Look up any Input changes in Right Panel
window.addEventListener("load", () => {
  const urlInput = document.getElementById("c-urlInput");
  const usernameInput = document.getElementById("c-usernameInput");
  const passwordInput = document.getElementById("c-passwordInput");
  const clipboard_btn = document.getElementById("clipboard");

  urlInput.addEventListener("input", () => {
    if (Current_Payload.Url !== urlInput.value)
      ActiveUpdateBtn(clipboard_btn);
    else ActiveClipboard(clipboard_btn);
  });

  usernameInput.addEventListener("input", () => {
    if (Current_Payload.userId !== usernameInput.value)
      ActiveUpdateBtn(clipboard_btn);
    else ActiveClipboard(clipboard_btn);
  });

  passwordInput.addEventListener("input", () => {
    if (Current_Payload.Password !== passwordInput.value)
      ActiveUpdateBtn(clipboard_btn);
    else ActiveClipboard(clipboard_btn);
  });
});

// make current selected password to Global for all
API.on("API:CurrentSelectedPassword", (payloads) => {
  Current_Payload = payloads;
});

function ActiveClipboard(clipboard_btn) {
  clipboard_btn.innerText = "Clipboard";
  UpdateForm = false;
}

function ActiveUpdateBtn(clipboard_btn) {
  clipboard_btn.innerText = "Update";
  UpdateForm = true;
}
