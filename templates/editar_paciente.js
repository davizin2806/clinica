const API_URL = 'http://172.20.14.138:5000'; // ⚠️ MUDE SE O IP MUDAR

        const pacienteId = localStorage.getItem('paciente_id');
        if (!pacienteId) {
            alert('Paciente não identificado!');
            window.location.href = '../index.html';
        }

        // --- Carregar Dados (GET) ---
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('formEditarPaciente');
            const loadingMessage = document.getElementById('loadingMessage');

            // 1. Carregar Convênios (para o dropdown)
            const selectConvenio = document.getElementById('convenio');
            const conveniosPromise = fetch(API_URL + '/api/convenios')
                .then(response => response.json())
                .then(convenios => {
                    convenios.forEach(convenio => {
                        const option = document.createElement('option');
                        option.value = convenio.id_convenio;
                        option.textContent = convenio.nome;
                        selectConvenio.appendChild(option);
                    });
                });

// 2. Carregar dados DO PACIENTE
            const pacientePromise = fetch(API_URL + '/api/pacientes/' + pacienteId)
                .then(response => response.json())
                .then(data => {
                    // ... (código de id, nome, cpf, etc.) ...
                    
                    // --- CORREÇÃO DA DATA DE NASCIMENTO ---
                    // 1. Cria um objeto Date a partir da string longa
                    const dateObj = new Date(data.data_nascimento);
                    // 2. Formata para YYYY-MM-DD
                    const year = dateObj.getFullYear();
                    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // +1 pois getMonth() é 0-11
                    const day = dateObj.getDate().toString().padStart(2, '0');
                    // 3. Define o valor no formato correto
                    document.getElementById('data_nascimento').value = `${year}-${month}-${day}`;
                    
                    document.getElementById('telefone').value = data.telefone;
                    document.getElementById('email').value = data.email;
                    return data; 
                });

            // 3. Espera ambos carregarem para setar o convênio
            Promise.all([conveniosPromise, pacientePromise])
                .then(([convenios, pacienteData]) => {
                    document.getElementById('convenio').value = pacienteData.id_convenio || "";
                    loadingMessage.style.display = 'none'; // Esconde "Carregando..."
                })
                .catch(error => {
                    console.error('Erro ao carregar dados:', error);
                    loadingMessage.textContent = 'Erro ao carregar dados.';
                });
        });

        // --- Salvar Alterações (PUT) ---
        document.getElementById('formEditarPaciente').addEventListener('submit', function(event) {
            event.preventDefault();
            
            const dadosParaEnviar = {
                id_endereco: document.getElementById('id_endereco').value,
                nome: document.getElementById('nome').value,
                cpf: document.getElementById('cpf').value,
                data_nascimento: document.getElementById('data_nascimento').value,
                telefone: document.getElementById('telefone').value,
                email: document.getElementById('email').value,
                id_convenio: document.getElementById('convenio').value,
                logradouro: document.getElementById('logradouro').value,
                numero: document.getElementById('numero').value,
                complemento: document.getElementById('complemento').value,
                bairro: document.getElementById('bairro').value,
                cidade: document.getElementById('cidade').value,
                estado: document.getElementById('estado').value,
                cep: document.getElementById('cep').value
            };

            fetch(API_URL + '/api/pacientes/' + pacienteId, {
                method: 'PUT',
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
                alert('Erro ao salvar. Verifique o console.');
            });
        });