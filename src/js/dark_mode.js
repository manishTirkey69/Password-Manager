// $('.mode').click(function() {
//   $('body').toggleClass("dark");
//   $(this).toggleClass("off");

//   DarkToggle()
  
//   var toggl = $(this);
//   toggl.addClass('scaling');

//   setTimeout(function() {
//     toggl.removeClass('scaling');
//   }, 520);

// });


const mode = document.getElementById("mode");

mode.addEventListener('click', function(e){
  document.body.classList.toggle("dark")
  
  mode.classList.toggle("off")

  mode.classList.add('scaling');

  setTimeout(function(){
    mode.classList.remove('scaling')
    DarkToggle()
  }, 520);
})



const DarkToggle = async ()=>{
  // await window.darkMode.toggle()
  darkMode.invoke("dark-mode:toggle").then((res)=>{
    console.log(res)
  })

  // const isDarkMode = await window.darkMode.toggle()
  // document.body.className = isDarkMode ? 'dark' : ''
}

