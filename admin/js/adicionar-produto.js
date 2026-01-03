const API_URL = 'https://back-end-tf-web-main.vercel.app';
const CLOUD_NAME = 'dvpyskbet';
const UPLOAD_PRESET = 'produto_unsigned';

let imagemUrlFinal = null;

/* =========================
   PREVIEW DA IMAGEM
========================= */
document.addEventListener('DOMContentLoaded', () => {
  const imagemInput = document.getElementById('imagem');
  const preview = document.getElementById('image-preview');
  const previewImg = document.getElementById('preview-img');

  imagemInput.addEventListener('change', () => {
    const file = imagemInput.files[0];
    if (!file) return;

    previewImg.src = URL.createObjectURL(file);
    preview.style.display = 'block';
  });
});

/* =========================
   SUBMIT DO FORM
========================= */
document.getElementById('product-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formMessage = document.getElementById('form-message');
  const submitBtn = document.querySelector('.btn-save');
  const adminId = localStorage.getItem('adminId');

  if (!adminId) {
    alert('Admin não autenticado');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';

  try {
    /* =========================
       1️⃣ UPLOAD NO CLOUDINARY
    ========================= */
    const fileInput = document.getElementById('imagem');
    const file = fileInput.files[0];

    if (!file) throw new Error('Selecione uma imagem');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    const cloudinaryData = await cloudinaryResponse.json();

    if (!cloudinaryData.secure_url) {
      throw new Error('Erro ao enviar imagem');
    }

    imagemUrlFinal = cloudinaryData.secure_url;

    /* =========================
       2️⃣ SALVAR PRODUTO
    ========================= */
    const produtoData = {
      nome: document.getElementById('nome').value.trim(),
      categoria: document.getElementById('categoria').value,
      preco: parseFloat(document.getElementById('preco').value),
      cores: document.getElementById('cores').value.trim() || null,
      descricao: document.getElementById('descricao').value.trim() || null,
      imagem: imagemUrlFinal,
      id_admin: parseInt(adminId)
    };

    const response = await fetch(`${API_URL}/produto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produtoData)
    });

    if (!response.ok) {
      throw new Error('Erro ao salvar produto');
    }

    formMessage.textContent = '✓ Produto cadastrado com sucesso!';
    formMessage.className = 'form-message success';
    formMessage.style.display = 'block';

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);

  } catch (err) {
    formMessage.textContent = '✗ ' + err.message;
    formMessage.className = 'form-message error';
    formMessage.style.display = 'block';

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Salvar Produto';
  }
});

/* =========================
   SAIR
========================= */
function sair() {
  if (confirm('Deseja sair?')) {
    localStorage.clear();
    window.location.href = 'login.html';
  }
}
