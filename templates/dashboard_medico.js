<<<<<<< HEAD
fetch(API_URL + "/api/dashbord_medico")
=======
// templates/dashboard_medico.js

// ⚠️ MUDE AQUI SE O IP MUDAR
const API_URL = 'http://192.168.1.14:5000'; 
>>>>>>> 9a20be09c85f1ddcd529a29c3290926e17c278b1
let todosPacientes = []; // Cache para o filtro

/*Função de Logout (desconectar)*/
function logout() {
    localStorage.clear(); // Limpa tudo salvo
    alert('Você foi desconectado.');
    window.location.href = '../index.html'; // Redireciona para o login
}

/**
 * Função para renderizar a lista de pacientes (usada pela Carga e pelo Filtro)
 */
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

/**
 * Adiciona os 'escutadores' de clique (event listeners)
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. CARREGAR DADOS DO DASHBOARD ---
    
    const medicoNome = localStorage.getItem('usuario_nome');
    if (medicoNome) {
        document.getElementById('nomeMedico').textContent = medicoNome;
    } else {
         document.getElementById('nomeMedico').textContent = 'Doutor(a)';
    }
    
    // --- 1a. Carregar Resumo de Atendimentos ---
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

    // --- 1b. Carregar Lista de Pacientes ---
    fetch(API_URL + '/api/pacientes')
        .then(response => response.json())
        .then(data => {
            todosPacientes = data; // Salva no cache
            renderPacientes(data); // Exibe todos
        })
        .catch(error => {
            console.error('Erro ao carregar pacientes:', error);
            document.getElementById('lista-pacientes').innerHTML = '<p>Erro ao carregar pacientes.</p>';
        });

    // --- 1c. Lógica do Filtro de Pacientes ---
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

    // --- 2. CONFIGURAR BOTÕES DE NAVEGAÇÃO ---
    
    // --- Botão de Sair (Logout) ---
    const botoesSair = document.querySelectorAll('.logout-button');
    botoesSair.forEach(botao => {
        botao.addEventListener('click', logout);
    });

    // --- Botão Novo Atendimento ---
    const btnNovoAtendimento = document.getElementById('btn-novo-atendimento');
    if (btnNovoAtendimento) { 
        btnNovoAtendimento.addEventListener('click', function() {
            window.location.href = '../static/novo_atendimento.html';
        });
    }

    // --- Botão Cadastrar Paciente ---
    const btnCadastrarPaciente = document.getElementById('btn-cadastrar-paciente');
    if (btnCadastrarPaciente) {
        btnCadastrarPaciente.addEventListener('click', function() {
            window.location.href = '../static/cadastrar_paciente.html';
        });
    }

    // --- Botão Histórico do Médico ---
    const btnHistoricoMedico = document.getElementById('btn-historico-medico');
    if (btnHistoricoMedico) {
        btnHistoricoMedico.addEventListener('click', function() {
            window.location.href = '../static/historico_medico.html';
        });
    }
});