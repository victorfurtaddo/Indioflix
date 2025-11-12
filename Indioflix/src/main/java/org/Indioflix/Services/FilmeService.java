package org.Indioflix.Services;

import org.Indioflix.Filme;
import org.Indioflix.Repository.FilmeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FilmeService {

    @Autowired
    private FilmeRepository filmeRepository;

    public Filme salvarFilme(Filme filme) {
        return filmeRepository.save(filme);
    }
    
    public List<Filme> listarTodos() {
        return filmeRepository.findAll();
    }

    public Optional<Filme> buscarPorId(Long id) {
        return filmeRepository.findById(id);
    }

    public Optional<Filme> atualizarFilme(Long id, Filme filmeDetalhes) {
        Optional<Filme> optionalFilme = filmeRepository.findById(id);
        if (optionalFilme.isEmpty()) {
            return Optional.empty();
        }

        Filme filmeExistente = optionalFilme.get();
        filmeExistente.setTitulo(filmeDetalhes.getTitulo());
        filmeExistente.setAnoLancamento(filmeDetalhes.getAnoLancamento());
        filmeExistente.setDiretor(filmeDetalhes.getDiretor());
        filmeExistente.setNotaPessoal(filmeDetalhes.getNotaPessoal());
        filmeExistente.setReviewCurta(filmeDetalhes.getReviewCurta());
        filmeExistente.setUrlCapa(filmeDetalhes.getUrlCapa());

        return Optional.of(filmeRepository.save(filmeExistente));
    }

    public boolean deletarFilme(Long id) {
        if (filmeRepository.existsById(id)) {
            filmeRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
