function iniciarAutorizacao() {
  return new Promise((resolve) => {
    resolve(); // já autoriza sem esperar clique
  });
}

window.addEventListener('load', function() {
      const loadingScreen = document.getElementById('loading-screen');
      
      setTimeout(function() {
        loadingScreen.classList.add('hidden');
        // Remove a tela do DOM após a transição para não atrapalhar
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500); // Deve corresponder à duração da transição do CSS
      }, 3000); // 3000 milissegundos = 3 segundos
    });