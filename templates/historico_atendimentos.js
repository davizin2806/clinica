        document.addEventListener('DOMContentLoaded', function() {
            fetch(API_URL + "/api/historico_atendimentos")

            
            const pacienteId = localStorage.getItem('paciente_id');
            if (!pacienteId) {
                alert('Erro: Paciente não identificado.');
                window.location.href = '../index.html';
                return;
            }

            // --- Buscar Histórico de Atendimentos ---
            const containerAtendimentos = document.getElementById('lista-historico');
            fetch(API_URL + '/api/relatorios/ficha_atendimentos/' + pacienteId)
                .then(response => response.json())
                .then(data => {
                    containerAtendimentos.innerHTML = '';
                    if (data.length === 0) {
                        containerAtendimentos.innerHTML = '<p>Nenhum atendimento no histórico.</p>';
                        return;
                    }
                    
                    data.forEach(atendimento => {
                        const card = document.createElement('div');
                        card.className = 'card-paciente'; // Reutilizando classe
                        const dataFormatada = new Date(atendimento.data_atendimento).toLocaleString('pt-BR');
                        
                        card.innerHTML = `
                            <strong>Data:</strong> ${dataFormatada}<br>
                            <strong>Médico:</strong> ${atendimento.NomeMedico} [${atendimento.Especialidade}]<br>
                            <strong>Observações:</strong> ${atendimento.observacoes}
                        `;
                        containerAtendimentos.appendChild(card);
                    });
                })
                .catch(error => {
                    console.error('Erro ao buscar histórico:', error);
                    containerAtendimentos.innerHTML = '<p>Erro ao carregar histórico.</p>';
                });
        });