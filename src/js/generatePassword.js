window.addEventListener("load", () => {
  const RIGHT_PANEL = "right-panel-active";
  const LEFT_PANEL = "left-panel-active";

  const generateBtn = document.querySelectorAll("#generate-password");
  const passwordInput_1 = document.getElementById("c-passwordInput");
  const passwordInput_2 = document.getElementById("save-password-in");
  let current_password = null;

  generateBtn.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const clip_pwd = passwordInput_1.value.trim();
      const save_pwd = passwordInput_2.value.trim();
      let current_pwd = null;
      let current_pwd_input = null;

      const current_panel = Current_Panel();

      if (current_panel === RIGHT_PANEL) {
        current_pwd = clip_pwd;
        current_pwd_input = passwordInput_1;
      }
      if (current_panel === LEFT_PANEL) {
        current_pwd = save_pwd;
        current_pwd_input = passwordInput_2;
      }

      if (current_pwd !== "" && current_password !== current_pwd) {
        const { response } = await API.call("API:PasswordConfirmation");
        if(response)
        {
          const generatedPassword = await GeneratePassword()
          Set_Password(current_pwd_input, generatedPassword)
          current_password = generatedPassword;

          // send signal to Clipboard input to update, if Right Panel is Activated
          if (current_panel === RIGHT_PANEL) SendSignal(passwordInput_1);
        }
      } else {
        const generatedPassword = await GeneratePassword();
        Set_Password(current_pwd_input, generatedPassword);
        current_password = generatedPassword;

        // send signal to Clipboard input to update, if Right Panel is Activated
        if (current_panel === RIGHT_PANEL) SendSignal(passwordInput_1);
      }
    });
  });

  function Current_Panel() {
    const container = document.getElementById("container");

    const contains = container.classList.contains(RIGHT_PANEL);
    if (contains) return RIGHT_PANEL;
    return LEFT_PANEL;
  }

  function Set_Password(password_input, value) {
    password_input.value = value;
  }
});

async function GeneratePassword()
{
  const password = await API.call("API:generatePassword")
  return password
}


function SendSignal(Input)
{
  Input.dispatchEvent(new Event("input", { bubbles: true }));
}