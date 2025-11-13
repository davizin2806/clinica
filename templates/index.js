// templetes/index.js
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
    // ⚠️ ATENÇÃO: Use a URL completa da API
    const resposta = await fetch('http://192.168.1.14:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const resultado = await resposta.json();

    if (resultado.sucesso) {
      // --- SALVA OS DADOS NO LOCALSTORAGE ---
      localStorage.setItem('tipo_usuario', resultado.tipo_usuario);
      localStorage.setItem('usuario_nome', resultado.nome);
      
      // Salva os IDs para as próximas telas
      if(resultado.id_paciente) {
        localStorage.setItem('paciente_id', resultado.id_paciente);
      }
      if(resultado.id_medico) {
        localStorage.setItem('medico_id', resultado.id_medico);
      }
      
      alert(resultado.mensagem);
      
      if (resultado.tipo_usuario === 'MED') {
        window.location.href = 'static/dashbord_medico.html';
      } else {
        // Assumindo 'PAC' ou qualquer outro
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