function logout() {
    localStorage.clear(); // Limpa tudo salvo (tipo_usuario, nome, etc.)
    alert('Você foi desconectado.');
    // Ajustei o caminho do login baseado na sua estrutura
    window.location.href = '../index.html'; 
}

/* * Adiciona os 'escutadores' de clique (event listeners)
 * Isso espera o HTML carregar e depois "ativa" os botões.
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // --- BOTÃO DE SAIR (LOGOUT) ---
    // Procura todos os botões com a classe 'logout-button'
    const botoesSair = document.querySelectorAll('.logout-button');
    botoesSair.forEach(botao => {
        // Remove o 'onclick' do HTML e usa este JS (boa prática)
        botao.removeAttribute('onclick'); 
        botao.addEventListener('click', logout); // Ativa o botão de sair
    });

    // --- BOTÃO NOVO ATENDIMENTO ---
    const btnNovoAtendimento = document.getElementById('btn-novo-atendimento');
    if (btnNovoAtendimento) { 
        btnNovoAtendimento.addEventListener('click', function() {
            // Navega para a página (assumindo que está em /static/)
            window.location.href = '../static/novo_atendimento.html';
        });
    }

    // --- BOTÃO CADASTRAR PACIENTE ---
    const btnCadastrarPaciente = document.getElementById('btn-cadastrar-paciente');
    if (btnCadastrarPaciente) {
        btnCadastrarPaciente.addEventListener('click', function() {
            // Navega para a página (assumindo que está em /static/)
            window.location.href = '../static/cadastrar_paciente.html';
       });
    } // Faltou um '}' aqui no seu código original

    // --- BOTÃO HISTÓRICO DO MÉDICO ---
    const btnHistoricoMedico = document.getElementById('btn-historico-medico');
    if (btnHistoricoMedico) {
        btnHistoricoMedico.addEventListener('click', function() {
            // Navega para a página (assumindo que está em /static/)
            window.location.href = '../static/historico_medico.html';
        });
    }
}); // Faltou um ')' aqui no seu código original