// admin/js/admin-check.js
// Este script verifica se o admin está logado

function verificarLogin() {
    const adminLogado = localStorage.getItem('adminLogado');
    const adminUsuario = localStorage.getItem('adminUsuario');
    
    // Se não estiver logado, redireciona para login
    if (!adminLogado || adminLogado !== 'true') {
        window.location.href = 'login.html';
        return false;
    }
    
    // Atualiza nome do admin no header (se existir)
    const adminNomeEl = document.getElementById('admin-nome');
    if (adminNomeEl && adminUsuario) {
        adminNomeEl.textContent = adminUsuario;
    }
    
    return true;
}

function sair() {
    if (confirm('Deseja realmente sair?')) {
        localStorage.removeItem('adminLogado');
        localStorage.removeItem('adminId');
        localStorage.removeItem('adminUsuario');
        window.location.href = 'login.html';
    }
}

// Verificar login ao carregar páginas admin (exceto login.html)
document.addEventListener('DOMContentLoaded', () => {
    const isLoginPage = window.location.pathname.includes('login.html');
    
    if (!isLoginPage && window.location.pathname.includes('/admin/')) {
        verificarLogin();
    }
});