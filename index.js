async function validarLogin() {
  const email = document.getElementById('emailInput').value.trim();
  const senha = document.getElementById('senhaInput').value.trim();
  const mensagemErro = document.getElementById('mensagemErro');
  mensagemErro.textContent = '';

  // Verifica se o e-mail é válido, coloquei desse jeito pq pesquisei como fica mais seguro!
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) {
    mensagemErro.textContent = 'Digite um e-mail válido!';
    return;
  }

  try {
    // Envia os dados para o backend depois quem for fazer troca o endereço
    const resposta = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const resultado = await resposta.json();

    if (resultado.sucesso) {
      alert('Login realizado com sucesso!');
      // redireciona se quiser
      // window.location.href = "home.html"; não sei se vai precisar mas coloquei!
    } else {
      mensagemErro.textContent = resultado.mensagem;
    }

  } catch (erro) {
    mensagemErro.textContent = 'Erro ao conectar ao servidor!';
    console.error(erro);
  }
} 
