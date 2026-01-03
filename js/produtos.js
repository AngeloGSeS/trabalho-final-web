const API_URL = 'https://back-end-tf-web-main.vercel.app';

let todosProdutos = [];

// Função para carregar produtos da API
async function carregarProdutos() {
    const loading = document.getElementById('loading');
    const productGrid = document.getElementById('product-grid');
    const noProducts = document.getElementById('no-products');
    
    try {
        console.log('Buscando produtos da API...');
        const response = await fetch(`${API_URL}/produto`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const produtos = await response.json();
        console.log('Produtos recebidos:', produtos);
        
        todosProdutos = produtos;
        
        // Filtrar apenas produtos de "cama, mesa e banho"
        const produtosFiltrados = produtos.filter(p => {
            if (!p.categoria) return false;
            const cat = p.categoria.toLowerCase();
            return cat.includes('cama') || cat.includes('mesa') || cat.includes('banho');
        });
        
        console.log('Produtos filtrados:', produtosFiltrados);
        
        // Esconder loading
        loading.style.display = 'none';
        
        // Exibir produtos
        if (produtosFiltrados.length > 0) {
            exibirProdutos(produtosFiltrados);
            noProducts.style.display = 'none';
        } else {
            productGrid.innerHTML = '';
            noProducts.style.display = 'block';
        }
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        loading.innerHTML = `
            <p style="color: red;">
                Erro ao carregar produtos: ${error.message}<br>
                Verifique se a API está funcionando em: ${API_URL}
            </p>
        `;
    }
}

// Função para exibir os produtos no grid
function exibirProdutos(produtos) {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';
    
    produtos.forEach(produto => {
        const productItem = document.createElement('a');
        productItem.href = `produto.html?id=${produto.id_produto}`;
        productItem.className = 'product-item';
        
        // Formatação do preço
        const preco = parseFloat(produto.preco);
        const precoFormatado = isNaN(preco) ? '0,00' : preco.toFixed(2).replace('.', ',');
        
        productItem.innerHTML = `
            ${produto.imagem ? 
                `<img src="${produto.imagem}" alt="${produto.nome}" onerror="this.parentElement.querySelector('.no-image').style.display='flex'; this.style.display='none';">
                 <div class="no-image" style="display:none;">Sem imagem</div>` 
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

// Função de busca
function configurarBusca() {
    const searchInput = document.getElementById('search-input');
    
    if (!searchInput) {
        console.warn('Campo de busca não encontrado');
        return;
    }
    
    searchInput.addEventListener('input', (e) => {
        const termoBusca = e.target.value.toLowerCase().trim();
        
        if (termoBusca === '') {
            // Se busca vazia, mostrar todos os produtos da categoria
            const produtosFiltrados = todosProdutos.filter(p => {
                if (!p.categoria) return false;
                const cat = p.categoria.toLowerCase();
                return cat.includes('cama') || cat.includes('mesa') || cat.includes('banho');
            });
            exibirProdutos(produtosFiltrados);
            document.getElementById('no-products').style.display = 'none';
            return;
        }
        
        const produtosFiltrados = todosProdutos.filter(produto => {
            const nome = produto.nome ? produto.nome.toLowerCase() : '';
            const descricao = produto.descricao ? produto.descricao.toLowerCase() : '';
            const categoria = produto.categoria ? produto.categoria.toLowerCase() : '';
            
            // Só busca em produtos da categoria cama, mesa e banho
            const ehCategoria = categoria.includes('cama') || categoria.includes('mesa') || categoria.includes('banho');
            
            return ehCategoria && (
                nome.includes(termoBusca) || 
                descricao.includes(termoBusca)
            );
        });
        
        const noProducts = document.getElementById('no-products');
        const productGrid = document.getElementById('product-grid');
        
        if (produtosFiltrados.length === 0) {
            productGrid.innerHTML = '';
            noProducts.style.display = 'block';
            noProducts.innerHTML = `<p>Nenhum produto encontrado para "${termoBusca}"</p>`;
        } else {
            exibirProdutos(produtosFiltrados);
            noProducts.style.display = 'none';
        }
    });
}

// Carregar produtos quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página carregada, iniciando...');
    carregarProdutos();
    configurarBusca();
});