<<<<<<< HEAD

        fetch(API_URL + "/api/gerenciar_especialidade")

        
=======
const API_URL = 'http://192.168.1.14:5000'; // ⚠️ MUDE SE O IP MUDAR
>>>>>>> 9a20be09c85f1ddcd529a29c3290926e17c278b1
        const listaContainer = document.getElementById('lista-especialidades');
        const formAdd = document.getElementById('form-add-especialidade');
        const inputNome = document.getElementById('nome-especialidade');


        async function loadEspecialidades() {
            listaContainer.innerHTML = '<p>Carregando...</p>';
            try {
                const response = await fetch(API_URL + '/api/especialidades');
                const data = await response.json();

                listaContainer.innerHTML = ''; // Limpa a lista
                if (data.length === 0) {
                    listaContainer.innerHTML = '<p>Nenhuma especialidade cadastrada.</p>';
                    return;
                }

                data.forEach(esp => {
                    const item = document.createElement('div');
                    item.className = 'lista-item';
                    item.innerHTML = `
                        <span>${esp.nome} (ID: ${esp.id_especialidade})</span>
                        <button class="btn-remover" data-id="${esp.id_especialidade}">Remover</button>
                    `;
                    listaContainer.appendChild(item);
                });

            } catch (error) {
                console.error('Erro ao carregar:', error);
                listaContainer.innerHTML = '<p style="color: red;">Erro ao carregar especialidades.</p>';
            }
        }


        formAdd.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede o recarregamento
            const nome = inputNome.value.trim();
            if (!nome) return;

            try {
                const response = await fetch(API_URL + '/api/especialidades', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome: nome })
                });
                
                const data = await response.json();
                alert(data.message);

                if (response.ok) {
                    inputNome.value = ''; // Limpa o campo
                    loadEspecialidades(); // Recarrega a lista
                }
            } catch (error) {
                console.error('Erro ao salvar:', error);
                alert('Erro de conexão ao salvar.');
            }
        });

        // Usamos "event delegation" para os botões dinâmicos
        listaContainer.addEventListener('click', async (e) => {
            // Verifica se o clique foi em um botão "remover"
            if (!e.target.classList.contains('btn-remover')) {
                return;
            }

            const id = e.target.dataset.id;
            if (!confirm(`Tem certeza que deseja remover a especialidade ID ${id}?`)) {
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/especialidades/${id}`, {
                    method: 'DELETE'
                });
                
                // Pega a resposta (seja de sucesso ou de erro)
                const data = await response.json();
                alert(data.message); // Ex: "Removida" ou "Erro: Está em uso"

                if (response.ok) {
                    loadEspecialidades(); // Recarrega a lista
                }
            } catch (error) {
                console.error('Erro ao remover:', error);
                alert('Erro de conexão ao remover.');
            }
        });

        // Carrega a lista assim que a página abre
        document.addEventListener('DOMContentLoaded', loadEspecialidades);