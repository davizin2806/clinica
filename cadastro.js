document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("cadastroForm");

  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const data_nascimento = document.getElementById("data_nascimento").value;
    const telefone = document.getElementById("telefone").value.trim();
    const endereco = document.getElementById("endereco").value.trim();

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, insira um e-mail válido!");
      return;
    }

    
    const dados = {
      nome,
      cpf,
      email,
      senha,
      data_nascimento,
      telefone,
      endereco
    };
    try {
    const url = "http://localhost:3000/api/usuarios";

    //SIMULAÇÃO: é só para funcionar sem o banco de dados conectado, dps ele pode ser apagado!
    alert("Conta criada com sucesso!");
    window.location.href = "index.html";
    return;
        
    /* Esse é o cod que conecta no banco para fazer a mesma coisa que o simulador, mas conectado!
    try {
      // Aqui vamos trocar o link pelo seu endpoint quando tiver o banco rodando
      
      const resposta = await fetch("http://localhost:3000/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });

      if (resposta.ok) {
        alert("Conta criada com sucesso!");
        window.location.href = "index.html";
      } else {
        alert("Erro ao criar conta. Tente novamente!");
      }
      */
        
    } catch (erro) {
      console.error("Erro de conexão:", erro);
      alert("Erro de conexão. Verifique se o servidor está ativo.");
    }
  });
});
