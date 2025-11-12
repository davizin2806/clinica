// Arquivo: index.js (Atualizado para testes)
async function validarLogin() {
    const email = document.getElementById('emailInput').value.trim();
    const senha = document.getElementById('senhaInput').value.trim();
    const mensagemErro = document.getElementById('mensagemErro');
    mensagemErro.textContent = '';
  
    // Regex simples para email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      mensagemErro.textContent = 'Digite um e-mail válido!';
      return;
    }
  
    try {
      // --- INÍCIO DA SIMULAÇÃO (Remova isso quando tiver backend real) ---
      // Estamos fingindo que o backend respondeu isso baseado no email digitado
      let resultadoSimulado;
      
      if (email === 'medico@teste.com' && senha === '123') {
          resultadoSimulado = { 
              sucesso: true, 
              tipo_usuario: 'MED', 
              nome: 'Dr. House', 
              token: 'token_falso_medico_123' 
          };
      } else if (email === 'paciente@teste.com' && senha === '123') {
          resultadoSimulado = { 
              sucesso: true, 
              tipo_usuario: 'PAC', 
              nome: 'Fulano da Silva', 
              token: 'token_falso_paciente_456' 
          };
      } else {
           resultadoSimulado = { sucesso: false, mensagem: 'E-mail ou senha incorretos' };
      }
      // --- FIM DA SIMULAÇÃO ---
  
      /* // QUANDO TIVER BACKEND, DESCOMENTE ISTO E USE:
      const resposta = await fetch('http://localhost:3000/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email, senha })
      });
      const resultado = await resposta.json();
      */
      
      // Usando nossa simulação por enquanto:
      const resultado = resultadoSimulado; 
  
      if (resultado.sucesso) {
        // Guarda o tipo de usuário no navegador para usar nas outras páginas
        localStorage.setItem('tipo_usuario', resultado.tipo_usuario);
        localStorage.setItem('nome_usuario', resultado.nome);
        
        // REDIRECIONAMENTO INTELIGENTE
        if (resultado.tipo_usuario === 'MED') {
          alert('Login de Médico realizado! Redirecionando...');
          window.location.href = "dashbord_medico.html";
        } else if (resultado.tipo_usuario === 'PAC') {
          alert('Login de Paciente realizado! Redirecionando...');
          window.location.href = "dashbord_paciente.html";
        }
        
      } else {
        mensagemErro.textContent = resultado.mensagem;
      }
  
    } catch (erro) {
      mensagemErro.textContent = 'Erro ao conectar ao servidor!';
      console.error(erro);
    }
  }