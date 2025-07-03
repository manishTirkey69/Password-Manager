// slider between clipboard and save
window.addEventListener("load", () => {
  const clipboardButton = document.getElementById("clipboard-slide");
  const saveButton = document.getElementById("save-slide");
  const container = document.getElementById("container");
  const searchInput = document.getElementById("search-input");
  const list_container = document.getElementById("list-container");

  clipboardButton.addEventListener("click", () => {
    container.classList.add("right-panel-active");
  });

  saveButton.addEventListener("click", () => {
    container.classList.remove("right-panel-active");

    // reset input value
    searchInput.value = "";

    // reset list_container
    list_container.innerHTML = "";
  });
});

// right click to paste url/username
window.addEventListener("load", () => {
  const username_in = document.getElementById("save-username-in");
  const save_in = document.getElementById("save-password-in");

  username_in.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    clipboard.getText().then((paste_text) => {
      username_in.value = paste_text;

      const domain = extractDomain(paste_text);
      console.log(domain);

      if (domain) {
        fetchFavicon(domain).then((iconURL) => {
          console.log(iconURL);
          const url_logo_img = document.getElementById("save-url-logo");
          url_logo_img.src = iconURL;
          url_logo_img.srcset = "";
        });
      }
    });
  });

  save_in.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    console.log("right clicked on save_input");
  });
});

// show-hide an icon on password

window.addEventListener("load", () => {
  const showIcon = `
  <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 68.18"><defs><style>.cls-1{fill-rule:evenodd;}</style></defs><title>view</title><path class="cls-1" d="M61.44,13.81a20.31,20.31,0,1,1-14.34,6,20.24,20.24,0,0,1,14.34-6ZM1.05,31.31A106.72,106.72,0,0,1,11.37,20.43C25.74,7.35,42.08.36,59,0s34.09,5.92,50.35,19.32a121.91,121.91,0,0,1,12.54,12,4,4,0,0,1,.25,5,79.88,79.88,0,0,1-15.38,16.41A69.53,69.53,0,0,1,63.43,68.18,76,76,0,0,1,19.17,53.82,89.35,89.35,0,0,1,.86,36.44a3.94,3.94,0,0,1,.19-5.13Zm15.63-5A99.4,99.4,0,0,0,9.09,34,80.86,80.86,0,0,0,23.71,47.37,68.26,68.26,0,0,0,63.4,60.3a61.69,61.69,0,0,0,38.41-13.72,70.84,70.84,0,0,0,12-12.3,110.45,110.45,0,0,0-9.5-8.86C89.56,13.26,74.08,7.58,59.11,7.89S29.63,14.48,16.68,26.27Zm39.69-7.79a7.87,7.87,0,1,1-7.87,7.87,7.86,7.86,0,0,1,7.87-7.87Z"/></svg>
  `;

  const hideIcon = `
  <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 53.37"><title>closed-eye</title><path d="M1.05,7.37A4.49,4.49,0,1,1,7.93,1.61a114.61,114.61,0,0,0,14.88,15C35.48,27,48.63,32.25,61.67,32.24S87.79,27,100.37,16.49A112.38,112.38,0,0,0,114.94,1.64a4.48,4.48,0,0,1,6.92,5.69,129.09,129.09,0,0,1-10,10.85l5.91,5.42a4.47,4.47,0,1,1-6,6.6l-6.59-6a86.1,86.1,0,0,1-13.43,9.06l3.73,8A4.48,4.48,0,0,1,87.35,45l-3.74-8a61.24,61.24,0,0,1-17.56,4V48.9a4.48,4.48,0,0,1-8.95,0V41A61.75,61.75,0,0,1,39.58,37l-3.76,8a4.48,4.48,0,1,1-8.11-3.79l3.74-8A88.78,88.78,0,0,1,18,24.2l-6.55,6a4.47,4.47,0,1,1-6-6.6l5.83-5.34A130.63,130.63,0,0,1,1.05,7.37Z"/></svg>
  `;

  const sBtn = document.getElementById("show-hide-btn");
  const password_input = document.getElementById("save-password-in");

  const cBtn = document.getElementById("c-show-hide-btn");
  const cPasswordInput = document.getElementById("c-passwordInput");

  const Update = (btn, input) => {
    if (btn.classList.contains("hide")) {
      btn.classList.remove("hide");
      btn.classList.add("show");
      btn.innerHTML = showIcon;
      input.setAttribute("type", "text");
    } else {
      btn.classList.remove("show");
      btn.classList.add("hide");
      btn.innerHTML = hideIcon;
      input.setAttribute("type", "password");
    }
  };

  sBtn.addEventListener("click", () => {
    Update(sBtn, password_input);
  });

  cBtn.addEventListener("click", () => {
    Update(cBtn, cPasswordInput);
  });
});
