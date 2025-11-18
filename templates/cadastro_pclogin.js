        // --- Carregar Convênios no Dropdown ---
        document.addEventListener('DOMContentLoaded', function() {
            fetch(API_URL + '/api/convenios')
                .then(response => response.json())
                .then(data => {
                    const selectConvenio = document.getElementById('convenio');
                    data.forEach(convenio => {
                        const option = document.createElement('option');
                        option.value = convenio.id_convenio;
                        option.textContent = convenio.nome;
                        selectConvenio.appendChild(option);
                    });
                })
                .catch(error => console.error('Erro ao carregar convenios:', error));
        });

        // --- Enviar Formulário (POST) ---
        document.getElementById('formCadastrarPaciente').addEventListener('submit', function(event) {
            event.preventDefault();

            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmar_senha').value;
            
            if (senha !== confirmarSenha) {
                alert('As senhas não coincidem!');
                return;
            }

            const dadosParaEnviar = {
                // Login
                email: document.getElementById('email').value,
                senha: senha,
                // Paciente
                nome: document.getElementById('nome').value,
                cpf: document.getElementById('cpf').value,
                data_nascimento: document.getElementById('data_nascimento').value,
                telefone: document.getElementById('telefone').value,
                id_convenio: document.getElementById('convenio').value,
                // Endereço
                logradouro: document.getElementById('logradouro').value,
                numero: document.getElementById('numero').value,
                complemento: document.getElementById('complemento').value,
                bairro: document.getElementById('bairro').value,
                cidade: document.getElementById('cidade').value,
                estado: document.getElementById('estado').value,
                cep: document.getElementById('cep').value
            };

            fetch(API_URL + '/api/cadastrar_paciente', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosParaEnviar)
            })
            .then(response => response.json().then(data => ({ status: response.status, body: data })))
            .then(({ status, body }) => {
                alert(body.message); 
                
                if (status === 201) {
                    event.target.reset(); // Limpa o formulário
                    
                    // Verifica quem está logado no localStorage
                    const tipoUsuarioLogado = localStorage.getItem('tipo_usuario');
                    
                    if (tipoUsuarioLogado === 'ADMIN') {
                        // Se for Admin, volta para o dashboard de admin
                        window.location.href = 'dashboard_admin.html';
                    } else {
                        // Caso contrário, volta para o dashboard do médico (padrão)
                        window.location.href = 'dashbord_medico.html'; 
                    }
                }
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
                alert('Erro ao conectar com o servidor. Verifique o console.');
            });
        });