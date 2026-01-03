const API_URL = 'https://back-end-tf-web-main.vercel.app';
const CLOUD_NAME = 'dvpyskbet';
const UPLOAD_PRESET = 'banner_unsigned';

let bannerAtual = null;
let imagensAtuais = [];
let slideAtualPreview = 0;

/* =========================
   CARREGAR BANNER
========================= */
async function carregarBanner() {
    const loading = document.getElementById('loading');
    const bannerContent = document.getElementById('banner-content');

    try {
        const response = await fetch(`${API_URL}/banner`);
        const banners = await response.json();

        loading.style.display = 'none';
        bannerContent.style.display = 'block';

        if (banners.length > 0) {
            bannerAtual = banners[0];
            imagensAtuais = bannerAtual.imagens || [];
        } else {
            imagensAtuais = [];
        }

        exibirBanner();
    } catch {
        loading.innerHTML = '<p style="color:red">Erro ao carregar banner</p>';
    }
}

/* =========================
   EXIBIÇÃO
========================= */
function exibirBanner() {
    exibirPreview();
    exibirListaImagens();
}

function exibirPreview() {
    const container = document.getElementById('banner-preview-container');

    if (!imagensAtuais.length) {
        container.innerHTML = '<p style="color:#999">Nenhuma imagem</p>';
        return;
    }

    container.innerHTML = '';
    imagensAtuais.forEach((url, index) => {
        const img = document.createElement('img');
        img.src = url;
        img.className = 'banner-preview-img';
        img.style.display = index === slideAtualPreview ? 'block' : 'none';
        container.appendChild(img);
    });
}

function mudarSlidePreview(dir) {
    if (!imagensAtuais.length) return;
    slideAtualPreview = (slideAtualPreview + dir + imagensAtuais.length) % imagensAtuais.length;
    exibirPreview();
}

/* =========================
   LISTA
========================= */
function exibirListaImagens() {
    const list = document.getElementById('photos-list');
    const empty = document.getElementById('no-images');

    if (!imagensAtuais.length) {
        list.style.display = 'none';
        empty.style.display = 'block';
        return;
    }

    list.style.display = 'grid';
    empty.style.display = 'none';
    list.innerHTML = '';

    imagensAtuais.forEach((url, i) => {
        list.innerHTML += `
            <div class="photo-item">
                <div class="photo-thumbnail">
                    <img src="${url}">
                </div>
                <div class="photo-info">
                    <span>Imagem ${i + 1}</span>
                    <button class="btn-delete" onclick="confirmarExclusao(${i})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        `;
    });
}

/* =========================
   MODAL
========================= */
function mostrarModalAdicionar() {
    document.getElementById('modal-adicionar').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modal-adicionar').style.display = 'none';
}

/* =========================
   UPLOAD CLOUDINARY
========================= */
async function uploadParaCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method: 'POST',
            body: formData
        }
    );

    const data = await response.json();
    return data.secure_url;
}

/* =========================
   ADICIONAR IMAGEM
========================= */
document.getElementById('form-adicionar-imagem').addEventListener('submit', async e => {
    e.preventDefault();

    const file = document.getElementById('nova-imagem-file').files[0];
    const adminId = localStorage.getItem('adminId');

    if (!file || !adminId) {
        alert('Erro ao adicionar imagem');
        return;
    }

    const imageUrl = await uploadParaCloudinary(file);
    imagensAtuais.push(imageUrl);

    await salvarBanner(adminId);
    fecharModal();
});

/* =========================
   SALVAR
========================= */
async function salvarBanner(adminId) {
    const method = bannerAtual ? 'PUT' : 'POST';
    const url = bannerAtual
        ? `${API_URL}/banner/${bannerAtual.id_banner}`
        : `${API_URL}/banner`;

    const body = bannerAtual
        ? { imagens: imagensAtuais, id_admin: Number(adminId) }
        : { id_banner: 1, imagens: imagensAtuais, id_admin: Number(adminId) };

    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    alert('Banner salvo com sucesso!');
    carregarBanner();
}

/* =========================
   EXCLUIR
========================= */
function confirmarExclusao(i) {
    if (confirm('Excluir imagem?')) {
        imagensAtuais.splice(i, 1);
        salvarBanner(localStorage.getItem('adminId'));
    }
}

/* INIT */
document.addEventListener('DOMContentLoaded', carregarBanner);
