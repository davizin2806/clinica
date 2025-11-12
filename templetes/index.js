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
    const resposta = await fetch('http://<IP_DO_SERVIDOR>:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const resultado = await resposta.json();

    if (resultado.sucesso) {
      localStorage.setItem('tipo_usuario', resultado.tipo_usuario);
      alert(resultado.mensagem);
      if (resultado.tipo_usuario === 'MED') {
        window.location.href = 'static/dashbord_medico.html';
      } else {
        window.location.href = 'static/dashbord_paciente.html';
      }
    } else {
      mensagemErro.textContent = resultado.mensagem;
    }

  } catch (erro) {
    mensagemErro.textContent = 'Erro ao conectar com o servidor.';
    console.error(erro);
  }
}
