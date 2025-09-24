document.addEventListener('DOMContentLoaded', () => {
    // Adiciona funcionalidade de navegação aos cards de categoria
    const tecidoCard = document.getElementById('tecido-card');
    if (tecidoCard) {
        tecidoCard.addEventListener('click', () => {
            window.location.href = 'tecido.html';
        });
    }

    const camaMesaBanhoCard = document.getElementById('cama-mesa-banho-card');
    if (camaMesaBanhoCard) {
        camaMesaBanhoCard.addEventListener('click', () => {
            window.location.href = 'cama-mesa-banho.html';
        });
    }

    // Exemplo de como você poderia lidar com um banner rotativo
    // (Este é um placeholder, para uma implementação real, seria mais complexo)
    const banner = document.querySelector('.banner-rotativo');
    if (banner) {
        // console.log("Banner rotativo detectado. Implementação de rotação viria aqui.");
    }

    // Marca o item de navegação ativo com base na URL
    const navItems = document.querySelectorAll('nav ul li a');
    const currentPath = window.location.pathname.split('/').pop();

    navItems.forEach(item => {
        if (item.getAttribute('href') === currentPath || (currentPath === '' && item.getAttribute('href') === 'index.html')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Animação para a barra de pesquisa ao focar
    const searchInput = document.querySelector('.search-bar input');
    const searchIcon = document.querySelector('.search-bar i');

    if (searchInput && searchIcon) {
        searchInput.addEventListener('focus', () => {
            searchIcon.style.color = '#555'; // Uma cor um pouco mais escura
            searchInput.style.width = '250px'; // Aumenta a largura
            searchInput.style.transition = 'width 0.3s ease-in-out';
        });

        searchInput.addEventListener('blur', () => {
            searchIcon.style.color = 'var(--primary-color)';
            searchInput.style.width = '200px'; // Volta à largura original
        });
    }
});