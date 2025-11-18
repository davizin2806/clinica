document.addEventListener('DOMContentLoaded', () => {
    fetch(API_URL + "/api/gerenciar_convenios")

    const selectConvenio = document.getElementById('select-convenio');
    const tabelaDescontosBody = document.querySelector('#tabela-descontos tbody');
    const formNovoConvenio = document.getElementById('form-novo-convenio');
    const btnSalvarDescontos = document.getElementById('btn-salvar-descontos');

    // --- FUNÇÃO 1: Carregar Convênios no Dropdown ---
    async function loadConvenios() {
        try {
            const response = await fetch(API_URL + '/api/convenios');
            const data = await response.json();
            
            selectConvenio.innerHTML = '<option value="">Selecione...</option>';
            data.forEach(convenio => {
                const option = document.createElement('option');
                option.value = convenio.id_convenio;
                option.textContent = convenio.nome;
                selectConvenio.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar convenios:', error);
        }
    }

    // --- FUNÇÃO 2: Carregar Tabela de Exames/Descontos ---
    async function loadDescontos(convenioId) {
        if (!convenioId) {
            tabelaDescontosBody.innerHTML = '<tr><td colspan="4">Selecione um convênio para ver os descontos.</td></tr>';
            return;
        }
        
        try {
            // Chama a ROTA da API
            const response = await fetch(`${API_URL}/api/descontos/${convenioId}`);
            const data = await response.json();
            
            tabelaDescontosBody.innerHTML = '';
            if (data.length === 0) {
                 tabelaDescontosBody.innerHTML = '<tr><td colspan="4">Nenhum exame cadastrado no sistema.</td></tr>';
                 return;
            }

            data.forEach(exame => {
                const tr = document.createElement('tr');
                tr.dataset.idExame = exame.id_exame;
                tr.dataset.precoPadrao = exame.preco_padrao;
                
                const precoPadraoF = `R$ ${exame.preco_padrao.toFixed(2)}`;
                const desconto = exame.percentual_desconto;
                const precoFinal = exame.preco_padrao * (1 - (desconto / 100));
                const precoFinalF = `R$ ${precoFinal.toFixed(2)}`;

                tr.innerHTML = `
                    <td>${exame.nome}</td>
                    <td>${precoPadraoF}</td>
                    <td><input type="number" class="input-desconto" min="0" max="100" value="${desconto.toFixed(0)}"> %</td>
                    <td class="preco-final">${precoFinalF}</td>
                `;
                tabelaDescontosBody.appendChild(tr);
            });
        } catch (error) {
            console.error('Erro ao carregar descontos:', error);
            tabelaDescontosBody.innerHTML = '<tr><td colspan="4" style="color: red;">Erro ao carregar descontos.</td></tr>';
        }
    }

    // --- FUNÇÃO 3: Recalcular Preço Final (na Tabela) ---
    tabelaDescontosBody.addEventListener('input', (e) => {
        if (!e.target.classList.contains('input-desconto')) return;

        const tr = e.target.closest('tr');
        const precoPadrao = parseFloat(tr.dataset.precoPadrao);
        const desconto = parseFloat(e.target.value) || 0;
        
        const precoFinal = precoPadrao * (1 - (desconto / 100));
        
        const tdPrecoFinal = tr.querySelector('.preco-final');
        tdPrecoFinal.textContent = `R$ ${precoFinal.toFixed(2)}`;
    });

    // --- FUNÇÃO 4: Salvar Descontos (POST) ---
    btnSalvarDescontos.addEventListener('click', async () => {
        const convenioId = selectConvenio.value;
        if (!convenioId) {
            alert('Selecione um convênio primeiro.');
            return;
        }

        const promessas = [];
        const linhas = tabelaDescontosBody.querySelectorAll('tr[data-id-exame]');

        linhas.forEach(tr => {
            const idExame = tr.dataset.idExame;
            const desconto = tr.querySelector('.input-desconto').value;

            const dadosParaEnviar = {
                id_convenio: parseInt(convenioId),
                id_exame: parseInt(idExame),
                percentual_desconto: parseFloat(desconto) || 0
            };

            const promessa = fetch(API_URL + '/api/descontos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosParaEnviar)
            });
            promessas.push(promessa);
        });

        try {
            await Promise.all(promessas);
            alert('Descontos salvos com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar descontos:', error);
            alert('Erro ao salvar descontos.');
        }
    });

// --- FUNÇÃO 5: Salvar Novo Convênio (POST) ---
    formNovoConvenio.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Captura todos os dados do formulário novo
        const dadosParaEnviar = {
            nome: document.getElementById('nome-convenio').value,
            cnpj: document.getElementById('cnpj-convenio').value,
            telefone: document.getElementById('tel-convenio').value,
            email: document.getElementById('email-convenio').value,
            
            // Dados de Endereço
            cep: document.getElementById('cep-convenio').value,
            logradouro: document.getElementById('logradouro-convenio').value,
            numero: document.getElementById('numero-convenio').value,
            complemento: document.getElementById('complemento-convenio').value,
            bairro: document.getElementById('bairro-convenio').value,
            cidade: document.getElementById('cidade-convenio').value,
            estado: document.getElementById('estado-convenio').value
        };

        console.log("Enviando:", dadosParaEnviar); // Para depuração no console

        try {
            const response = await fetch(API_URL + '/api/convenios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosParaEnviar)
            });
            
            const data = await response.json();
            alert(data.message);

            if (response.ok) {
                formNovoConvenio.reset();
                loadConvenios(); // Recarrega a lista
            }
        } catch (error) {
            console.error('Erro ao salvar convênio:', error);
            alert('Erro ao salvar convênio.');
        }
    });

    // --- Event Listeners ---
    selectConvenio.addEventListener('change', (e) => {
        loadDescontos(e.target.value);
    });

    // --- Iniciar ---
    loadConvenios();
    loadDescontos(null); // Inicia a tabela vazia
});