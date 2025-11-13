// Use 127.0.0.1 para evitar erros se o IP da rede mudar
const API_URL = 'http://172.20.14.138:5000'; 

document.addEventListener('DOMContentLoaded', function() {
    console.log("Iniciando carregamento de especialidades...");

    fetch(API_URL + '/api/especialidades')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta da API: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log("Especialidades recebidas:", data);
            
            const selectEspecialidade = document.getElementById('especialidade');
            
            // Limpa o "Carregando..." e adiciona a opção padrão
            selectEspecialidade.innerHTML = '<option value="">Selecione uma especialidade</option>';

            data.forEach(esp => {
                const option = document.createElement('option');
                
                // CORREÇÃO CRÍTICA:
                // Tenta pegar o ID e o Nome independente se vier Maiúsculo ou Minúsculo do SQL Server
                const id = esp.id_especialidade;
                const nome = esp.nome;

                if (id && nome) {
                    option.value = id;
                    option.textContent = nome;
                    selectEspecialidade.appendChild(option);
                } else {
                    console.warn("Item incompleto recebido:", esp);
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar especialidades:', error);
            const select = document.getElementById('especialidade');
            select.innerHTML = '<option value="">Erro ao carregar lista</option>';
        });
});

document.getElementById('formCadastrarMedico').addEventListener('submit', function(event) {
    event.preventDefault();

    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar_senha').value;
    
    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    // Captura os dados
    const dados = {
        email: document.getElementById('email').value,
        senha: senha,
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        // CORREÇÃO: Agora busca pelo ID correto 'crm'
        crm: document.getElementById('crm').value,
        telefone: document.getElementById('telefone').value,
        id_especialidade: document.getElementById('especialidade').value,
        logradouro: document.getElementById('logradouro').value,
        numero: document.getElementById('numero').value,
        complemento: document.getElementById('complemento').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        cep: document.getElementById('cep').value
    };

    console.log("Enviando dados:", dados);

    fetch(API_URL + '/api/cadastrar_medico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        if (status === 201) {
            alert('Sucesso: ' + body.message);
            document.getElementById('formCadastrarMedico').reset();
            window.location.href = 'dashboard_admin.html';
        } else {
            alert('Erro: ' + body.message);
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        alert('Erro ao conectar com o servidor.');
    });
});