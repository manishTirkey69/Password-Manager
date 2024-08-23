const { contextBridge, ipcRenderer } = require("electron");

// darkMode toggling
contextBridge.exposeInMainWorld("darkMode", {
  invoke: (channel) => ipcRenderer.invoke(channel),
});

// window things , app name , icon etc.
contextBridge.exposeInMainWorld("window_things", {
  send: (channel) => ipcRenderer.send(channel),
  invoke: (channel) => ipcRenderer.invoke(channel),

  on: (channel, callback) =>
    ipcRenderer.on(channel, (event, ...args) => callback(...args)),
});

contextBridge.exposeInMainWorld("API", {
  call: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
});

// window title bar
contextBridge.exposeInMainWorld("window_title_bar", {
  send: (channel) => ipcRenderer.send(channel),
  invoke: (channel) => ipcRenderer.invoke(channel),

  on: (channel, callback) =>
    ipcRenderer.on(channel, (event, ...args) => callback(...args)),
});

// window loading sender
window.addEventListener("load", () => {
  ipcRenderer.send("win:load");
});

// clipboard url/username and password
contextBridge.exposeInMainWorld("clipboard", {
  writeText: (text) => ipcRenderer.invoke("writeText:clipboard", text),
  getText: () => ipcRenderer.invoke("getText:clipboard"),
});

