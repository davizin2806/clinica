fetch(API_URL + "/api/agendar_consulta")
        let medicosData = []; // Cache de médicos

        document.addEventListener('DOMContentLoaded', function() {
            const selectEspecialidade = document.getElementById('especialidade');
            const selectMedico = document.getElementById('medico');

            // 1. Carregar Especialidades
            fetch(API_URL + '/api/especialidades')
                .then(response => response.json())
                .then(data => {
                    data.forEach(esp => {
                        const option = document.createElement('option');
                        option.value = esp.id_especialidade;
                        option.textContent = esp.nome;
                        selectEspecialidade.appendChild(option);
                    });
                })
                .catch(error => console.error('Erro ao carregar especialidades:', error));
            
            // 2. Carregar TODOS os Médicos (para filtrar depois)
            fetch(API_URL + '/api/medicos')
                .then(response => response.json())
                .then(data => {
                    medicosData = data; // Salva a lista de médicos
                })
                .catch(error => console.error('Erro ao carregar médicos:', error));

            // 3. Adicionar lógica de filtro
            selectEspecialidade.addEventListener('change', function() {
                selectMedico.innerHTML = '<option value="">Escolha o médico...</option>';
                const especialidadeId = parseInt(this.value);
                if (!especialidadeId) return;
                
                const medicosFiltrados = medicosData.filter(med => med.id_especialidade === especialidadeId);
                
                medicosFiltrados.forEach(med => {
                    const option = document.createElement('option');
                    option.value = med.id_medico;
                    option.textContent = med.nome;
                    selectMedico.appendChild(option);
                });
            });
        });

        // --- Enviar Formulário (POST) ---
        document.getElementById('formAgendarConsulta').addEventListener('submit', function(event) {
            event.preventDefault();

            const pacienteId = localStorage.getItem('paciente_id');
            if (!pacienteId) {
                alert('Erro: Paciente não identificado. Faça o login novamente.');
                return;
            }

            const dadosParaEnviar = {
                id_paciente: parseInt(pacienteId),
                id_medico: document.getElementById('medico').value,
                data_atendimento: document.getElementById('data_desejada').value,
                observacoes: document.getElementById('motivo').value
            };

            fetch(API_URL + '/api/atendimentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosParaEnviar)
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.message.includes("sucesso")) {
                    window.location.href = 'dashbord_paciente.html';
                }
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
                alert('Erro ao agendar. Verifique o console.');
            });
        });