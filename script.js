
document.querySelectorAll(".custom-select").forEach((customSelect) => { // permite mais de um select/menu no site
  const selected = customSelect.querySelector(".selected-option"); // opção atualmente escolhida
  const options = customSelect.querySelector(".options"); // lista de opções

  // Abrir/fechar opções
  selected.addEventListener("click", () => {
    options.style.display = options.style.display === "block" ? "none" : "block";
    // block = mostrar, none = esconder
    // quando o usuário clica, a função alterna entre mostrar e esconder
  });

  // Clicar em uma das opções
  options.querySelectorAll(".option").forEach((opt) => {
    opt.addEventListener("click", () => {
      // seleciona a imagem e o texto da opção clicada
      const img = opt.querySelector("img");
      const label = opt.querySelector("span");
      const dataValue = opt.dataset.value;
      // altera a imagem e o texto da opção atual
      if (img && label) {
        selected.querySelector("img").src = img.src;
        selected.querySelector(".label").innerText = label.innerText;
        selected.dataset.selectedValue = dataValue;
      }

      options.style.display = "none"; // fecha a lista de opções
    });
  });
});

// Fecha ao clicar fora
document.addEventListener("click", (e) => {
  document.querySelectorAll(".custom-select").forEach((customSelect) => {
    const options = customSelect.querySelector(".options");
    if (!customSelect.contains(e.target)) { // verifica se o clicou fora do select
      options.style.display = "none"; // fecha a lista de opções
    }
  });
});

// -------------------------------------------------------

// Algoritmo para a tabela 
document.getElementById("btn").addEventListener("click", () => {
  const animal = document.querySelector("#animal-select .selected-option").dataset.selectedValue; // animal escolhido
  const corPai = document.querySelector("#select_cor1 .selected-option").dataset.selectedValue; // cor do pai
  const corMae = document.querySelector("#select_cor2 .selected-option").dataset.selectedValue; // cor da mae

  let alelosPai = [];
  let alelosMae = [];

  // Genótipos do pai
  if (corPai === "amarelo") {
    alelosPai = ["A", "A"];
  } else if (corPai === "preto") {
    alelosPai = ["A", "a"];
  } else {
    alelosPai = ["a", "a"];
  }

  // Genótipos da mãe
  if (corMae === "amarelo") {
    alelosMae = ["A", "A"];
  } else if (corMae === "preto") {
    alelosMae = ["A", "a"];
  } else {
    alelosMae = ["a", "a"];
  }

  // Cruzamentos
  const cruzamentos = [];
  for (let i = 0; i < 2; i++) { 
    for (let j = 0; j < 2; j++) { 
      const a1 = alelosPai[i];
      const a2 = alelosMae[j];
      const combinado = [a1, a2].sort().join(""); // garante que Aa e aA sejam sempre Aa
      cruzamentos.push(combinado); // adiciona ao array
    }
  }

  // Contagem dos alelos
  const contagem = {
    AA: 0,
    Aa: 0,
    aa: 0
  };

  cruzamentos.forEach(genotipo => {
    if (genotipo === "AA") contagem.AA++; 
    else if (genotipo === "Aa") contagem.Aa++;
    else contagem.aa++;
  });

    const caminhoImagem = [];
    cruzamentos.forEach((genotipo, i) => { // adiciona o caminho das imagens

    if (animal === "cachorro") {
      if (genotipo === "AA") 
        caminhoImagem[i] = "assets/table/yellow_dog.svg";
      else if (genotipo === "aa") 
        caminhoImagem[i] = "assets/table/brown_dog.svg";
      else caminhoImagem[i] = "assets/table/gray_dog.svg";
    } else if (animal === "gato") {
      if (genotipo === "AA") 
        caminhoImagem[i] = "assets/table/yellow_cat.svg";
      else if (genotipo === "aa") 
        caminhoImagem[i] = "assets/table/brown_cat.svg";
      else caminhoImagem[i] = "assets/table/gray_cat.svg";
    } else if (animal === "coelho") {
      if (genotipo === "AA") 
        caminhoImagem[i] = "assets/table/yellow_bunny.svg";
      else if (genotipo === "aa") 
        caminhoImagem[i] = "assets/table/brown_bunny.svg";
      else caminhoImagem[i] = "assets/table/gray_bunny.svg";
    }

  });

  // Construção da tabela
  let tableContent = `
    <table>
      <tr>
        <th>Alelos</th>
        <th>${alelosMae[0]}</th>
        <th>${alelosMae[1]}</th>
      </tr>
      <tr>
        <td>${alelosPai[0]}</td>
        <td><img src="${caminhoImagem[0]}" alt="${animal}" class="tableImg" /></td>
        <td><img src="${caminhoImagem[1]}" alt="${animal}" class="tableImg" /></td>
      </tr>
      <tr>
        <td>${alelosPai[1]}</td>
        <td><img src="${caminhoImagem[2]}" alt="${animal}" class="tableImg" /></td>
        <td><img src="${caminhoImagem[3]}" alt="${animal}" class="tableImg" /></td>
      </tr>
    </table>
    <div class="offspring-images">
  `;

  tableContent += `</div>`; // fecha a div

  const resultadoContent = `
    <br>
    <h3>Resultado do cruzamento genético:</h3>
    <p>Amarelo: ${contagem.AA * 25}%</p>
    <p>Marrom: ${contagem.aa * 25}%</p>
    <p>Preto: ${contagem.Aa * 25}%</p>
    <h3>Explicação:</h3>
    <p>O cruzamento entre ${corPai} (${alelosPai.join("")}) e ${corMae} (${alelosMae.join("")}) resulta nas combinações mostradas, com base nas leis da genética de Mendel.</p>
  `;

  const principalDiv = document.getElementById("simulador"); // seleciona a div principal
  const existingResults = principalDiv.querySelector(".results-section"); // verifica se a div de resultados ja existe
  if (existingResults) {
    principalDiv.removeChild(existingResults); // remove a div de resultados
  }

  const resultsDiv = document.createElement("div"); // cria a div de resultados
  resultsDiv.classList.add("results-section"); // adiciona a classe
  resultsDiv.innerHTML = tableContent + resultadoContent; // adiciona o conteúdo da tabela
  principalDiv.appendChild(resultsDiv); // adiciona a div de resultados

  const staticTable = principalDiv.querySelector(".table"); // verifica se a tabela estática ja existe
  if (staticTable) {
    staticTable.style.display = "none"; // esconde a tabela estática
  }
});

// Inicializar os selects com o primeiro valor
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".custom-select").forEach(customSelect => {
    const selected = customSelect.querySelector(".selected-option");
    const firstOption = customSelect.querySelector(".option");
    if (selected && firstOption) {
      const img = firstOption.querySelector("img");
      const label = firstOption.querySelector("span");
      if (img && label) {
        selected.querySelector("img").src = img.src;
        selected.querySelector(".label").innerText = label.innerText;
        selected.dataset.selectedValue = firstOption.dataset.value;
      }
    }
  });
});
