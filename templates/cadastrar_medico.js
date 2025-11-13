
const API_URL = 'http://192.168.1.14:5000'; // altere conforme o IP do servidor Flask

document.addEventListener('DOMContentLoaded', function() {
    fetch(API_URL + '/api/especialidades')
        .then(response => response.json())
        .then(data => {
            const selectEspecialidade = document.getElementById('especialidade');
            data.forEach(esp => {
                const option = document.createElement('option');
                option.value = esp.id_especialidade;
                option.textContent = esp.nome;
                selectEspecialidade.appendChild(option);
            });
        })
        .catch(error => console.error('Erro ao carregar especialidades:', error));
});

document.getElementById('formCadastrarMedico').addEventListener('submit', function(event) {
    event.preventDefault();

    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar_senha').value;
    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    const dados = {
        email: document.getElementById('email').value,
        senha: senha,
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        crf: document.getElementById('crf').value,
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

    fetch(API_URL + '/api/cadastrar_medico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        alert(body.message);
        if (status === 201) {
            event.target.reset();
            window.location.href = 'dashboard_admin.html';
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        alert('Erro ao conectar com o servidor.');
    });
});
