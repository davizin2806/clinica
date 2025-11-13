/* Arquivo: ../templetes/dashboard_admin.js */

// Função de Logout (desconectar)
function logout() {
    localStorage.clear(); 
    alert('Você foi desconectado.');
    window.location.href = '../index.html'; // Redireciona para o login
}

// Adiciona os 'escutadores' de clique
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Botão de Sair (Logout) ---
    const btnSair = document.querySelector('.logout-button');
    if (btnSair) {
        btnSair.addEventListener('click', logout);
    }

    // --- Botão Cadastrar Paciente ---
    const btnCadPaciente = document.getElementById('btn-cadastrar-paciente');
    if (btnCadPaciente) {
        btnCadPaciente.addEventListener('click', () => {
            // Reutiliza a página que o médico já usa
            window.location.href = '../static/cadastrar_paciente.html'; 
        });
    }

    // --- Botão Cadastrar Médico ---
    const btnCadMedico = document.getElementById('btn-cadastrar-medico');
    if (btnCadMedico) {
        btnCadMedico.addEventListener('click', () => {
            // Você precisará criar esta página
            window.location.href = '../static/cadastrar_medico.html'; 
        });
    }

    // --- Botão Gerenciar Convênios ---
    const btnCadConvenio = document.getElementById('btn-gerenciar-convenios');
    if (btnCadConvenio) {
        btnCadConvenio.addEventListener('click', () => {
            // Você precisará criar esta página
            window.location.href = '../static/gerenciar_convenios.html'; 
        });
    }
});