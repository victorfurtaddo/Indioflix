// catalog.js (VERSÃO FINAL CORRIGIDA)

const API_URL = 'http://localhost:8080/api/filmes';
const movieGrid = document.getElementById('movieGrid');


// --- Funções de Manipulação do DOM e Renderização ---

// 1. Função para criar o HTML de um Card de Filme
function criarCardFilme(filme) {
    const nota = filme.notaPessoal !== null ? filme.notaPessoal.toFixed(1) : 'N/A';
    const review = filme.reviewCurta || 'Sem review curta.';
    const diretor = filme.diretor || 'Não informado';
    const anoLancamento = filme.anoLancamento || '????';
    const urlCapa = filme.urlCapa || '../assets/icons/imgUrl.svg';

    // Adicionado classe 'movie-card'
    return `
        <div class="card movie-card" data-id="${filme.id}">
            <div class="banner fakeImg" style="background-image: url('${urlCapa}');">
                <div class="features">
                    <div class="fakeImg edit-btn" data-id="${filme.id}" title="Editar"></div>
                    <div class="divider"></div>
                    <div class="fakeImg delete-btn" data-id="${filme.id}" title="Deletar"></div>
                </div>
                <div class="features">
                    <img src="../assets/icons/ownRating.svg" alt="">
                    <span>${nota}</span>
                </div>
            </div>
            <div class="content">
                <div class="title">
                    <span>${filme.titulo}</span>
                    <div class="dot"></div>
                    <div class="year">
                        <img src="../assets/icons/calendar.svg" alt="">
                        <span>(${anoLancamento})</span>
                    </div>
                </div>
                <div class="director">
                    <img src="../assets/icons/director.svg" alt="">
                    <span>Diretor</span>
                    <div class="dot"></div>
                    <span>${diretor}</span>
                </div>
                <div class="ownReview">
                    <div class="top">
                        <img src="../assets/icons/review.svg" alt="">
                        <span>Sua Review</span>
                    </div>
                    <span class="review">${review}</span>
                </div>
            </div>
        </div>
    `;
}

// 2. Função para injetar os Cards no HTML e adicionar Event Listeners
function renderizarFilmes(filmes) {
    if (filmes.length === 0) {
        movieGrid.innerHTML = ' <div class="empty"><span>Nenhum filme cadastrado</span><img src="../assets/cassette.svg" alt=""></div>';
        return;
    }

    const htmlCards = filmes.map(filme => criarCardFilme(filme)).join('');
    movieGrid.innerHTML = htmlCards;

    // Adiciona Event Listeners para DELETAR, EDITAR e CLIQUE DO CARD
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); 
            const filmeId = event.currentTarget.getAttribute('data-id');
            if (confirm(`Tem certeza que deseja deletar o filme com ID ${filmeId}?`)) {
                deletarFilme(filmeId);
            }
        });
    });

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const filmeId = event.currentTarget.getAttribute('data-id');
            window.location.href = `../newMovie/newMovie.html?id=${filmeId}`; 
        });
    });
    
    document.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', (event) => {
            const filmeId = event.currentTarget.getAttribute('data-id');
            fetchDetalhesFilme(filmeId); 
        });
    });
}

// 3. Função para preencher o conteúdo do Modal
function preencherModal(filme) {
    const modal = document.getElementById('movieDetailsModal');
    if (!modal) return;
    
    const nota = filme.notaPessoal !== null ? filme.notaPessoal.toFixed(1) : 'N/A';
    
    document.getElementById('modalCapa').src = filme.urlCapa || '../assets/icons/imgUrl.svg';
    document.getElementById('modalTitulo').textContent = filme.titulo;
    document.getElementById('modalAno').textContent = filme.anoLancamento || 'Não Informado';
    document.getElementById('modalDiretor').textContent = filme.diretor || 'Não Informado';
    document.getElementById('modalNota').textContent = nota;
    document.getElementById('modalReview').textContent = filme.reviewCurta || 'O usuário não deixou uma review.';
    
    modal.style.display = "block"; // Torna o modal visível
}

// --- Funções de Comunicação com a API ---

// 4. Busca todos os filmes (GET /api/filmes)
async function fetchFilmes() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        
        const filmes = await response.json();
        renderizarFilmes(filmes);

    } catch (error) {
        console.error("Erro ao buscar filmes:", error);
        movieGrid.innerHTML = '<p class="error-message" style="margin-left: 8px; color: red;">Não foi possível carregar o catálogo. Verifique se o backend Spring Boot está rodando em http://localhost:8080.</p>';
    }
}

// 5. Busca detalhes de um único filme (GET /api/filmes/{id})
async function fetchDetalhesFilme(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Filme ID ${id} não encontrado. Status: ${response.status}`);
        }
        
        const filme = await response.json();
        preencherModal(filme);

    } catch (error) {
        console.error("Erro ao carregar detalhes do filme:", error);
        alert("Não foi possível carregar os detalhes do filme.");
    }
}

// 6. Deletar um filme (DELETE /api/filmes/{id})
async function deletarFilme(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        
        if (response.status === 204) { 
            alert(`Filme com ID ${id} deletado com sucesso!`);
            fetchFilmes(); 
        } else if (response.status === 404) {
            alert(`Erro: Filme com ID ${id} não encontrado.`);
        } else {
            throw new Error(`Erro ao deletar: Status ${response.status}`);
        }

    } catch (error) {
        console.error("Erro ao deletar filme:", error);
        alert("Ocorreu um erro ao tentar deletar o filme.");
    }
}


// --- Inicialização e Lógica de Fechamento do Modal ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicia a busca dos filmes
    fetchFilmes(); 

    // 2. Configura a lógica de fechamento do Modal
    const modal = document.getElementById('movieDetailsModal');
    const closeButton = document.querySelector('.close-button'); 

    if (modal && closeButton) {
        // Fechar ao clicar no 'x'
        closeButton.onclick = function() {
            modal.style.display = "none";
        }

        // Fechar ao clicar fora do modal
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }
});