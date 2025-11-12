// Espera o HTML carregar antes de "ligar" os botões
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Seleção dos Elementos ---
    // Botões e status
    const btnBuscar = document.getElementById("btn-buscar");
    const inputBusca = document.getElementById("busca-paciente");
    const statusBusca = document.getElementById("status-busca");
    const btnSalvar = document.getElementById("salvar-atendimento");
    
    // Elementos de Cálculo
    const inputValorConsulta = document.getElementById('valor-consulta');
    const divListaExames = document.getElementById('lista-exames-disponiveis');
    const spanTotal = document.getElementById('valor-total');
    
    let pacienteEncontrado = null;

    // Simulação de pacientes
    const pacientesFicticios = [
        { id: 1, nome: "Maria Silva", cpf: "123.456.789-00", id_convenio: 1 }, // Convênio A (simulado)
        { id: 2, nome: "João Pereira", cpf: "987.654.321-00", id_convenio: 2 }, // Convênio B (simulado)
        { id: 3, nome: "Ana Costa", cpf: "111.222.333-44", id_convenio: null } // Particular
    ];

    
    // --- 2. Função Principal de Cálculo (Atualizada) ---
    function recalcularTotalGeral() {
        let total = 0;

        // --- PARTE A: Valor da Consulta ---
        const valorConsulta = parseFloat(inputValorConsulta.value) || 0;
        total += valorConsulta;

        // --- PARTE B: Valor dos Exames ---
        const todosExames = divListaExames.querySelectorAll('input[type="checkbox"]');

        todosExames.forEach(checkbox => {
            const label = checkbox.parentElement;
            const spanPreco = label.querySelector('.preco-exame');
            const idExame = checkbox.dataset.idExame;
            const precoPadrao = parseFloat(checkbox.dataset.precoPadrao);

            // --- LÓGICA DE DESCONTO (SIMULAÇÃO) ---
            // No mundo real, usaríamos o 'pacienteEncontrado.id_convenio'
            // para perguntar ao backend.
            
            let desconto = 0;
            if (pacienteEncontrado && pacienteEncontrado.id_convenio === 1 && idExame === '1') {
                // Paciente do "Convênio A" (id 1) tem 10% no Hemograma (id 1)
                desconto = 0.10; 
            }
            if (pacienteEncontrado && pacienteEncontrado.id_convenio === 2 && idExame === '2') {
                // Paciente do "Convênio B" (id 2) tem 5% no Raio-X (id 2)
                desconto = 0.05;
            }
            // --- FIM DA SIMULAÇÃO ---
            
            const valorFinalExame = precoPadrao * (1 - desconto);

            // Atualiza o texto do span individual
            if (checkbox.checked) {
                // Se estiver marcado, adiciona o valor ao total
                total += valorFinalExame;

                // E atualiza o span
                let textoDesconto = (desconto > 0) ? ` (Com desconto: R$ ${valorFinalExame.toFixed(2)})` : ` (R$ ${valorFinalExame.toFixed(2)})`;
                spanPreco.textContent = textoDesconto;
                spanPreco.style.color = 'green';
                spanPreco.style.fontWeight = 'bold';
            } else {
                // Se não estiver marcado, apenas reseta o span
                spanPreco.textContent = ` (Padrão: R$ ${precoPadrao.toFixed(2)})`;
                spanPreco.style.color = 'black';
                spanPreco.style.fontWeight = 'normal';
            }
        });

        // --- PARTE C: Atualiza o Total no Rodapé ---
        spanTotal.textContent = `R$ ${total.toFixed(2)}`;
    }


    // --- 3. Lógica de Busca de Paciente (Atualizada) ---
    // (Adicionei 'recalcularTotalGeral' aqui, pois o convênio do paciente afeta os preços)
    btnBuscar.addEventListener("click", () => {
        const termo = inputBusca.value.trim();
        
        if (!termo) {
             statusBusca.textContent = "Digite o nome completo ou CPF do paciente.";
             statusBusca.className = "status erro";
             pacienteEncontrado = null;
        } else {
            // Simulação local
            const paciente = pacientesFicticios.find(
                (p) => p.cpf === termo || p.nome.toLowerCase() === termo.toLowerCase()
            );

            if (paciente) {
                pacienteEncontrado = paciente;
                statusBusca.textContent = `Paciente encontrado: ${paciente.nome}`;
                statusBusca.className = "status ok";
            } else {
                pacienteEncontrado = null;
                statusBusca.textContent = "Paciente não encontrado.";
                statusBusca.className = "status erro";
            }
        }
        
        // **IMPORTANTE**: Recalcula os preços assim que o paciente é selecionado/removido
        recalcularTotalGeral();
    });


    // --- 4. Lógica de Salvar Atendimento ---
    btnSalvar.addEventListener("click", () => {
        const observacoes = document.getElementById("obs-atendimento").value.trim();
        const valorConsulta = parseFloat(inputValorConsulta.value) || 0;
        
        // Pega os exames E seus valores finais calculados
        const examesSelecionados = Array.from(
            document.querySelectorAll("#lista-exames-disponiveis input:checked")
        ).map((el) => {
            const precoTexto = el.parentElement.querySelector('.preco-exame').textContent;
            return {
                nome: el.parentElement.textContent.split('(')[0].trim(), // Pega só o nome
                valor_final: precoTexto.match(/R\$ (\d+\.\d+)/)[1] // Pega só o número
            };
        });

        if (!pacienteEncontrado) {
            alert("Selecione um paciente válido antes de salvar o atendimento.");
            return;
        }

        const novoAtendimento = {
            paciente_id: pacienteEncontrado.id,
            observacoes,
            valor_consulta: valorConsulta,
            exames: examesSelecionados,
            total_atendimento: document.getElementById('valor-total').textContent,
            data: new Date().toLocaleString("pt-BR")
        };

        console.log("Atendimento salvo (simulado):", novoAtendimento);
        alert(`Atendimento salvo com sucesso para o paciente ${pacienteEncontrado.nome}.`);
        window.location.href = "dashbord_medico.html";
        
        // (O código de integração real com o backend ficaria aqui)
    });
    
    
    // --- 5. Adiciona os "Escutadores" de Cálculo ---
    // Escuta qualquer mudança no campo "Valor da Consulta"
    inputValorConsulta.addEventListener('input', recalcularTotalGeral);
    
    // Escuta qualquer clique nos checkboxes de exame
    divListaExames.addEventListener('change', recalcularTotalGeral);

    // Roda a função uma vez no início para setar o valor (R$ 0.00)
    recalcularTotalGeral();
});