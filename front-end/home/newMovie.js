// newMovie.js (VERSÃO ATUALIZADA)

const API_URL = 'http://localhost:8080/api/filmes';
const filmeForm = document.getElementById('filmeForm');
const formTitle = document.querySelector('.form-container h2'); // Adicionei um seletor para o título
const submitButton = document.querySelector('.submit-button');

// Obtém o ID do filme da URL, se houver (Ex: newMovie.html?id=5)
const urlParams = new URLSearchParams(window.location.search);
const filmeId = urlParams.get('id'); 

// --- Inicialização e Manipulação do DOM ---

document.addEventListener('DOMContentLoaded', () => {
    if (filmeId) {
        // Modo Edição: Altera o texto e carrega dados
        formTitle.textContent = 'Editar Filme Existente';
        submitButton.textContent = 'SALVAR MUDANÇAS';
        carregarFilmeParaEdicao(filmeId);
    } else {
        // Modo Cadastro: Configuração padrão (já feito no HTML)
        formTitle.textContent = 'Adicionar Novo Filme';
        submitButton.textContent = 'CADASTRAR FILME';
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
            window.location.href = './home.html'; 

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