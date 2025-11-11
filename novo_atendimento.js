document.addEventListener("DOMContentLoaded", () => {
  const btnBuscar = document.getElementById("btn-buscar");
  const inputBusca = document.getElementById("busca-paciente");
  const statusBusca = document.getElementById("status-busca");
  const btnSalvar = document.getElementById("salvar-atendimento");

  let pacienteEncontrado = null;

  // Simulação de pacientes (usar apenas para testes locais)
  const pacientesFicticios = [
    { id: 1, nome: "Maria Silva", cpf: "123.456.789-00" },
    { id: 2, nome: "João Pereira", cpf: "987.654.321-00" },
    { id: 3, nome: "Ana Costa", cpf: "111.222.333-44" }
  ];

  // Busca paciente pelo nome ou CPF
  btnBuscar.addEventListener("click", async () => {
    const termo = inputBusca.value.trim();

    if (!termo) {
      statusBusca.textContent = "Digite o nome completo ou CPF do paciente.";
      statusBusca.className = "status erro";
      return;
    }

    // Simulação local
    const paciente = pacientesFicticios.find(
      (p) => p.cpf === termo || p.nome.toLowerCase() === termo.toLowerCase()
    );

    if (paciente) {
      pacienteEncontrado = paciente;
      statusBusca.textContent = `Paciente encontrado: ${paciente.nome} (CPF: ${paciente.cpf})`;
      statusBusca.className = "status ok";
    } else {
      pacienteEncontrado = null;
      statusBusca.textContent = "Paciente não encontrado.";
      statusBusca.className = "status erro";
    }

    /*
    ============================================
    Integração com banco de dados (exemplo real)
    ============================================

    try {
      const response = await fetch(`http://seu-servidor.com/api/pacientes?busca=${encodeURIComponent(termo)}`);
      if (!response.ok) throw new Error("Erro ao buscar paciente.");

      const data = await response.json();

      if (data && data.encontrado) {
        pacienteEncontrado = data.paciente;
        statusBusca.textContent = `Paciente encontrado: ${pacienteEncontrado.nome}`;
        statusBusca.className = "status ok";
      } else {
        pacienteEncontrado = null;
        statusBusca.textContent = "Paciente não encontrado.";
        statusBusca.className = "status erro";
      }
    } catch (error) {
      statusBusca.textContent = "Erro de conexão com o servidor.";
      statusBusca.className = "status erro";
    }
    */
  });

  // Salvar atendimento
  btnSalvar.addEventListener("click", async () => {
    const observacoes = document.getElementById("obs-atendimento").value.trim();
    const examesSelecionados = Array.from(
      document.querySelectorAll("#lista-exames-disponiveis input:checked")
    ).map((el) => el.value);

    if (!pacienteEncontrado) {
      alert("Selecione um paciente válido antes de salvar o atendimento.");
      return;
    }

    const novoAtendimento = {
      paciente_id: pacienteEncontrado.id,
      nome_paciente: pacienteEncontrado.nome,
      cpf_paciente: pacienteEncontrado.cpf,
      observacoes,
      exames: examesSelecionados,
      data: new Date().toLocaleString("pt-BR")
    };

    // Simulação local de salvamento
    console.log("Atendimento salvo (simulado):", novoAtendimento);
    alert(`Atendimento salvo com sucesso para o paciente ${pacienteEncontrado.nome}.`);
    window.location.href = "dashbord_medico.html";

    /*
    ============================================
    Integração real com o banco de dados (API)
    ============================================

    try {
      const response = await fetch("http://seu-servidor.com/api/atendimentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoAtendimento),
      });

      if (response.ok) {
        alert("Atendimento salvo com sucesso.");
        window.location.href = "dashbord_medico.html";
      } else {
        alert("Erro ao salvar atendimento.");
      }
    } catch {
      alert("Erro de conexão ao salvar atendimento.");
    }
    */
  });
});
