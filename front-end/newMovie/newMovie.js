// newMovie.js (VERSÃO ATUALIZADA)

// NOTA PESSOAL

const ratingSpan = document.getElementById('nota');

const ratingInput = document.getElementById('notaPessoal');
const ratingValue = document.getElementById('ratingValue');
const stars = document.querySelectorAll('.stars span');

function updateStars(value) {
    const fullStars = Math.floor(value);

    stars.forEach((star, i) => {
        if (i < fullStars) star.classList.add('active');
        else star.classList.remove('active');
    });
}

stars.forEach((star, i) => {
    star.addEventListener('click', () => {
        const value = (i + 1);
        ratingInput.value = value;
        ratingValue.textContent = value;
        ratingValue.style.color = '#f2f2f2';
        
        ratingSpan.textContent = value;
        updateStars(value);
    });
});


ratingInput.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    updateStars(value);
});

updateStars(0);

const previewCard = document.querySelector('.movie-card');


// Seleciona os elementos dentro do card
const banner = previewCard.querySelector('.banner');
const titleSpan = previewCard.querySelector('.title span');
const directorSpans = previewCard.querySelectorAll('.director span');
const reviewSpan = previewCard.querySelector('.ownReview .review');
const yearSpan = previewCard.querySelector('.year span');

// Campos do formulário
const tituloInput = document.getElementById('titulo');
const diretorInput = document.getElementById('diretor');
const anoInput = document.getElementById('anoLancamento');
const reviewInput = document.getElementById('reviewCurta');
const capaInput = document.getElementById('urlCapa');

// Atualiza título
tituloInput?.addEventListener('input', () => {
    titleSpan.textContent = tituloInput.value.trim() || 'Título';
});

// Atualiza diretor
diretorInput?.addEventListener('input', () => {
    // No seu HTML, o nome do diretor está no segundo <span> dentro de .director
    directorSpans[1].textContent = diretorInput.value.trim() || 'Nome';
});

// Atualiza ano
anoInput?.addEventListener('input', () => {
    yearSpan.textContent = anoInput.value || 'Ano';
});

// Atualiza nota (tanto o texto quanto o valor mostrado)

// Atualiza review curta
reviewInput?.addEventListener('input', () => {
    reviewSpan.textContent = reviewInput.value.trim() || '...';
});

// Atualiza imagem da capa
capaInput?.addEventListener('input', () => {
    const url = capaInput.value.trim();
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
        banner.style.backgroundImage = `url('${url}')`;
    } else {
        banner.style.backgroundImage = "url('../assets/icons/imgUrl.svg')";
    }
});
    


// =============== ^ ESTILIZAÇÃO ^ ===================

// =================== v API v =======================

const API_URL = 'http://localhost:8080/api/filmes';
const filmeForm = document.getElementById('filmeForm');
const pageTitle = document.getElementById('pageTitle')
const tab = document.getElementById('tab')
const tabSelected = document.getElementById('tab-selected') 
const formTitle = document.getElementById('formTitle'); // Adicionei um seletor para o título
const submitButton = document.querySelector('.submit-button');

// Obtém o ID do filme da URL, se houver (Ex: newMovie.html?id=5)
const urlParams = new URLSearchParams(window.location.search);
const filmeId = urlParams.get('id'); 

// --- Inicialização e Manipulação do DOM ---

document.addEventListener('DOMContentLoaded', () => {
    if (filmeId) {
        // Modo Edição: Altera o texto e carrega dados
        formTitle.textContent = 'Editar Filme Existente';
        pageTitle.textContent = 'Indioflix | Editar '
        tab.textContent = 'Editar'
        tabSelected.classList.add('selected-edit')
        submitButton.textContent = 'Salvar';
        carregarFilmeParaEdicao(filmeId);
    } else {
        // Modo Cadastro: Configuração padrão (já feito no HTML)
        formTitle.textContent = 'Cadastrar Filme';
        submitButton.textContent = 'Cadastrar';
    }
});


// --- Funções de Comunicação com a API ---

// 1. Carrega os dados do filme (GET /api/filmes/{id})
async function carregarFilmeParaEdicao(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Filme ID ${id} não encontrado. Status: ${response.status}`);
        }
        
        const filme = await response.json();
        
        // Preenche o formulário com os dados existentes
        document.getElementById('titulo').value = filme.titulo || '';
        document.getElementById('anoLancamento').value = filme.anoLancamento || '';
        document.getElementById('diretor').value = filme.diretor || '';
        document.getElementById('notaPessoal').value = filme.notaPessoal || '';
        document.getElementById('reviewCurta').value = filme.reviewCurta || '';
        document.getElementById('urlCapa').value = filme.urlCapa || '';

        // Preenche o preview com os dados existentes
        titleSpan.textContent = filme.titulo || "Título";
        yearSpan.textContent = filme.anoLancamento || 'Ano';
        directorSpans[1].textContent = filme.diretor || 'Nome';
        ratingSpan.textContent = filme.notaPessoal || 0
        reviewSpan.textContent = filme.reviewCurta || '...';

        updateStars(filme.notaPessoal)
        ratingValue.textContent = filme.notaPessoal;
        ratingValue.style.color = '#f2f2f2';

        const url = capaInput.value.trim();
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
            banner.style.backgroundImage = `url('${filme.urlCapa}')`;
        } else {
            banner.style.backgroundImage = "url('../assets/icons/imgUrl.svg')";
        }

    } catch (error) {
        console.error("Erro ao carregar filme para edição:", error);
        alert("Não foi possível carregar os dados do filme para edição.");
    }
}


// 2. Envia a requisição POST (Criação) ou PUT (Atualização)
async function handleSubmit(filme) {
    const metodo = filmeId ? 'PUT' : 'POST';
    const url = filmeId ? `${API_URL}/${filmeId}` : API_URL;
    
    try {
        const response = await fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filme), 
        });

        if (response.ok || response.status === 201) { // 201 Created (POST) ou 200 OK (PUT)
            const acao = filmeId ? 'atualizado' : 'adicionado';
            const filmeSalvo = await response.json();
            alert(`Filme "${filmeSalvo.titulo}" ${acao} com sucesso!`);
            
            // Redireciona para a página inicial
            window.location.href = '../home/home.html'; 

        } else if (response.status === 404) {
             alert(`Erro: Filme ID ${filmeId} não encontrado.`);
        } else {
            alert(`Erro ao salvar filme: Status ${response.status}. Verifique os dados.`);
            throw new Error(`Erro de API: Status ${response.status}`);
        }

    } catch (error) {
        console.error("Erro na comunicação com a API:", error);
        alert("Ocorreu um erro ao salvar o filme.");
    }
}


// --- Event Listener do Formulário ---

if (filmeForm) {
    filmeForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        // 1. Coleta e padroniza os dados do formulário
        const titulo = document.getElementById('titulo').value.trim();
        const anoLancamentoInput = document.getElementById('anoLancamento').value;
        const notaPessoalInput = document.getElementById('notaPessoal').value;
        
        // **VERIFICAÇÃO CRÍTICA PARA CAMPO OBRIGATÓRIO**
        if (!titulo) {
            alert("O campo Título é obrigatório e não pode estar vazio.");
            return; // Impede a submissão
        }

        const filmeData = {
            titulo: titulo,
            // Converte para número, ou usa null se o campo estiver vazio
            anoLancamento: anoLancamentoInput ? parseInt(anoLancamentoInput) : null, 
            diretor: document.getElementById('diretor').value,
            notaPessoal: notaPessoalInput ? parseFloat(notaPessoalInput) : null, 
            reviewCurta: document.getElementById('reviewCurta').value,
            urlCapa: document.getElementById('urlCapa').value,
        };

        // 2. Chama a função unificada de POST/PUT
        handleSubmit(filmeData);
    });
}