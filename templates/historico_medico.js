// Arquivo: ../templates/historico_medico.js

document.addEventListener('DOMContentLoaded', () => {
    fetch(API_URL + "/api/historico_medico")

    // 1. Pega os elementos do filtro e da lista
    const grupoFiltros = document.getElementById('filtro-convenios');
    const listaHistorico = document.getElementById('lista-historico-medico');
    // Pega todos os cards de atendimento que estão na lista
    const todosAtendimentos = listaHistorico.querySelectorAll('.card-atendimento');

    // 2. Define a função que filtra os resultados
    function aplicarFiltro() {
        
        // Pega todos os checkboxes que estão MARCADOS
        const filtrosMarcados = grupoFiltros.querySelectorAll('input[name="convenio"]:checked');
        
        // Cria um array com os valores marcados (ex: ["1", "particular"])
        const conveniosSelecionados = Array.from(filtrosMarcados).map(checkbox => checkbox.value);

        // 3. Loop por todos os cards de atendimento
        todosAtendimentos.forEach(card => {
            const cardConvenioId = card.dataset.idConvenio;

            // Lógica:
            // Se NENHUM filtro estiver marcado, mostra TODOS os cards.
            if (conveniosSelecionados.length === 0) {
                card.style.display = 'block'; // 'block' é o padrão
            } else {
                // Se TEM filtros marcados, verifica se o ID do card está na lista de selecionados
                if (conveniosSelecionados.includes(cardConvenioId)) {
                    card.style.display = 'block'; // Mostra o card
                } else {
                    card.style.display = 'none'; // Esconde o card
                }
            }
        });
    }

    // 4. "Escuta" por qualquer clique/mudança na caixa de filtros
    if (grupoFiltros) {
        grupoFiltros.addEventListener('change', aplicarFiltro);
    }

    // Opcional: Aplicar o filtro uma vez no início (caso algum filtro já venha marcado)
    // aplicarFiltro();
});