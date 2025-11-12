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

    const btnNovoAtendimento = document.getElementById('btn-novo-atendimento');
    if (btnNovoAtendimento) { 
        btnNovoAtendimento.addEventListener('click', function() {
            window.location.href = 'novo_atendimento.html';
        });
    }

    const btnCadastrarPaciente = document.getElementById('btn-cadastrar-paciente');
    if (btnCadastrarPaciente) {
        btnCadastrarPaciente.addEventListener('click', function() {
            window.location.href = 'cadastrar_paciente.html';
    });

    const btnHistoricoMedico = document.getElementById('btn-historico-medico');
    if (btnHistoricoMedico) {
        btnHistoricoMedico.addEventListener('click', function() {
            window.location.href = 'historico_medico.html';
        });
    }
}

});