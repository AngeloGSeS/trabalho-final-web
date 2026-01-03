// admin/js/alterar-produto.js

const API_URL = 'https://back-end-tf-web-main.vercel.app';

let produtoAtual = null;

// Pegar ID do produto da URL
function getProdutoId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Carregar dados do produto
async function carregarProduto() {
    const loading = document.getElementById('loading');
    const errorContainer = document.getElementById('error-container');
    const formContainer = document.getElementById('form-container');
    
    const produtoId = getProdutoId();
    
    if (!produtoId) {
        loading.style.display = 'none';
        errorContainer.style.display = 'block';
        return;
    }
    
    try {
        console.log('Carregando produto ID:', produtoId);
        
        const response = await fetch(
            `https://api.allorigins.win/raw?url=${encodeURIComponent(API_URL + '/produto/' + produtoId)}`
        );
        
        if (!response.ok) {
            throw new Error('Produto não encontrado');
        }
        
        const produto = await response.json();
        console.log('Produto carregado:', produto);
        
        produtoAtual = produto;
        
        // Esconde loading e mostra formulário
        loading.style.display = 'none';
        formContainer.style.display = 'block';
        
        // Preencher formulário com dados do produto
        preencherFormulario(produto);
        
    } catch (error) {
        console.error('Erro ao carregar produto:', error);
        loading.style.display = 'none';
        errorContainer.style.display = 'block';
    }
}

// Preencher formulário com dados do produto
function preencherFormulario(produto) {
    document.getElementById('produto-id').value = produto.id_produto;
    document.getElementById('nome').value = produto.nome || '';
    document.getElementById('categoria').value = produto.categoria || '';
    document.getElementById('preco').value = produto.preco || '';
    document.getElementById('cores').value = produto.cores || '';
    document.getElementById('descricao').value = produto.descricao || '';
    document.getElementById('imagem').value = produto.imagem || '';
    
    // Mostrar preview da imagem atual
    if (produto.imagem) {
        const imagePreview = document.getElementById('image-preview');
        const currentImage = document.getElementById('current-image');
        currentImage.src = produto.imagem;
        imagePreview.style.display = 'block';
    }
}

// Salvar alterações do produto
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('alterar-form');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formMessage = document.getElementById('form-message');
        const submitBtn = form.querySelector('.btn-save');
        const adminId = localStorage.getItem('adminId');
        
        if (!adminId) {
            alert('Erro: Admin não identificado. Faça login novamente.');
            window.location.href = 'login.html';
            return;
        }
        
        // Desabilitar botão
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
        
        // Coletar dados do formulário
        const produtoId = document.getElementById('produto-id').value;
        const produtoData = {
            nome: document.getElementById('nome').value,
            categoria: document.getElementById('categoria').value,
            preco: parseFloat(document.getElementById('preco').value),
            cores: document.getElementById('cores').value || null,
            descricao: document.getElementById('descricao').value || null,
            imagem: document.getElementById('imagem').value || null,
            id_admin: parseInt(adminId)
        };
        
        console.log('Atualizando produto:', produtoData);
        
        try {
            const response = await fetch(`${API_URL}/produto/${produtoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(produtoData)
            });
            
            const resultado = await response.json();
            
            if (response.ok) {
                formMessage.textContent = '✓ Produto atualizado com sucesso!';
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
                
                // Redirecionar após 2 segundos
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                throw new Error(resultado.mensagem || 'Erro ao atualizar produto');
            }
            
        } catch (error) {
            console.error('Erro:', error);
            formMessage.textContent = '✗ ' + error.message;
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            
            // Reabilitar botão
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Salvar Alterações';
        }
    });
});

// Carregar produto ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    carregarProduto();
});

// Função de sair
function sair() {
    if (confirm('Deseja realmente sair?')) {
        localStorage.removeItem('adminLogado');
        localStorage.removeItem('adminId');
        localStorage.removeItem('adminUsuario');
        window.location.href = 'login.html';
    }
}