// --- LOGIN ---
async function validarLogin() {
  const email = document.getElementById('emailInput').value.trim();
  const senha = document.getElementById('senhaInput').value.trim();
  const mensagemErro = document.getElementById('mensagemErro');
  mensagemErro.textContent = '';

  if (!email || !senha) {
    mensagemErro.textContent = 'Preencha todos os campos!';
    return;
  }

  try {
<<<<<<< HEAD
  const resposta = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
});
=======
    const resposta = await fetch('http://192.168.1.14:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
>>>>>>> 9a20be09c85f1ddcd529a29c3290926e17c278b1

    const resultado = await resposta.json();

    if (resultado.sucesso) {
      localStorage.setItem('tipo_usuario', resultado.tipo_usuario);
      localStorage.setItem('usuario_nome', resultado.nome);

      if (resultado.id_paciente)
        localStorage.setItem('paciente_id', resultado.id_paciente);

      if (resultado.id_medico)
        localStorage.setItem('medico_id', resultado.id_medico);

      alert(resultado.mensagem);

      if (resultado.tipo_usuario === 'MED') {
        window.location.href = 'static/dashbord_medico.html';
      } else if (resultado.tipo_usuario === 'PAC') {
        window.location.href = 'static/dashbord_paciente.html';
      } else if (resultado.tipo_usuario === 'ADMIN') {
        window.location.href = 'static/dashboard_admin.html';
      }
    } else {
      mensagemErro.textContent = resultado.mensagem;
    }

  } catch (erro) {
    mensagemErro.textContent = 'Erro ao conectar com o servidor.';
    console.error(erro);
  }
}

// --- REDIRECIONA PARA A TELA DE CADASTRO ---
function se_cadastrar() {
  window.location.href = "../static/cadastro_pclogin.html";  
}
