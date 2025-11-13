// Arquivo: ../templetes/gerenciar_convenios.js

document.addEventListener('DOMContentLoaded', () => {

    // Pega a tabela de descontos
    const tabelaDescontos = document.getElementById('tabela-descontos');
    
    // Pega o botão de salvar novo convênio
    const formNovoConvenio = document.getElementById('form-novo-convenio');
    if (formNovoConvenio) {
        formNovoConvenio.addEventListener('submit', (e) => {
            e.preventDefault();
            // Lógica do Backend (simulada):
            const nome = document.getElementById('nome-convenio').value;
            alert(`Convênio "${nome}" salvo com sucesso!`);
            // Aqui você enviaria para o backend e depois recarregaria a lista do <select>
            formNovoConvenio.reset();
        });
    }

    // --- Lógica da Matriz de Descontos ---

    // Função para calcular o preço final
    function calcularPrecoFinal(inputDesconto) {
        // Pega a linha (tr) onde o input está
        const linha = inputDesconto.closest('tr');
        
        // Pega os dados da linha
        const precoPadrao = parseFloat(linha.dataset.precoPadrao);
        const percentualDesconto = parseFloat(inputDesconto.value) || 0;
        
        // Pega o <span> onde o preço final será exibido
        const spanPrecoFinal = linha.querySelector('.preco-final');

        // Calcula o valor
        let valorFinal = precoPadrao;
        if (percentualDesconto > 0 && percentualDesconto <= 100) {
            valorFinal = precoPadrao * (1 - (percentualDesconto / 100));
        }

        // Atualiza o texto na tela
        spanPrecoFinal.textContent = `R$ ${valorFinal.toFixed(2)}`;
    }

    // "Escutador" de eventos na tabela
    if (tabelaDescontos) {
        // Usa delegação de eventos para monitorar todos os inputs
        tabelaDescontos.addEventListener('input', (evento) => {
            // Se o que foi digitado for um input de desconto...
            if (evento.target.classList.contains('input-desconto')) {
                calcularPrecoFinal(evento.target);
            }
        });
    }

    // Lógica para o botão "Salvar Descontos"
    const btnSalvarDescontos = document.getElementById('btn-salvar-descontos');
    if(btnSalvarDescontos) {
        btnSalvarDescontos.addEventListener('click', () => {
            const idConvenio = document.getElementById('select-convenio').value;
            if (!idConvenio) {
                alert("Por favor, selecione um convênio primeiro!");
                return;
            }

            const descontos = [];
            const linhas = tabelaDescontos.querySelectorAll('tbody tr');
            
            linhas.forEach(linha => {
                const idExame = linha.dataset.idExame;
                const percentual = linha.querySelector('.input-desconto').value || 0;
                
                descontos.push({
                    id_exame: idExame,
                    percentual_desconto: percentual
                });
            });

            // Lógica do Backend (simulada):
            console.log(`Salvando descontos para o convênio ${idConvenio}:`, descontos);
            alert("Descontos salvos com sucesso!");
        });
    }

});