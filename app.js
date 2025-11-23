const {
  app,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  clipboard,
  dialog,
} = require("electron");
const path = require("node:path");
const { DB, Model } = require("./src/library/mongoose");
const { Encrypt, Decrypt } = require("./src/library/Enc_Dec");
const { extractDomain, fetchFavicon } = require("./src/library/validation");
const { searchUserId, searchPassword } = require("./src/library/findDataDB");
const { GeneratePassword } = require("./src/library/password_generate");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const icon_path = "./public/favico.ico";

let mainwindow = null;

const createWindow = () => {
  // Create the browser window.
  mainwindow = new BrowserWindow({
    minHeight: 500,
    minWidth: 600,
    width: 1000,
    height: 700,

    flashFrame: false,
    show: false,
    title: "Password Manager",
    icon: icon_path,
    setOverlayIcon: icon_path,
    autoHideMenuBar: true,
    frame: false,

    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      enableRemoteModule: false,

      // make false when app is ready to build
      devTools: true,
      preload: path.join(__dirname, "./src/main_preload.js"),
    },
  });

  mainwindow.setContentProtection(true);

  // and load the index.html of the app.
  mainwindow.loadFile(path.join(__dirname, "public/main.html"));

  mainwindow.on("ready-to-show", () => {
    mainwindow.show();
  });

  mainwindow.on("maximize", () => {
    mainwindow.webContents.send("win:maximize");
  });

  mainwindow.on("unmaximize", () => {
    mainwindow.webContents.send("win:unmaximize");
  });

  mainwindow.on("restore", () => {
    mainwindow.webContents.send("win:resotre");
  });

  mainwindow.on("close", (event) => {
    event.preventDefault();
    closeApp();
  });

  mainwindow.on("blur", () => {
    mainwindow.webContents.send("window:blur");
  });

  mainwindow.on("focus", () => {
    mainwindow.webContents.send("window:focus");
  });

  ipcMain.handle("win:title", () => {
    return mainwindow.title;
  });

  ipcMain.handle("win:setIcon", () => {
    return path.join(__dirname, icon_path);
  });

  // Open the DevTools.
  // mainwindow.webContents.openDevTools({ mode: "undocked" });

  //   mainwindow.webContents.on('did-finish-load', () => {
  //     mainwindow.webContents.insertCSS(`
  //       @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');
  //       @import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');

  //     `);
  //   });
  // }
};

function closeApp() {
  if (DB.readyState === 1) {
    // Check if the DB is connected
    DB.close()
      .then(() => {
        console.log("DB connection closed.");
      })
      .catch((err) => {
        console.error("Error while closing the DB connection:", err);
      })
      .finally(() => {
        mainwindow.destroy();
      });
  } else {
    mainwindow.destroy(); // If DB isn't connected, close the window directly
  }
}

ipcMain.handle("dark-mode:toggle", () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = "light";
  } else {
    nativeTheme.themeSource = "dark";
  }
  return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle("dark-mode:system", () => {
  nativeTheme.themeSource = "system";
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on("win:minimize", () => {
  mainwindow.minimize();
});

ipcMain.handle("win:maxi_restore", () => {
  if (!mainwindow.isMaximized()) mainwindow.maximize();
  else mainwindow.restore();

  return mainwindow.isMaximized();
});

ipcMain.handle("win:isMaximized", () => {
  return mainwindow.isMaximized();
});

ipcMain.on("win:close", () => {
  closeApp();
});

ipcMain.on("win:load", () => {
  mainwindow.webContents.send("win:load");
});

// reading text from clipboard
ipcMain.handle("getText:clipboard", () => {
  return clipboard.readText();
});

ipcMain.handle("writeText:clipboard", (event, text) => {
  clipboard.writeText(text);
  return true;
});

// API call
ipcMain.handle("API:encrypt", (event, data) => {
  return Encrypt(data);
});

ipcMain.handle("API:decrypt", (event, data) => {
  return Decrypt(data);
});

ipcMain.handle("API:extractDomain", (event, url) => {
  return extractDomain(url);
});

ipcMain.handle("API:fetchFavicon", (event, url) => {
  return fetchFavicon(url);
});

ipcMain.handle(
  "API:saveNewPassword",
  async (event, url, username, encryptedPassword) => {
    try {
      const isExists = await Model.findOne({
        url: url,
        userId: username,
      });

      if (isExists) return { success: false };
      else {
        const newPassword = new Model({
          url: url,
          userId: username,
          password: encryptedPassword,
        });

        const saved = await newPassword.save();
        if (saved) {
          return { success: true };
        }
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
);

ipcMain.handle("API:search", async (event, keyword) => {
  return searchUserId(keyword);
});

ipcMain.handle("API:searchPassword", async (event, Id) => {
  return searchPassword(Id);
});

ipcMain.handle(
  "API:updatePassword",
  async (event, id, url, userId, password) => {
    const isExists = await Model.findOne({
      _id: id,
    });

    if (isExists) {
      isExists.url = url;
      isExists.userId = userId;
      isExists.password = Encrypt(password);

      const saved = await isExists.save();
      if (saved) return true;
      else return false;
    }
    return false;
  }
);

ipcMain.handle("API:generatePassword", () => {
  return GeneratePassword();
});

ipcMain.handle("API:PasswordConfirmation", () => {
  return msgDialog();
});

ipcMain.on("API:PasswordSelectionSignal", (event, payloads) => {
  mainwindow.webContents.send("API:CurrentSelectedPassword", payloads);
});

// functions
async function msgDialog() {
  const result = await dialog.showMessageBox(mainwindow, {
    type: "info",
    icon: icon_path,
    title: "Confirm",
    message: "Do You want to Generate ?",
    detail: "Generate Password",
    buttons: ["cancel", "ok"],
    defaultId: 0,
    cancelId: 0,
    noLink: true,
  });

  return result;
}