// js/tecidos.js

const API_URL = 'https://back-end-tf-web-main.vercel.app';

let todosProdutos = [];

async function carregarProdutos() {
    const loading = document.getElementById('loading');
    const productGrid = document.getElementById('product-grid');
    const noProducts = document.getElementById('no-products');
    
    try {
        console.log('Buscando produtos da API...');
        
        // Usando proxy temporário para evitar CORS
        const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(API_URL + '/produto')}`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const produtos = await response.json();
        console.log('Produtos recebidos:', produtos);
        
        todosProdutos = produtos;
        
        // Filtrar apenas produtos de "tecido" (produtos que NÃO são de cama/mesa/banho)
        const produtosFiltrados = produtos.filter(p => {
            if (!p.categoria) return true; // Se não tem categoria, mostra como tecido
            const cat = p.categoria.toLowerCase();
            // Mostra se a categoria NÃO é "cama, mesa e banho"
            return !cat.includes('cama') && !cat.includes('mesa') && !cat.includes('banho');
        });
        
        console.log('Produtos filtrados (tecidos):', produtosFiltrados);
        
        loading.style.display = 'none';
        
        if (produtosFiltrados.length > 0) {
            exibirProdutos(produtosFiltrados);
            noProducts.style.display = 'none';
        } else {
            productGrid.innerHTML = '';
            noProducts.style.display = 'block';
            noProducts.innerHTML = '<p>Nenhum tecido disponível no momento.</p>';
        }
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        loading.innerHTML = `
            <p style="color: red;">
                Erro ao carregar produtos: ${error.message}
            </p>
        `;
    }
}

function exibirProdutos(produtos) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';
    
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
                ${produto.cores ? `<p class="product-colors">Cores: ${produto.cores}</p>` : ''}
            </div>
        `;
        
        productGrid.appendChild(productItem);
    });
}

function configurarBusca() {
    const searchInput = document.getElementById('search-input');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const termoBusca = e.target.value.toLowerCase().trim();
        
        if (termoBusca === '') {
            // Se busca vazia, mostrar todos os tecidos
            const produtosFiltrados = todosProdutos.filter(p => {
                if (!p.categoria) return true;
                const cat = p.categoria.toLowerCase();
                return !cat.includes('cama') && !cat.includes('mesa') && !cat.includes('banho');
            });
            exibirProdutos(produtosFiltrados);
            document.getElementById('no-products').style.display = 'none';
            return;
        }
        
        const produtosFiltrados = todosProdutos.filter(produto => {
            const nome = produto.nome ? produto.nome.toLowerCase() : '';
            const descricao = produto.descricao ? produto.descricao.toLowerCase() : '';
            const categoria = produto.categoria ? produto.categoria.toLowerCase() : '';
            
            // Só busca em produtos que são tecidos (não cama/mesa/banho)
            const ehTecido = !categoria.includes('cama') && !categoria.includes('mesa') && !categoria.includes('banho');
            
            return ehTecido && (
                nome.includes(termoBusca) || 
                descricao.includes(termoBusca)
            );
        });
        
        const noProducts = document.getElementById('no-products');
        const productGrid = document.getElementById('product-grid');
        
        if (produtosFiltrados.length === 0) {
            productGrid.innerHTML = '';
            noProducts.style.display = 'block';
            noProducts.innerHTML = `<p>Nenhum tecido encontrado para "${termoBusca}"</p>`;
        } else {
            exibirProdutos(produtosFiltrados);
            noProducts.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Página de tecidos carregada');
    carregarProdutos();
    configurarBusca();
});