// js/index.js

const API_URL = 'https://back-end-tf-web-main.vercel.app';

let slideAtual = 0;
let totalSlides = 0;
let autoPlayInterval = null;

// Carregar banner rotativo
async function carregarBanner() {
    const bannerLoading = document.getElementById('banner-loading');
    const bannerContainer = document.getElementById('banner-container');
    const bannerError = document.getElementById('banner-error');
    
    try {
        console.log('Buscando banner da API...');
        
        const response = await fetch(
            `https://api.allorigins.win/raw?url=${encodeURIComponent(API_URL + '/banner')}`
        );
        
        if (!response.ok) {
            throw new Error('Erro ao carregar banner');
        }
        
        const banners = await response.json();
        console.log('Banners recebidos:', banners);
        
        if (banners.length > 0 && banners[0].imagens) {
            const imagens = banners[0].imagens;
            totalSlides = imagens.length;
            
            bannerLoading.style.display = 'none';
            bannerContainer.style.display = 'block';
            
            exibirBanner(imagens);
            iniciarAutoPlay();
        } else {
            throw new Error('Nenhuma imagem no banner');
        }
        
    } catch (error) {
        console.error('Erro ao carregar banner:', error);
        bannerLoading.style.display = 'none';
        bannerError.style.display = 'block';
    }
}

// Exibir slides do banner
function exibirBanner(imagens) {
    const bannerSlides = document.getElementById('banner-slides');
    const bannerDots = document.getElementById('banner-dots');
    
    bannerSlides.innerHTML = '';
    bannerDots.innerHTML = '';
    
    imagens.forEach((imagem, index) => {
        // Criar slide
        const slide = document.createElement('div');
        slide.className = 'banner-slide';
        if (index === 0) slide.classList.add('active');
        
        // Verificar se é base64 ou URL
        if (imagem.startsWith('data:image') || imagem.startsWith('http')) {
            slide.innerHTML = `<img src="${imagem}" alt="Banner ${index + 1}">`;
        } else {
            // Se for base64 sem prefixo
            slide.innerHTML = `<img src="data:image/jpeg;base64,${imagem}" alt="Banner ${index + 1}">`;
        }
        
        bannerSlides.appendChild(slide);
        
        // Criar indicador (dot)
        const dot = document.createElement('span');
        dot.className = 'banner-dot';
        if (index === 0) dot.classList.add('active');
        dot.onclick = () => irParaSlide(index);
        bannerDots.appendChild(dot);
    });
}

// Mudar slide
function mudarSlide(direcao) {
    pararAutoPlay();
    
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.banner-dot');
    
    slides[slideAtual].classList.remove('active');
    dots[slideAtual].classList.remove('active');
    
    slideAtual += direcao;
    
    if (slideAtual >= totalSlides) slideAtual = 0;
    if (slideAtual < 0) slideAtual = totalSlides - 1;
    
    slides[slideAtual].classList.add('active');
    dots[slideAtual].classList.add('active');
    
    iniciarAutoPlay();
}

// Ir para slide específico
function irParaSlide(index) {
    pararAutoPlay();
    
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.banner-dot');
    
    slides[slideAtual].classList.remove('active');
    dots[slideAtual].classList.remove('active');
    
    slideAtual = index;
    
    slides[slideAtual].classList.add('active');
    dots[slideAtual].classList.add('active');
    
    iniciarAutoPlay();
}

// Auto play do banner
function iniciarAutoPlay() {
    pararAutoPlay();
    autoPlayInterval = setInterval(() => {
        mudarSlide(1);
    }, 5000); // Muda a cada 5 segundos
}

function pararAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
    }
}

// Carregar produtos em destaque (últimos 4 produtos)
async function carregarProdutosDestaque() {
    const featuredLoading = document.getElementById('featured-loading');
    const featuredGrid = document.getElementById('featured-grid');
    
    try {
        console.log('Buscando produtos em destaque...');
        
        const response = await fetch(
            `https://api.allorigins.win/raw?url=${encodeURIComponent(API_URL + '/produto')}`
        );
        
        if (!response.ok) {
            throw new Error('Erro ao carregar produtos');
        }
        
        const produtos = await response.json();
        
        // Pega os últimos 4 produtos
        const produtosDestaque = produtos.slice(-4);
        
        featuredLoading.style.display = 'none';
        
        if (produtosDestaque.length > 0) {
            exibirProdutosDestaque(produtosDestaque);
        }
        
    } catch (error) {
        console.error('Erro ao carregar produtos em destaque:', error);
        featuredLoading.style.display = 'none';
    }
}

// Exibir produtos em destaque
function exibirProdutosDestaque(produtos) {
    const featuredGrid = document.getElementById('featured-grid');
    featuredGrid.innerHTML = '';
    
    produtos.forEach(produto => {
        const productItem = document.createElement('a');
        productItem.href = `produto.html?id=${produto.id_produto}`;
        productItem.className = 'product-item';
        
        const preco = parseFloat(produto.preco);
        const precoFormatado = isNaN(preco) ? '0,00' : preco.toFixed(2).replace('.', ',');
        
        productItem.innerHTML = `
            ${produto.imagem ? 
                `<img src="${produto.imagem}" alt="${produto.nome}">` 
                : 
                '<div class="no-image">Sem imagem</div>'
            }
            <div class="product-info">
                <h3>${produto.nome || 'Produto sem nome'}</h3>
                <p class="product-description">${produto.descricao || 'Sem descrição'}</p>
                <p class="product-price">R$ ${precoFormatado}</p>
            </div>
        `;
        
        featuredGrid.appendChild(productItem);
    });
}

// Busca rápida (redireciona para a página apropriada)
function configurarBusca() {
    const searchInput = document.getElementById('search-input');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const termo = searchInput.value.trim();
            if (termo) {
                // Redireciona para página de tecidos com termo de busca
                window.location.href = `tecidos.html?busca=${encodeURIComponent(termo)}`;
            }
        }
    });
}

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página inicial carregada');
    carregarBanner();
    carregarProdutosDestaque();
    configurarBusca();
});

// Parar autoplay quando sair da página
window.addEventListener('beforeunload', pararAutoPlay);