document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("toggle-theme");
    const icon = toggleBtn.querySelector("i");  
    
    if (localStorage.getItem("modo-escuro") === "ativo") {
      document.body.classList.add("dark-mode");
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
    }
  
    toggleBtn.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-mode");
  
      // Alternar o ícone
      icon.classList.toggle("fa-moon");
      icon.classList.toggle("fa-sun");
  
      localStorage.setItem("modo-escuro", isDark ? "ativo" : "inativo");
    });
  });
  let currentFontSize = localStorage.getItem('fontSize') 
  ? parseInt(localStorage.getItem('fontSize')) 
  : 100;

document.documentElement.style.fontSize = currentFontSize + '%';

function updateFontSize(size) {
  currentFontSize = size;
  document.documentElement.style.fontSize = currentFontSize + '%';
  localStorage.setItem('fontSize', currentFontSize);
}

function increaseFont() {
  updateFontSize(currentFontSize + 10);
}

function decreaseFont() {
  updateFontSize(currentFontSize - 10);
}

function resetFont() {
  updateFontSize(100);
}
document.addEventListener("DOMContentLoaded", function () {
  const float = document.querySelector('.accessibility-float');
  const mainBtn = document.querySelector('.accessibility-main-btn');

  if (mainBtn && float) {
    mainBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      float.classList.toggle('active');
    });

    // Fecha ao clicar fora
    document.addEventListener('click', function(e) {
      if (!float.contains(e.target)) {
        float.classList.remove('active');
      }
    });
  }
});
