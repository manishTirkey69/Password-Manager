// global variable
let currentSelectedItem = null;
let currentIndex = 0;


window.addEventListener("load", () => {
  const minimize = document.getElementById("win-minimize");
  const restore = document.getElementById("win-restore");
  const maximize = document.getElementById("win-maximize");
  const close = document.getElementById("win-close");

  const update_maxi_restore_btn = (res) => {
    if (res) {
      maximize.style.zIndex = "-1";
      restore.style.zIndex = "10";
    } else {
      maximize.style.zIndex = "10";
      restore.style.zIndex = "-1";
    }
  };

  const maxi_restore = () => {
    window_title_bar
      .invoke("win:maxi_restore")
      .then((res) => update_maxi_restore_btn(res));
  };

  window_title_bar.invoke("win:isMaximized").then((res) => {
    update_maxi_restore_btn(res);
  });

  minimize.addEventListener("click", () => {
    window_title_bar.send("win:minimize");
  });

  maximize.addEventListener("click", maxi_restore);
  restore.addEventListener("click", maxi_restore);

  close.addEventListener("click", () => {
    window_title_bar.send("win:close");
  });

  window_title_bar.on("win:maximize", () => {
    update_maxi_restore_btn(true);
  });
  window_title_bar.on("win:restore", () => {
    update_maxi_restore_btn(false);
  });
  window_title_bar.on("win:unmaximize", () => {
    update_maxi_restore_btn(false);
  });

  // search title-bar

  const searchBtn = document.getElementById("title-center");
  const searchModal = document.getElementById("search-modal");
  const searchInput = document.getElementById("search-input");

  searchBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    searchModal.classList.remove("search-hide");
    searchModal.classList.add("search-show");

    searchInput.focus();
  });

  document.addEventListener("click", (event) => {
    if (!searchModal.contains(event.target) || searchModal !== event.target) {
      searchModal.classList.remove("search-show");
      searchModal.classList.add("search-hide");
    }
  });

  searchModal.addEventListener("click", (event) => {
    event.stopPropagation();
  });
});

// window things
window_things.on("win:load", () => {
  // settings app title
  window_things.invoke("win:title").then((app_title_name) => {
    const app_title = document.getElementById("app_name");
    app_title.innerText = app_title_name;
  });

  // settings app icon
  window_things.invoke("win:setIcon").then((app_icon) => {
    const app_icon_container = document.getElementById("app-icon");
    app_icon_container.setAttribute("src", app_icon);
  });
});


// local shortcut keys 

window.addEventListener('contextmenu', (event) => {
  event.preventDefault(); // Disables right-click menu
  event.stopPropagation();
});

window.addEventListener("keydown", (event) => {

  if (event.ctrlKey && event.key.toLowerCase() === "p") {
    event.preventDefault(); // prevent default browser behavior
    event.stopPropagation();

    // open search modal
    const searchModal = document.getElementById("search-modal");
    searchModal.classList.remove("search-hide");
    searchModal.classList.add("search-show");

    document.getElementById("search-input").focus();
  }
});


window.addEventListener("keydown", (event) => {

  if (event.key.toLowerCase() === "escape" ) {
    event.preventDefault(); // prevent default browser behavior
    event.stopPropagation();

    // close search modal
    const searchModal = document.getElementById("search-modal");
    searchModal.classList.remove("search-show");
    searchModal.classList.add("search-hide");
  }
});

// search input
window.addEventListener("load", () => {
  const searchInput = document.getElementById("search-input");
  const list_container = document.getElementById("list-container");
  const searchModal = document.getElementById("search-modal");

  const urlInput = document.getElementById("c-urlInput");
  const usernameInput = document.getElementById("c-usernameInput");
  const idInput = document.getElementById("idInput");
  const passwordInput = document.getElementById("c-passwordInput");

  searchInput.addEventListener("input", (event) => {
    list_container.innerHTML = ``;

    let list_items = []

    API.call("API:search", event.target.value.trim()).then((data) => {

      data.map((Secret, index) => {
        const list_item = document.createElement("li");

        // list click listener
        list_item.addEventListener("click", function(event){
          const container = document.getElementById("container");

          // close the search modal after click on list item
          searchModal.classList.remove("search-show");
          searchModal.classList.add("search-hide");

          // searchInput.value = "";
          container.classList.add("right-panel-active");

          // set the value into username/password input

          API.call("API:searchPassword", this.id).then((res) => {
            usernameInput.value = res.userId;
            urlInput.value = res.url;
            idInput.value = res.id;

            API.call("API:decrypt", res.password).then((decryptedPassword) => {
              passwordInput.value = decryptedPassword;
            });
          });


          updateKeySelection(this);
          currentIndex = index;
        
        });

        list_item.id = Secret.id;
        list_item.innerHTML = `
        <img alt="" srcset="./favico.ico">
        <span>
          ${Secret.url} 
          <span class="userID">
            ${Secret.userId}
          </span>
        </span>
        `;
        list_container.appendChild(list_item);
        list_items.push(list_item);
      });

    selectionEvent(list_items);      
    });

    
  });
});

// list selection
// function updateKeySelection(items, currentIndex, newIndex) {
  function updateKeySelection(newItem){
  // items[currentIndex].classList.remove("selected");
  // currentIndex = newIndex;
  // items[currentIndex].classList.add("selected");
  // items[currentIndex].scrollIntoView({
  //   behavior: "smooth",
  //   block: "center",
  // });

  // return currentIndex;

  currentSelectedItem.classList.remove("selected");
  newItem.classList.add("selected");
  newItem.scrollIntoView({
    behavior: "smooth",
    block: "center",
  })

  currentSelectedItem = newItem;
}

const listContainer = document.getElementById("search-modal");
let currentKeydownListener = null;

function selectionEvent(items) {

  const itemLength = items.length;

  if (itemLength === 0) return;

  // reset values after search
  currentSelectedItem = null;
  currentIndex = 0;

  // select first list
  items[currentIndex].classList.add("selected");
  currentSelectedItem = items[0]

  // remove listener if it exists
  if (currentKeydownListener) {
    listContainer.removeEventListener("keydown", currentKeydownListener);
  }

  // create new listener
  currentKeydownListener = (event) => {
    
    // rotate in both direction upside and downside 

    if (event.key === "ArrowDown") {
      event.preventDefault();
      currentIndex = (currentIndex + 1) % itemLength;
      updateKeySelection(items[currentIndex]);

    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      currentIndex = (currentIndex - 1 + itemLength) % itemLength;
      updateKeySelection(items[currentIndex]);

    } else if (event.key === "Enter") items[currentIndex].click();
  };

  // add new listener
  listContainer.addEventListener('keydown', currentKeydownListener);
}




// ipc listening 
window_title_bar.on("window:focus", ()=>{
  const titleBar = document.getElementById("title-bar");
  titleBar.classList.remove("title-bar-blur");
  titleBar.classList.add("title-bar-focus");
})

window_title_bar.on("window:blur", ()=>{
  const titleBar = document.getElementById("title-bar");
  titleBar.classList.remove("title-bar-focus");
  titleBar.classList.add("title-bar-blur");  
})