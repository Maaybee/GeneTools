
document.addEventListener("DOMContentLoaded", () => {
  // Inicialização dos selects customizados
  document.querySelectorAll(".custom-select").forEach((customSelect) => {
    const header = customSelect.querySelector(".selected-option") || customSelect.querySelector(".selected-option-cor");
    const firstOption = customSelect.querySelector(".options .option");

    if (header && firstOption) {
      const img = firstOption.querySelector("img");
      const label = firstOption.querySelector("span");
      if (img && label) {
        const hImg = header.querySelector("img");
        const hLabel = header.querySelector(".label");
        if (hImg) hImg.src = img.src;
        if (hLabel) hLabel.innerText = label.innerText;
        header.dataset.selectedValue = firstOption.dataset.value;
      }
    }

    if (header) {
      const options = customSelect.querySelector(".options");
      header.addEventListener("click", (ev) => {
        ev.stopPropagation();
        options.style.display = options.style.display === "block" ? "none" : "block";
      });

      options.querySelectorAll(".option").forEach((opt) => {
        opt.addEventListener("click", () => {
          const img = opt.querySelector("img");
          const label = opt.querySelector("span");
          const dataValue = opt.dataset.value;
          const hImg = header.querySelector("img");
          const hLabel = header.querySelector(".label");
          if (img && label && hImg && hLabel) {
            hImg.src = img.src;
            hLabel.innerText = label.innerText;
            header.dataset.selectedValue = dataValue;
          }
          options.style.display = "none";
        });
      });
    }
  });

  document.addEventListener("click", (e) => {
    document.querySelectorAll(".custom-select").forEach((customSelect) => {
      const options = customSelect.querySelector(".options");
      if (!customSelect.contains(e.target) && options) options.style.display = "none";
    });
  });

  // Estado / referências
  const MAX_PASSOS = 4; // Passos 0,1,2,3,4,5
  let passoAtual = 0;
  let alelosPai = [];
  let alelosMae = [];
  let cruzamentos = [];
  let caminhoImagem = [];
  let combinado = false;

  const explicacaoContainer = document.getElementById("explicação");
  const divBtns = document.getElementById("div_btns");
  let btnAnterior = document.getElementById("btn-ant");
  let btnProxElem = document.getElementById("btn-prox");


  if (!btnAnterior && divBtns) {
    btnAnterior = document.createElement("button");
    btnAnterior.id = "btn-ant";
    btnAnterior.textContent = "Passo Anterior"; 
    btnAnterior.classList.add("btns-explicacao");
    btnAnterior.style.display = "none";
    divBtns.appendChild(btnAnterior); 
  }

  if (!btnProxElem && divBtns) {
    btnProxElem = document.createElement("button");
    btnProxElem.id = "btn-prox";
    btnProxElem.textContent = "Próximo passo";
    divBtns.appendChild(btnProxElem); 
  }

  if (btnProxElem) btnProxElem.disabled = true;

  function resetDynamicSteps() {
    explicacaoContainer.querySelectorAll(".dynamic-step").forEach(el => el.remove());
  }

  function renderAleloSpan(a, size = 28) {
    const color = a === "A" ? "gold" : "saddlebrown";
    return `<span style="display:inline-block; font-size:${size}px; font-weight:700; color:${color}; margin:0 6px;">${a}</span>`;
  }

  function renderGenotypeBox(gen, size = 60) {
    if (gen === "AA") return `<div style="width:${size}px;height:${size}px;border-radius:8px;background:gold;display:flex;align-items:center;justify-content:center;font-weight:700;color:black">${gen}</div>`;
    else if (gen === "aa") return `<div style="width:${size}px;height:${size}px;border-radius:8px;background:saddlebrown;display:flex;align-items:center;justify-content:center;font-weight:700;color:white">${gen}</div>`;
    else return `<div style="width:${size}px;height:${size}px;border-radius:8px;background:gray;display:flex;align-items:center;justify-content:center;font-weight:700;color:white">${gen}</div>`;
  }

  function ensureDynamicStep(stepIndex) {
    let existing = explicacaoContainer.querySelector(`.dynamic-step[data-step="${stepIndex}"]`);
    if (existing) {
      existing.style.display = "block";
      return existing;
    }

    const bloco = document.createElement("div");
    bloco.className = "dynamic-step bloco-explicacao";
    bloco.dataset.step = String(stepIndex);

    const h2 = document.createElement("h2"); 
    h2.textContent = `${stepIndex + 1}º Passo`;
    bloco.appendChild(h2);


    const inner = document.createElement("div");
    inner.className = "blocos";
    bloco.appendChild(inner);

    explicacaoContainer.appendChild(bloco);

    // Conteúdo didático por passo
    if (stepIndex === 1) {
      inner.innerHTML = `
        <p>No <b>primeiro passo</b>, identificamos os <b>alelos</b> herdados pelo pai e pela mãe:</p>
        <p>Os <em>alelos</em> são versões diferentes de um mesmo gene que determinam características, como a cor do pelo. Alelos dominantes (A) se manifestam mesmo em heterozigose (Aa), enquanto alelos recessivos (a) só aparecem quando duplicados (aa).</p>
      `;
    } else if (stepIndex === 2) {
      inner.innerHTML = `
        <p>No <b>segundo passo</b>, construímos o <b>Quadrado de Punnett</b> para visualizar todas as combinações possíveis de alelos:</p>
        <table border="1" style="margin:10px auto; text-align:center; border-collapse:collapse;">
          <thead><tr><th></th><th>${alelosMae[0]}</th><th>${alelosMae[1]}</th></tr></thead>
          <tbody>
            <tr><th>${alelosPai[0]}</th>
              <td>${alelosPai[0]}${alelosMae[0]}<br><small>→ ${[alelosPai[0],alelosMae[0]].sort().join("")}</small></td>
              <td>${alelosPai[0]}${alelosMae[1]}<br><small>→ ${[alelosPai[0],alelosMae[1]].sort().join("")}</small></td>
            </tr>
            <tr><th>${alelosPai[1]}</th>
              <td>${alelosPai[1]}${alelosMae[0]}<br><small>→ ${[alelosPai[1],alelosMae[0]].sort().join("")}</small></td>
              <td>${alelosPai[1]}${alelosMae[1]}<br><small>→ ${[alelosPai[1],alelosMae[1]].sort().join("")}</small></td>
            </tr>
          </tbody>
        </table>
        <p>O quadrado de Punnett mostra todas as combinações possíveis de genótipos entre os pais e nos ajuda a prever as probabilidades de cada genótipo aparecer nos descendentes.</p>
      `;
    } else if (stepIndex === 3) {
      const counts = { AA: 0, Aa: 0, aa: 0 };
      cruzamentos.forEach(g => counts[g] = (counts[g] || 0) + 1);
      const total = cruzamentos.length || 1;

      inner.innerHTML = `
        <p>No <b>terceiro passo</b>, analisamos o <b>fenótipo</b> e o <b>genótipo</b>:</p>
        <p><b>Genótipo:</b> a composição genética de um indivíduo (por exemplo, AA, Aa ou aa).</p>
        <p><b>Fenótipo:</b> a característica observável resultante do genótipo, como a cor do pelo.</p>
        <div style="display:flex;gap:12px;justify-content:center;margin:8px 0;">
          ${Object.keys(counts).map(k => counts[k] === 0 ? '' : `<div style="text-align:center;">
            ${renderGenotypeBox(k,70)}
            <div style="margin-top:6px;font-weight:600">${k}</div>
            <div>${counts[k]}/4 (${Math.round((counts[k]/total)*100)}%)</div>
          </div>`).join('')}
        </div>
        <p>Os alelos dominantes (A) determinam o fenótipo mesmo quando presentes em apenas uma cópia (Aa), enquanto os recessivos (a) só se manifestam quando duplicados (aa).</p>
      `;
    } else if (stepIndex === 4) {
      h2.style.display = "none"; // oculta título
      inner.innerHTML = `
        <p>No <b>quarto passo</b>, aplicamos os conceitos aprendidos em exercícios:</p>
        <p>Use a tabela de Punnett para prever genótipos e fenótipos de novos cruzamentos. Lembre-se:</p>
        <ul>
          <li>Genótipo: combinação de alelos (AA, Aa, aa).</li>
          <li>Fenótipo: característica visível resultante do genótipo.</li>
          <li>Dominância: alelos dominantes se manifestam mesmo em heterozigose.</li>
          <li>Recessividade: alelos recessivos só se manifestam em homozigose.</li>
        </ul>
        <p><em>Agora, é hora de testar seu conhecimento!</em></p>
      `;
      if (btnProxElem) btnProxElem.textContent = "Exercícios";
    } 

    // garante que a div de botões fique abaixo
    if (divBtns) explicacaoContainer.appendChild(divBtns);

    return bloco;
  }




  function updateView() {
    // Oculta todos os passos dinâmicos
    explicacaoContainer.querySelectorAll(".dynamic-step").forEach(el => el.style.display = "none"); 

    const passo1Wrapper = document.getElementById("passo1")?.closest(".blocos")?.parentElement; 

    if (passoAtual === 0) {
      if (passo1Wrapper) passo1Wrapper.style.display = "";
      btnAnterior.style.display = "none";
      if (btnProxElem) {
        btnProxElem.disabled = !combinado;  // bloqueia se ainda não combinou
        btnProxElem.textContent = "Próximo passo";
      }
    } else if (passoAtual > 0 && passoAtual < MAX_PASSOS) {
      if (passo1Wrapper) passo1Wrapper.style.display = "none";
      ensureDynamicStep(passoAtual);
      btnAnterior.style.display = "inline-block";
      if (btnProxElem) {
        btnProxElem.disabled = false;
        btnProxElem.textContent = "Próximo passo";
      }
    } else if (passoAtual === MAX_PASSOS) {
      if (passo1Wrapper) passo1Wrapper.style.display = "none";
      ensureDynamicStep(passoAtual);
      btnAnterior.style.display = "inline-block";
      if (btnProxElem) {
        btnProxElem.disabled = false;
        btnProxElem.textContent = "Exercícios";
      }
    }
  }


  if (btnAnterior) btnAnterior.addEventListener("click", () => {
    if (passoAtual > 0) {
      passoAtual--;
      updateView();
    }
  });

  const btnCombinar = document.getElementById("btn");
  if (btnCombinar) {
    btnCombinar.addEventListener("click", () => {

      const animal = document.querySelector("#animal-select .selected-option").dataset.selectedValue;
      const corPai = document.querySelector("#select_cor1 .selected-option-cor").dataset.selectedValue;
      const corMae = document.querySelector("#select_cor2 .selected-option-cor").dataset.selectedValue;

      alelosPai = corPai === "amarelo" ? ["A","A"] : corPai === "preto" ? ["A","a"] : ["a","a"];
      alelosMae = corMae === "amarelo" ? ["A","A"] : corMae === "preto" ? ["A","a"] : ["a","a"];

      cruzamentos = [];
      for (let i=0;i<2;i++) for (let j=0;j<2;j++) cruzamentos.push([alelosPai[i],alelosMae[j]].sort().join(""));

      caminhoImagem = cruzamentos.map(gen => {
        let base = gen==="AA"?"yellow":gen==="aa"?"brown":"gray";
        let animal_sufix = animal==="cachorro"?"dog":animal==="gato"?"cat":"bunny";
        return `assets/table/${base}_${animal_sufix}.svg`;
      });

      const staticTable = document.querySelector(".static-table table");
      if (staticTable) {
        staticTable.querySelectorAll("td").forEach((td,i)=>{
          td.innerHTML = `<div class="tableImgWrapper">
                            <img src="${caminhoImagem[i]}" class="tableImg"/>
                            <span class="tooltip">${cruzamentos[i]}</span>
                          </div>`;
        });
      }

      const tableContainer = document.querySelector(".static-table");
      if (tableContainer && !tableContainer.querySelector(".instruction-text")) {
        const instruction = document.createElement("p");
        instruction.textContent = "*Passe o mouse sobre as imagens para ver os alelos";
        instruction.classList.add("instruction-text");
        tableContainer.appendChild(instruction);
      }

      combinado = true;
      
      resetDynamicSteps();
      passoAtual = 0;

      const passo1 = document.getElementById("passo1");
      if (passo1) {
        passo1.innerHTML = `
          <p>No <b>primeiro passo</b>, identificamos os <b>alelos</b> herdados do pai e da mãe:</p>
          <table border="1" style="margin:10px auto; text-align:center; border-collapse:collapse;">
            <tr><th>Genitor</th><th>Alelo 1</th><th>Alelo 2</th></tr>
            <tr><td>Pai</td><td>${renderAleloSpan(alelosPai[0],22)}</td><td>${renderAleloSpan(alelosPai[1],22)}</td></tr>
            <tr><td>Mãe</td><td>${renderAleloSpan(alelosMae[0],22)}</td><td>${renderAleloSpan(alelosMae[1],22)}</td></tr>
          </table>
          <p><em>Alelos</em> são versões de um mesmo gene que determinam características específicas (como cor de pelo).</p>
          <p>Um <b>alelo dominante (A)</b> se manifesta mesmo que esteja presente apenas uma vez (Aa), enquanto um <b>alelo recessivo (a)</b> só se manifesta quando duplicado (aa).</p>
          <p>Este passo é fundamental para entender como as combinações de alelos influenciam o <b>genótipo</b> e, consequentemente, o <b>fenótipo</b> dos descendentes.</p>
        `;
        document.getElementById('text').style.display = "none"
        document.getElementById('nominal').style.display = "flex"

      }

      if (btnProxElem) btnProxElem.disabled = false;
      updateView();
    });
  }

  let verifica = 0

  // fora da função updateView(), apenas uma vez
  btnProxElem.addEventListener("click", () => {
    if (!combinado) return; // bloqueia se não combinou

    if  (passoAtual === MAX_PASSOS) {
      verifica = 1;
      direcionar();
    } else if (passoAtual < MAX_PASSOS) {
      
      passoAtual++;
      updateView();
      direcionar();
    }
  });

  function direcionar () { 
    if (verifica == 1) { 
      window.location = 'exercicios.html'
    }
  }


});
