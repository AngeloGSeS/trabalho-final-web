// admin/js/cadastrar-admin.js

const API_URL = 'https://back-end-tf-web-main.vercel.app';

// Carregar lista de administradores
async function carregarAdmins() {
    const loadingAdmins = document.getElementById('loading-admins');
    const adminsList = document.getElementById('admins-list');
    const noAdmins = document.getElementById('no-admins');
    
    try {
        console.log('Carregando administradores...');
        
        const response = await fetch(
            `https://api.allorigins.win/raw?url=${encodeURIComponent(API_URL + '/administrador')}`
        );
        
        if (!response.ok) {
            throw new Error('Erro ao carregar administradores');
        }
        
        const admins = await response.json();
        console.log('Administradores carregados:', admins);
        
        loadingAdmins.style.display = 'none';
        
        if (admins.length > 0) {
            adminsList.style.display = 'block';
            exibirAdmins(admins);
        } else {
            noAdmins.style.display = 'block';
        }
        
    } catch (error) {
        console.error('Erro ao carregar administradores:', error);
        loadingAdmins.innerHTML = '<p style="color: red;">Erro ao carregar administradores</p>';
    }
}

// Exibir lista de administradores
function exibirAdmins(admins) {
    const tbody = document.getElementById('admins-tbody');
    tbody.innerHTML = '';
    
    const adminAtualId = parseInt(localStorage.getItem('adminId'));
    
    admins.forEach(admin => {
        const tr = document.createElement('tr');
        
        // Não permite excluir o próprio admin logado
        const isCurrentAdmin = admin.id_admin === adminAtualId;
        
        tr.innerHTML = `
            <td>${admin.id_admin}</td>
            <td>
                <i class="fas fa-user-shield"></i> ${admin.usuario}
                ${isCurrentAdmin ? '<span style="color: #28a745; margin-left: 10px;">(Você)</span>' : ''}
            </td>
            <td>
                ${!isCurrentAdmin ? 
                    `<button onclick="confirmarExclusaoAdmin(${admin.id_admin}, '${admin.usuario.replace(/'/g, "\\'")}')" class="btn-delete" title="Excluir">
                        <i class="fas fa-trash"></i> Excluir
                    </button>` 
                    : 
                    '<span style="color: #999;">-</span>'
                }
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Confirmar exclusão de admin
function confirmarExclusaoAdmin(id, usuario) {
    if (confirm(`Deseja realmente excluir o administrador "${usuario}"?\n\nEsta ação não pode ser desfeita.`)) {
        excluirAdmin(id);
    }
}

// Excluir administrador
async function excluirAdmin(id) {
    try {
        console.log('Excluindo admin ID:', id);
        
        const response = await fetch(`${API_URL}/administrador/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('✓ Administrador excluído com sucesso!');
            // Recarregar lista
            carregarAdmins();
        } else {
            const erro = await response.json();
            throw new Error(erro.mensagem || 'Erro ao excluir administrador');
        }
        
    } catch (error) {
        console.error('Erro ao excluir:', error);
        alert('✗ Erro ao excluir administrador: ' + error.message);
    }
}

// Cadastrar novo administrador
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('admin-form');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formMessage = document.getElementById('form-message');
        const submitBtn = form.querySelector('.btn-save');
        
        const usuario = document.getElementById('usuario').value.trim();
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;
        
        // Validações
        if (usuario.length < 3) {
            formMessage.textContent = '✗ O nome de usuário deve ter pelo menos 3 caracteres';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            return;
        }
        
        if (senha.length < 6) {
            formMessage.textContent = '✗ A senha deve ter pelo menos 6 caracteres';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            return;
        }
        
        if (senha !== confirmarSenha) {
            formMessage.textContent = '✗ As senhas não coincidem';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            return;
        }
        
        // Desabilitar botão
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';
        
        const adminData = {
            usuario: usuario,
            senha: senha
        };
        
        console.log('Cadastrando administrador:', adminData.usuario);
        
        try {
            const response = await fetch(`${API_URL}/administrador`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adminData)
            });
            
            const resultado = await response.json();
            
            if (response.ok) {
                formMessage.textContent = '✓ Administrador cadastrado com sucesso!';
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
                
                // Limpar formulário
                form.reset();
                
                // Recarregar lista de admins
                carregarAdmins();
                
                // Esconder mensagem após 3 segundos
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 3000);
            } else {
                throw new Error(resultado.mensagem || resultado.erro || 'Erro ao cadastrar administrador');
            }
            
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            formMessage.textContent = '✗ ' + error.message;
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
        } finally {
            // Reabilitar botão
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Cadastrar Administrador';
        }
    });
});

// Carregar lista ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    carregarAdmins();
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