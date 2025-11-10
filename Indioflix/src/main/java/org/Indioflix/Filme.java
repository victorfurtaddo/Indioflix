package org.Indioflix;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "filmes")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Filme {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false, length = 200)
	private String titulo;
	
	@Column(name = "ano_lançamento")
	private Integer anoLancamento;
	
	@Column(length = 100)
	private String diretor;
	
	@Column(name = "nota_pessoal")
	private Integer notaPessoal;
	
	@Column(name = "review_curta", length = 2000)
	private String reviewCurta;
	
	@Column(name = "url_capa", length = 1024)
	private String urlCapa;
}
