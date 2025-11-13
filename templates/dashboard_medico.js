
const API_URL = 'http://192.168.1.14:5000'; // ⚠️ MUDE SE O IP MUDAR
        let todosPacientes = []; // Cache para o filtro

        document.addEventListener('DOMContentLoaded', function() {
            
            const medicoNome = localStorage.getItem('usuario_nome');
            if(medicoNome) {
                document.getElementById('nomeMedico').textContent = medicoNome;
            } else {
                 document.getElementById('nomeMedico').textContent = 'Doutor(a)';
            }
            
            // --- 1. Carregar Resumo de Atendimentos ---
            const containerAgenda = document.getElementById('lista-atendimentos-medico');
            fetch(API_URL + '/api/relatorios/atendimentos_medico')
                .then(response => response.json())
                .then(data => {
                    containerAgenda.innerHTML = '';
                    if (data.length === 0) {
                        containerAgenda.innerHTML = '<p>Nenhum atendimento registrado no sistema.</p>';
                        return;
                    }
                    data.forEach(atendimento => {
                        const card = document.createElement('div');
                        card.className = 'card';
                        card.innerHTML = `
                            <strong>Médico:</strong> ${atendimento.NomeMedico}<br>
                            <strong>Especialidade:</strong> ${atendimento.Especialidade}<br>
                            <strong>Total de Atendimentos:</strong> ${atendimento.TotalAtendimentos}
                        `;
                        containerAgenda.appendChild(card);
                    });
                })
                .catch(error => {
                    console.error('Erro ao carregar agenda:', error);
                    containerAgenda.innerHTML = '<p>Erro ao carregar agenda.</p>';
                });

            // --- 2. Carregar Lista de Pacientes ---
            const containerPacientes = document.getElementById('lista-pacientes');
            fetch(API_URL + '/api/pacientes')
                .then(response => response.json())
                .then(data => {
                    todosPacientes = data; // Salva no cache
                    renderPacientes(data); // Exibe todos
                })
                .catch(error => {
                    console.error('Erro ao carregar pacientes:', error);
                    containerPacientes.innerHTML = '<p>Erro ao carregar pacientes.</p>';
                });

            // --- 3. Lógica do Filtro de Pacientes ---
            document.getElementById('filtroPacientes').addEventListener('input', function(e) {
                const termo = e.target.value.toLowerCase();
                if (!termo) {
                    renderPacientes(todosPacientes);
                    return;
                }
                const pacientesFiltrados = todosPacientes.filter(p => 
                    p.nome.toLowerCase().includes(termo) ||
                    p.cpf.includes(termo)
                );
                renderPacientes(pacientesFiltrados);
            });
        });

        function renderPacientes(pacientes) {
            const containerPacientes = document.getElementById('lista-pacientes');
            containerPacientes.innerHTML = '';
            if (pacientes.length === 0) {
                containerPacientes.innerHTML = '<p>Nenhum paciente encontrado.</p>';
                return;
            }
            pacientes.forEach(paciente => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <strong>Nome:</strong> ${paciente.nome}<br>
                    <strong>CPF:</strong> ${paciente.cpf}
                `;
                containerPacientes.appendChild(card);
            });
        }

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
});