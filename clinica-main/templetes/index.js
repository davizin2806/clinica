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

  // --- Simulação de login offline ---
  let resultadoSimulado = null;

  if (email === 'medico@teste.com' && senha === '123') {
    resultadoSimulado = { 
      sucesso: true, 
      tipo_usuario: 'MED', 
      nome: 'Dr. House', 
      token: 'token_falso_medico_123',
      mensagem: 'Login realizado com sucesso (modo simulado).'
    };
  } else if (email === 'paciente@teste.com' && senha === '123') {
    resultadoSimulado = { 
      sucesso: true, 
      tipo_usuario: 'PAC', 
      nome: 'Fulano da Silva', 
      token: 'token_falso_paciente_456',
      mensagem: 'Login realizado com sucesso (modo simulado).'
    };
  }

  try {
    const resposta = await fetch('http://192.168.1.14:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    // --- Usa o resultado da API ou o simulado ---
    const resultado = (resposta.ok) ? await resposta.json() : resultadoSimulado;

    // --- Se ainda assim não tiver resultado, erro ---
    if (!resultado) {
      mensagemErro.textContent = 'Usuário ou senha incorretos.';
      return;
    }

    if (resultado.sucesso) {
      localStorage.setItem('tipo_usuario', resultado.tipo_usuario);
      localStorage.setItem('usuario_nome', resultado.nome);

      if (resultado.id_paciente) localStorage.setItem('paciente_id', resultado.id_paciente);
      if (resultado.id_medico) localStorage.setItem('medico_id', resultado.id_medico);

      alert(resultado.mensagem || 'Login realizado com sucesso.');

      if (resultado.tipo_usuario === 'MED') {
        window.location.href = 'static/dashbord_medico.html';
      } else {
        window.location.href = 'static/dashbord_paciente.html';
      }
    } else {
      mensagemErro.textContent = resultado.mensagem || 'Credenciais inválidas.';
    }

  } catch (erro) {
    // --- Fallback automático se a API estiver offline ---
    if (resultadoSimulado) {
      localStorage.setItem('tipo_usuario', resultadoSimulado.tipo_usuario);
      localStorage.setItem('usuario_nome', resultadoSimulado.nome);
      alert('Login simulado (API offline).');
      if (resultadoSimulado.tipo_usuario === 'MED') {
        window.location.href = 'static/dashbord_medico.html';
      } else {
        window.location.href = 'static/dashbord_paciente.html';
      }
    } else {
      mensagemErro.textC
