document.addEventListener("DOMContentLoaded", () => {
<<<<<<< HEAD
    fetch(API_URL + "/api/novo_atendimento")
=======
    
    const API_URL = 'http://192.168.1.14:5000'; // ⚠️ MUDE SE O IP MUDAR
>>>>>>> 9a20be09c85f1ddcd529a29c3290926e17c278b1

    // --- 1. Seleção dos Elementos ---
    const btnBuscar = document.getElementById("btn-buscar");
    const inputBusca = document.getElementById("busca-paciente");
    const statusBusca = document.getElementById("status-busca");
    const btnSalvar = document.getElementById("salvar-atendimento");
    
    const divListaExames = document.getElementById('lista-exames-disponiveis');
    
    let pacienteEncontrado = null; // Armazena o objeto COMPLETO do paciente
    let medicoId = localStorage.getItem('medico_id'); // Pega o ID do médico logado

    // --- 2. Carregar Exames Disponíveis (da API) ---
    fetch(API_URL + '/api/exames')
        .then(response => response.json())
        .then(data => {
            divListaExames.innerHTML = ''; // Limpa "Carregando..."
            data.forEach(exame => {
                const label = document.createElement('label');
                label.innerHTML = `
                    <input type="checkbox" data-id-exame="${exame.id_exame}" data-preco-padrao="${exame.preco_padrao}"> 
                    ${exame.nome}
                    <span class="preco-exame"> (Padrão: R$ ${exame.preco_padrao.toFixed(2)})</span>
                `;
                divListaExames.appendChild(label);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar exames:', error);
            divListaExames.innerHTML = '<p style="color: red;">Erro ao carregar exames.</p>';
        });

    // --- 4. Lógica de Busca de Paciente (com API) ---
    btnBuscar.addEventListener("click", () => {
        const termo = inputBusca.value.trim(); // CPF
        if (!termo) {
             statusBusca.textContent = "Digite o CPF do paciente.";
             statusBusca.className = "status erro";
             pacienteEncontrado = null;
             return;
        }

        statusBusca.textContent = "Buscando...";
        statusBusca.className = "status";
        
        fetch(API_URL + '/api/pacientes/cpf/' + termo)
            .then(response => {
                if (!response.ok) throw new Error('Paciente não encontrado');
                return response.json();
            })
            .then(paciente => {
                pacienteEncontrado = paciente; // Salva o objeto do paciente
                statusBusca.textContent = `Paciente encontrado: ${paciente.nome}`;
                statusBusca.className = "status ok";
            })
            .catch(error => {
                pacienteEncontrado = null;
                statusBusca.textContent = "Paciente não encontrado.";
                statusBusca.className = "status erro";
            });
    });

    // --- 5. Lógica de Salvar Atendimento (com API) ---
    btnSalvar.addEventListener("click", async () => {
        const observacoes = document.getElementById("obs-atendimento").value.trim();
        
        if (!pacienteEncontrado) {
            alert("Selecione um paciente válido antes de salvar o atendimento.");
            return;
        }
        if (!medicoId) {
            alert("Erro: Médico não identificado. Faça login novamente.");
            return;
        }

        try {
            // --- 5a. Salva o Atendimento (Consulta) ---
            const dadosAtendimento = {
                id_paciente: pacienteEncontrado.id_paciente,
                id_medico: parseInt(medicoId),
                data_atendimento: new Date().toISOString(), // Data/hora atual
                observacoes: observacoes
            };

            const responseAtendimento = await fetch(API_URL + '/api/atendimentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosAtendimento)
            });

            if (!responseAtendimento.ok) {
                const erro = await responseAtendimento.json();
                throw new Error('Falha ao salvar atendimento: ' + erro.message);
            }

            // --- 5b. Salva os Exames Solicitados ---
            const examesSelecionados = document.querySelectorAll("#lista-exames-disponiveis input:checked");
            if (examesSelecionados.length > 0) {
                const promessasExames = [];
                examesSelecionados.forEach(checkbox => {
                    const dadosExame = {
                        id_paciente: pacienteEncontrado.id_paciente,
                        id_exame: parseInt(checkbox.dataset.idExame),
                        data_realizacao: new Date().toISOString()
                    };
                    
                    const promessa = fetch(API_URL + '/api/exames_realizados', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dadosExame)
                    });
                    promessasExames.push(promessa);
                });
                await Promise.all(promessasExames); // Espera todos salvarem
            }

            alert(`Atendimento e exames salvos com sucesso para o paciente ${pacienteEncontrado.nome}.`);
            window.location.href = "dashbord_medico.html";

        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar: " + error.message);
        }
    });
});