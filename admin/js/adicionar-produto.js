// admin/js/adicionar-produto.js

const API_URL = 'https://back-end-tf-web-main.vercel.app';

// Preview da imagem ao colar URL
document.addEventListener('DOMContentLoaded', () => {
    const imagemInput = document.getElementById('imagem');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    
    if (imagemInput) {
        imagemInput.addEventListener('input', (e) => {
            const url = e.target.value.trim();
            
            if (url) {
                previewImg.src = url;
                imagePreview.style.display = 'block';
                
                // Esconder preview se imagem não carregar
                previewImg.onerror = () => {
                    imagePreview.style.display = 'none';
                };
            } else {
                imagePreview.style.display = 'none';
            }
        });
    }
});

// Submeter formulário
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formMessage = document.getElementById('form-message');
        const submitBtn = form.querySelector('.btn-save');
        const adminId = localStorage.getItem('adminId');
        
        // Verificar se está logado
        if (!adminId) {
            alert('Erro: Admin não identificado. Faça login novamente.');
            window.location.href = 'login.html';
            return;
        }
        
        // Desabilitar botão durante o envio
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
        
        // Coletar dados do formulário
        const produtoData = {
            nome: document.getElementById('nome').value.trim(),
            categoria: document.getElementById('categoria').value,
            preco: parseFloat(document.getElementById('preco').value),
            cores: document.getElementById('cores').value.trim() || null,
            descricao: document.getElementById('descricao').value.trim() || null,
            imagem: document.getElementById('imagem').value.trim() || null,
            id_admin: parseInt(adminId)
        };
        
        // Validação básica
        if (!produtoData.nome || !produtoData.categoria || !produtoData.preco) {
            formMessage.textContent = '✗ Preencha todos os campos obrigatórios (*)';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Salvar Produto';
            return;
        }
        
        console.log('Enviando produto:', produtoData);
        
        try {
            const response = await fetch(`${API_URL}/produto`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(produtoData)
            });
            
            const resultado = await response.json();
            
            if (response.ok) {
                // Sucesso
                formMessage.textContent = '✓ Produto cadastrado com sucesso!';
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
                
                // Limpar formulário
                form.reset();
                document.getElementById('image-preview').style.display = 'none';
                
                // Redirecionar após 2 segundos
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                throw new Error(resultado.mensagem || resultado.erro || 'Erro ao cadastrar produto');
            }
            
        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);
            formMessage.textContent = '✗ ' + error.message;
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            
            // Reabilitar botão
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Salvar Produto';
        }
    });
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