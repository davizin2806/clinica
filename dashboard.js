// Arquivo: dashboard.js (Versão Completa)

/* * Função de Logout (desconectar)
 * Limpa o 'login' salvo no navegador e volta para a tela de login.
 */
function logout() {
    localStorage.clear(); // Limpa tudo salvo (tipo_usuario, nome, etc.)
    alert('Você foi desconectado.');
    window.location.href = 'index.html'; // Redireciona para o login
}

/* * Adiciona os 'escutadores' de clique (event listeners)
 * Isso espera o HTML carregar e depois "ativa" os botões.
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // --- BOTÃO DE SAIR (LOGOUT) ---
    // Procura todos os botões com a classe 'logout-button'
    const botoesSair = document.querySelectorAll('.logout-button');
    botoesSair.forEach(botao => {
        // Remove o 'onclick' do HTML e usa este JS
        botao.removeAttribute('onclick'); 
        botao.addEventListener('click', logout); // Ativa o botão de sair
    });

    // --- BOTÃO 1: ALTERAR DADOS ---
    const btnAlterarDados = document.getElementById('btn-alterar-dados');
    if (btnAlterarDados) { 
        btnAlterarDados.addEventListener('click', function() {
            window.location.href = 'editar_paciente.html';
        });
    }

    // --- BOTÃO 2: AGENDAR CONSULTA ---
    const btnAgendarConsulta = document.getElementById('btn-agendar-consulta');
    if (btnAgendarConsulta) {
        btnAgendarConsulta.addEventListener('click', function() {
            window.location.href = 'agendar_consulta.html';
        });
    }

    // --- BOTÃO 3: VER HISTÓRICO ---
    const btnVerHistorico = document.getElementById('btn-ver-historico');
    if (btnVerHistorico) {
        btnVerHistorico.addEventListener('click', function() {
            // Redireciona para a nova página de histórico
            window.location.href = 'historico_atendimentos.html';
        });
    }
}
);