// admin/js/listar-produtos.js

const API_URL = 'https://back-end-tf-web-main.vercel.app';

let todosProdutos = [];

// Carregar todos os produtos
async function carregarProdutos() {
    const loading = document.getElementById('loading');
    const tableContainer = document.getElementById('table-container');
    const noProducts = document.getElementById('no-products');
    
    try {
        console.log('Carregando produtos...');
        
        const response = await fetch(
            `https://api.allorigins.win/raw?url=${encodeURIComponent(API_URL + '/produto')}`
        );
        
        if (!response.ok) {
            throw new Error('Erro ao carregar produtos');
        }
        
        const produtos = await response.json();
        console.log('Produtos carregados:', produtos.length);
        
        todosProdutos = produtos;
        
        loading.style.display = 'none';
        
        if (produtos.length > 0) {
            tableContainer.style.display = 'block';
            exibirProdutos(produtos);
        } else {
            noProducts.style.display = 'block';
        }
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        loading.innerHTML = `
            <p style="color: red;">
                <i class="fas fa-exclamation-triangle"></i>
                Erro ao carregar produtos. Tente novamente.
            </p>
        `;
    }
}

// Exibir produtos na tabela
function exibirProdutos(produtos) {
    const tbody = document.getElementById('products-tbody');
    tbody.innerHTML = '';
    
    if (produtos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    Nenhum produto encontrado
                </td>
            </tr>
        `;
        return;
    }
    
    produtos.forEach(produto => {
        const preco = parseFloat(produto.preco).toFixed(2).replace('.', ',');
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${produto.id_produto}</td>
            <td>
                <div class="product-name-cell">
                    ${produto.imagem ? 
                        `<img src="${produto.imagem}" alt="${produto.nome}" class="product-thumb">` 
                        : 
                        '<div class="product-thumb-empty"><i class="fas fa-image"></i></div>'
                    }
                    <span>${produto.nome}</span>
                </div>
            </td>
            <td>${produto.categoria || 'Sem categoria'}</td>
            <td>R$ ${preco}</td>
            <td>${produto.cores || '-'}</td>
            <td class="actions-cell">
                <button onclick="editarProduto(${produto.id_produto})" class="btn-edit" title="Editar">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="confirmarExclusao(${produto.id_produto}, '${produto.nome.replace(/'/g, "\\'")}')" class="btn-delete" title="Excluir">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Editar produto
function editarProduto(id) {
    window.location.href = `alterarproduto.html?id=${id}`;
}

// Confirmar exclusão
function confirmarExclusao(id, nome) {
    if (confirm(`Deseja realmente excluir o produto "${nome}"?\n\nEsta ação não pode ser desfeita.`)) {
        excluirProduto(id);
    }
}

// Excluir produto
async function excluirProduto(id) {
    try {
        console.log('Excluindo produto ID:', id);
        
        const response = await fetch(`${API_URL}/produto/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('✓ Produto excluído com sucesso!');
            // Recarregar lista
            carregarProdutos();
        } else {
            const erro = await response.json();
            throw new Error(erro.mensagem || 'Erro ao excluir produto');
        }
        
    } catch (error) {
        console.error('Erro ao excluir:', error);
        alert('✗ Erro ao excluir produto: ' + error.message);
    }
}

// Busca de produtos
function configurarBusca() {
    const searchInput = document.getElementById('search-products');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase().trim();
        
        if (termo === '') {
            exibirProdutos(todosProdutos);
            return;
        }
        
        const produtosFiltrados = todosProdutos.filter(produto => {
            const nome = produto.nome ? produto.nome.toLowerCase() : '';
            const categoria = produto.categoria ? produto.categoria.toLowerCase() : '';
            const id = produto.id_produto.toString();
            
            return nome.includes(termo) || 
                   categoria.includes(termo) || 
                   id.includes(termo);
        });
        
        exibirProdutos(produtosFiltrados);
    });
}

// Função de sair (já definida no admin-check.js, mas repetindo aqui caso necessário)
function sair() {
    if (confirm('Deseja realmente sair?')) {
        localStorage.removeItem('adminLogado');
        localStorage.removeItem('adminId');
        localStorage.removeItem('adminUsuario');
        window.location.href = 'login.html';
    }
}

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    configurarBusca();
});