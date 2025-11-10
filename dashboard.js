// Arquivo: dashboard.js

/* * Função de Logout (funciona 100% agora)
 * Limpa o 'login' salvo no navegador e volta para a tela de login.
 */
function logout() {
    // Limpa o 'tipo_usuario' que salvamos no localStorage durante o login
    localStorage.removeItem('tipo_usuario');
    localStorage.removeItem('nome_usuario');
    // Você pode usar localStorage.clear(); para limpar tudo
    
    alert('Você foi desconectado.');
    window.location.href = 'index.html'; // Redireciona para o login
}

/* * Adiciona os 'escutadores' de clique aos botões
 * Isso espera o HTML carregar e depois "ativa" os botões.
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // --- BOTÕES COMUNS (presentes nas duas telas) ---
    
    const botoesSair = document.querySelectorAll('.logout-button');
    botoesSair.forEach(botao => {
        // Quando qualquer botão com a classe 'logout-button' for clicado, chama a função logout()
        botao.addEventListener('click', logout);
    });

    // --- BOTÕES ESPECÍFICOS ---

    // 1. Botão do Paciente: Alterar Dados
    const btnAlterarDados = document.getElementById('btn-alterar-dados');
    if (btnAlterarDados) { // Só executa se o botão existir na página
        btnAlterarDados.addEventListener('click', function() {
            //alert('Navegando para a página de edição de dados...');
            window.location.href = 'editar_paciente.html';
        });
    }

    // 2. Botão do Médico: Novo Atendimento
    const btnNovoAtendimento = document.getElementById('btn-novo-atendimento');
    if (btnNovoAtendimento) { // Só executa se o botão existir na página
        btnNovoAtendimento.addEventListener('click', function() {
            //alert('Navegando para a tela de novo atendimento...');
            window.location.href = 'novo_atendimento.html';
        });
    }

    // 3. Botão do Paciente: Agendar Nova Consulta
    const btnAgendarConsulta = document.getElementById('btn-agendar-consulta');
    if (btnAgendarConsulta) { // Só executa se o botão existir na página
        btnAgendarConsulta.addEventListener('click', function() {
            window.location.href = 'agendar_consulta.html';
        });
    }
});