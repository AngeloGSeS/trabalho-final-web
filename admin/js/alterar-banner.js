// admin/js/alterar-banner.js

const API_URL = 'https://back-end-tf-web-main.vercel.app';

let bannerAtual = null;
let imagensAtuais = [];
let slideAtualPreview = 0;

// Carregar banner atual
async function carregarBanner() {
    const loading = document.getElementById('loading');
    const bannerContent = document.getElementById('banner-content');
    
    try {
        console.log('Carregando banner...');
        
        const response = await fetch(
            `https://api.allorigins.win/raw?url=${encodeURIComponent(API_URL + '/banner')}`
        );
        
        if (!response.ok) {
            throw new Error('Erro ao carregar banner');
        }
        
        const banners = await response.json();
        console.log('Banners recebidos:', banners);
        
        loading.style.display = 'none';
        bannerContent.style.display = 'block';
        
        if (banners.length > 0) {
            bannerAtual = banners[0];
            imagensAtuais = bannerAtual.imagens || [];
            exibirBanner();
        } else {
            // Criar banner vazio se não existir
            imagensAtuais = [];
            exibirBanner();
        }
        
    } catch (error) {
        console.error('Erro ao carregar banner:', error);
        loading.innerHTML = `
            <p style="color: red;">
                <i class="fas fa-exclamation-triangle"></i>
                Erro ao carregar banner. Tente novamente.
            </p>
        `;
    }
}

// Exibir imagens do banner
function exibirBanner() {
    exibirPreview();
    exibirListaImagens();
}

// Exibir preview do banner
function exibirPreview() {
    const previewContainer = document.getElementById('banner-preview-container');
    
    if (imagensAtuais.length === 0) {
        previewContainer.innerHTML = '<p style="text-align: center; color: #999;">Nenhuma imagem no banner</p>';
        return;
    }
    
    previewContainer.innerHTML = '';
    
    imagensAtuais.forEach((imagem, index) => {
        const img = document.createElement('img');
        img.src = imagem.startsWith('http') || imagem.startsWith('data:') ? imagem : `data:image/jpeg;base64,${imagem}`;
        img.alt = `Banner ${index + 1}`;
        img.className = 'banner-preview-img';
        img.style.display = index === slideAtualPreview ? 'block' : 'none';
        previewContainer.appendChild(img);
    });
}

// Mudar slide do preview
function mudarSlidePreview(direcao) {
    if (imagensAtuais.length === 0) return;
    
    slideAtualPreview += direcao;
    
    if (slideAtualPreview >= imagensAtuais.length) slideAtualPreview = 0;
    if (slideAtualPreview < 0) slideAtualPreview = imagensAtuais.length - 1;
    
    exibirPreview();
}

// Exibir lista de imagens
function exibirListaImagens() {
    const photosList = document.getElementById('photos-list');
    const noImages = document.getElementById('no-images');
    
    if (imagensAtuais.length === 0) {
        photosList.style.display = 'none';
        noImages.style.display = 'block';
        return;
    }
    
    photosList.style.display = 'grid';
    noImages.style.display = 'none';
    photosList.innerHTML = '';
    
    imagensAtuais.forEach((imagem, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        
        const imgSrc = imagem.startsWith('http') || imagem.startsWith('data:') ? imagem : `data:image/jpeg;base64,${imagem}`;
        
        photoItem.innerHTML = `
            <div class="photo-thumbnail">
                <img src="${imgSrc}" alt="Imagem ${index + 1}">
            </div>
            <div class="photo-info">
                <span>Imagem ${index + 1}</span>
                <button class="btn-delete" onclick="confirmarExclusao(${index})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        `;
        
        photosList.appendChild(photoItem);
    });
}

// Mostrar modal de adicionar
function mostrarModalAdicionar() {
    document.getElementById('modal-adicionar').style.display = 'flex';
    document.getElementById('nova-imagem-url').value = '';
    document.getElementById('preview-nova-imagem').innerHTML = '<p style="color: #999;">Cole uma URL para ver o preview</p>';
}

// Fechar modal
function fecharModal() {
    document.getElementById('modal-adicionar').style.display = 'none';
}

// Preview da nova imagem
document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('nova-imagem-url');
    
    if (urlInput) {
        urlInput.addEventListener('input', (e) => {
            const url = e.target.value;
            const previewDiv = document.getElementById('preview-nova-imagem');
            
            if (url) {
                previewDiv.innerHTML = `<img src="${url}" alt="Preview" style="max-width: 100%; max-height: 300px; border-radius: 5px;" onerror="this.parentElement.innerHTML='<p style=color:red>Erro ao carregar imagem. Verifique a URL.</p>'">`;
            } else {
                previewDiv.innerHTML = '<p style="color: #999;">Cole uma URL para ver o preview</p>';
            }
        });
    }
});

// Adicionar imagem
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-adicionar-imagem');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const novaImagemUrl = document.getElementById('nova-imagem-url').value;
        const adminId = localStorage.getItem('adminId');
        
        if (!adminId) {
            alert('Erro: Admin não identificado. Faça login novamente.');
            window.location.href = 'login.html';
            return;
        }
        
        // Adicionar imagem ao array
        imagensAtuais.push(novaImagemUrl);
        
        // Atualizar banner na API
        await salvarBanner(adminId);
        
        fecharModal();
    });
});

// Confirmar exclusão
function confirmarExclusao(index) {
    if (confirm(`Deseja realmente excluir a Imagem ${index + 1}?`)) {
        excluirImagem(index);
    }
}

// Excluir imagem
async function excluirImagem(index) {
    const adminId = localStorage.getItem('adminId');
    
    if (!adminId) {
        alert('Erro: Admin não identificado.');
        return;
    }
    
    // Remover imagem do array
    imagensAtuais.splice(index, 1);
    
    // Ajustar slide do preview se necessário
    if (slideAtualPreview >= imagensAtuais.length) {
        slideAtualPreview = Math.max(0, imagensAtuais.length - 1);
    }
    
    // Atualizar banner na API
    await salvarBanner(adminId);
}

// Salvar banner na API
async function salvarBanner(adminId) {
    try {
        let response;
        
        if (bannerAtual && bannerAtual.id_banner) {
            // Atualizar banner existente (PUT)
            console.log('Atualizando banner ID:', bannerAtual.id_banner);
            
            response = await fetch(`${API_URL}/banner/${bannerAtual.id_banner}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imagens: imagensAtuais,
                    id_admin: parseInt(adminId)
                })
            });
        } else {
            // Criar novo banner (POST)
            console.log('Criando novo banner');
            
            response = await fetch(`${API_URL}/banner`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_banner: 1, // ID fixo para o banner principal
                    imagens: imagensAtuais,
                    id_admin: parseInt(adminId)
                })
            });
        }
        
        const resultado = await response.json();
        
        if (response.ok) {
            alert('✓ Banner atualizado com sucesso!');
            // Recarregar banner
            await carregarBanner();
        } else {
            throw new Error(resultado.mensagem || 'Erro ao salvar banner');
        }
        
    } catch (error) {
        console.error('Erro ao salvar banner:', error);
        alert('✗ Erro ao salvar banner: ' + error.message);
    }
}

// Função de sair
function sair() {
    if (confirm('Deseja realmente sair?')) {
        localStorage.removeItem('adminLogado');
        localStorage.removeItem('adminId');
        localStorage.removeItem('adminUsuario');
        window.location.href = 'login.html';
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    carregarBanner();
});