// admin/js/login.js

const API_URL = 'https://back-end-tf-web-main.vercel.app';

// Verificar se existem administradores ao carregar a página
async function verificarAdminsExistentes() {
    try {
        const response = await fetch(
            `https://api.allorigins.win/raw?url=${encodeURIComponent(API_URL + '/administrador')}`
        );
        
        if (response.ok) {
            const admins = await response.json();
            
            // Se não existir nenhum admin, mostrar botão de criar
            if (admins.length === 0) {
                document.getElementById('criar-primeiro-admin').style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Erro ao verificar admins:', error);
    }
}

// Mostrar formulário de criar admin
function mostrarFormularioCriar() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('criar-admin-form').style.display = 'block';
}

// Voltar para login
function voltarParaLogin() {
    document.getElementById('criar-admin-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('criar-error').style.display = 'none';
    document.getElementById('criar-success').style.display = 'none';
}

// Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const usuario = document.getElementById('usuario').value.trim();
    const senha = document.getElementById('senha').value;
    const errorDiv = document.getElementById('login-error');
    const submitBtn = document.querySelector('#login-form .btn-login');
    
    errorDiv.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
    
    try {
        console.log('Tentando fazer login com usuário:', usuario);
        
        const response = await fetch(
            `https://api.allorigins.win/raw?url=${encodeURIComponent(API_URL + '/administrador')}`
        );
        
        if (!response.ok) {
            throw new Error('Erro ao conectar com o servidor');
        }
        
        const admins = await response.json();
        console.log('Admins recebidos:', admins.length);
        
        const adminEncontrado = admins.find(admin => admin.usuario === usuario);
        
        if (adminEncontrado) {
            localStorage.setItem('adminLogado', 'true');
            localStorage.setItem('adminId', adminEncontrado.id_admin);
            localStorage.setItem('adminUsuario', adminEncontrado.usuario);
            
            console.log('Login realizado com sucesso!');
            window.location.href = 'index.html';
        } else {
            errorDiv.textContent = 'Usuário ou senha incorretos';
            errorDiv.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar';
        }
        
    } catch (error) {
        console.error('Erro no login:', error);
        errorDiv.textContent = 'Erro ao conectar com o servidor. Tente novamente.';
        errorDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Entrar';
    }
});

// Criar primeiro administrador
document.getElementById('criar-admin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const novoUsuario = document.getElementById('novo-usuario').value.trim();
    const novaSenha = document.getElementById('nova-senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;
    const errorDiv = document.getElementById('criar-error');
    const successDiv = document.getElementById('criar-success');
    const submitBtn = document.querySelector('#criar-admin-form .btn-login');
    
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    // Validações
    if (novoUsuario.length < 3) {
        errorDiv.textContent = 'O nome de usuário deve ter pelo menos 3 caracteres';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (novaSenha.length < 6) {
        errorDiv.textContent = 'A senha deve ter pelo menos 6 caracteres';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (novaSenha !== confirmarSenha) {
        errorDiv.textContent = 'As senhas não coincidem';
        errorDiv.style.display = 'block';
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Criando...';
    
    try {
        console.log('Criando primeiro administrador:', novoUsuario);
        
        const response = await fetch(`${API_URL}/administrador`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario: novoUsuario,
                senha: novaSenha
            })
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
            successDiv.textContent = '✓ Administrador criado com sucesso! Redirecionando...';
            successDiv.style.display = 'block';
            
            // Fazer login automático
            localStorage.setItem('adminLogado', 'true');
            localStorage.setItem('adminId', resultado.administrador.id_admin);
            localStorage.setItem('adminUsuario', resultado.administrador.usuario);
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            throw new Error(resultado.mensagem || resultado.erro || 'Erro ao criar administrador');
        }
        
    } catch (error) {
        console.error('Erro ao criar admin:', error);
        errorDiv.textContent = 'Erro: ' + error.message;
        errorDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Criar Administrador';
    }
});

// Verificar se existem admins ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    verificarAdminsExistentes();
});