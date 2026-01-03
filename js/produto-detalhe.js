// js/produto-detalhe.js

const API_URL = 'https://back-end-tf-web-main.vercel.app';

// Função para pegar o ID da URL
function getProdutoIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Função para carregar o produto específico
async function carregarProduto() {
    const loading = document.getElementById('loading');
    const productContent = document.getElementById('product-content');
    const productError = document.getElementById('product-error');
    
    const produtoId = getProdutoIdFromURL();
    
    // Se não tem ID na URL, mostra erro
    if (!produtoId) {
        loading.style.display = 'none';
        productError.style.display = 'block';
        return;
    }
    
    try {
        console.log('Buscando produto ID:', produtoId);
        
        // Usando proxy temporário para evitar CORS
        const response = await fetch(
            `https://api.allorigins.win/raw?url=${encodeURIComponent(API_URL + '/produto/' + produtoId)}`
        );
        
        if (!response.ok) {
            throw new Error('Produto não encontrado');
        }
        
        const produto = await response.json();
        console.log('Produto recebido:', produto);
        
        // Esconde loading e mostra conteúdo
        loading.style.display = 'none';
        productContent.style.display = 'block';
        
        // Preenche os dados do produto
        exibirProduto(produto);
        
    } catch (error) {
        console.error('Erro ao carregar produto:', error);
        loading.style.display = 'none';
        productError.style.display = 'block';
    }
}

// Função para exibir os dados do produto na página
function exibirProduto(produto) {
    // Nome
    document.getElementById('product-name').textContent = produto.nome || 'Produto sem nome';
    
    // Descrição
    document.getElementById('product-description').textContent = 
        produto.descricao || 'Sem descrição disponível.';
    
    // Preço
    const preco = parseFloat(produto.preco);
    const precoFormatado = isNaN(preco) ? '0,00' : preco.toFixed(2).replace('.', ',');
    document.getElementById('product-price').textContent = `Preço: R$ ${precoFormatado}`;
    
    // Categoria
    document.getElementById('product-category').textContent = 
        produto.categoria || 'Não categorizado';
    
    // Imagem
    const productImageDiv = document.getElementById('product-image');
    if (produto.imagem) {
        productImageDiv.innerHTML = `<img src="${produto.imagem}" alt="${produto.nome}">`;
    } else {
        productImageDiv.innerHTML = '<div class="no-image-detail">Sem imagem disponível</div>';
    }
    
    // Cores
    const colorsDiv = document.getElementById('product-colors');
    if (produto.cores) {
        colorsDiv.innerHTML = `
            <span><strong>Cores disponíveis:</strong></span>
            <p style="margin-top: 10px;">${produto.cores}</p>
        `;
    } else {
        colorsDiv.innerHTML = '<p>Cores não especificadas</p>';
    }
    
    // Atualiza o título da página
    document.title = `${produto.nome} - Brex`;
}

// Carregar produto quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página de detalhe carregada');
    carregarProduto();
});