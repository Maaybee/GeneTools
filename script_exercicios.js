let progressoAtual = 0;
const valorMaximo = 10;
const barraDeValor = document.getElementById('value');
const barraProgresso = document.getElementById('barra-progresso')
const gabarito = ['a','a','a','a','a','a','a','a','a','a'];
const perguntas = [
    '1- Suponha o seguinte cenário, dois animais homozigotos tem 2 filhos, qual a probabilidade dos dois filhos serem homozigotos?', 
    '2- Pergunta 2', 
    '3- Pergunta 3', 
    '4- Pergunta 4', 
    '5- Pergunta 5', 
    '6- Pergunta 6', 
    '7- Pergunta 7', 
    '8- Pergunta 8', 
    '9- Pergunta 9', 
    '10- Pergunta 10'
];

let acertos = 0;
const title = document.getElementById('title');


const respostasA = ['100%','a','a','a','a','a','a','a','a','a','a'];
const respostasB = ['50%','b','b','b','b','b','b','b','b','b','b'];
const respostasC = ['25%','c','c','c','c','c','c','c','c','c','c'];
const respostasD = ['0%','d','d','d','d','d','d','d','d','d','d'];

// Atualiza a barra de progresso
function atualizarProgresso() {
    const porcentagem = ((progressoAtual + 1) / valorMaximo) * 100;
    barraDeValor.style.width = porcentagem + '%';
}

// Limpa seleção e feedback visual
function limparSelecao() {
    const alternativas = document.querySelectorAll('.bolinha_alternativa');
    alternativas.forEach(alternativa => {
        alternativa.classList.remove('alternativa-selecionada', 'correta', 'errada');
    });
}

// Seleciona alternativas
document.querySelectorAll('.bolinha_alternativa').forEach(item => {
    item.addEventListener('click', function () {
        limparSelecao();
        item.classList.add('alternativa-selecionada');
    });
});

// Botão "Responder"
document.getElementById('btnProxQuestao').addEventListener('click', function () {
    if (progressoAtual >= valorMaximo) {
        alert("Parabéns, você completou todos os exercícios!");
        return;
    }

    const alternativaSelecionada = document.querySelector('.alternativa-selecionada');

    if (!alternativaSelecionada) {
        alert("Selecione uma alternativa antes de continuar.");
        return;
    }

    // Verificação da resposta
    const respostaSelecionadaId = alternativaSelecionada.id.split('_')[1]; // a, b, c, d
    const respostaCerta = gabarito[progressoAtual];

    if (respostaSelecionadaId === respostaCerta) {
        document.getElementById('alternativa_' + respostaSelecionadaId).classList.add('correta');
        
        acertos++;
    } else {
        document.getElementById('alternativa_' + respostaSelecionadaId).classList.add('errada');
        document.getElementById('alternativa_' + respostaCerta).classList.add('correta');
    }

    // Espera 1 segundo para mostrar o feedback, depois atualiza
    setTimeout(function () {
        progressoAtual++;

        if (progressoAtual < valorMaximo) {
            atualizarProgresso();
            carregarPergunta(progressoAtual);
        } else {
            const container = document.getElementById('container');
            
            // 1. Oculta os elementos de layout que não serão substituídos
            title.textContent = "RESULTADOS";
            barraProgresso.style.display = "none";
            document.getElementById('btnProxQuestao').style.display = "none";

            // 2. Insere o novo HTML do gráfico e resultado
            // ATENÇÃO: Os elementos do quiz (pergunta, alternativas, etc.) são removidos aqui
            container.innerHTML = `
                <h2 id="pergunta"> Você concluiu a lista de exercícios!! </h2>
                    <div class="row-itens grafico"> 
                        <div id="grafico_container"> 
                            <div class="grafico-desempenho">
                                <div id="valorDesempenho" class="valor-central">${acertos}/${valorMaximo}
                                </div>
                            </div> 
                        </div>
                        <div id="email-container"> 
                            <h2 id="email-text"> Enviar questões para o email: </h2> 
                            <input type="email" id="email-input" placeholder="Digite o seu email">
                        </div> 
                    </div>

                <button id="btnInicio"> Voltar para o início</button>
            `;

            const inicio = document.getElementById('btnInicio');
            inicio.addEventListener('click', function () {
                window.location = 'index.html';
            })
            atualizarGrafico(acertos, valorMaximo); 

            alert("Parabéns, você completou todos os exercícios!" );


        }

        limparSelecao(); // Limpa após atualizar pergunta
    }, 1000); // 1 segundo de delay
});

// Carrega pergunta e alternativas
function carregarPergunta(index) {
    document.getElementById('pergunta').textContent = perguntas[index];
    document.getElementById('resposta_a').textContent = respostasA[index];
    document.getElementById('resposta_b').textContent = respostasB[index];
    document.getElementById('resposta_c').textContent = respostasC[index];
    document.getElementById('resposta_d').textContent = respostasD[index];
}

/**
 * Atualiza o gráfico de desempenho.
 * @param {number} acertos - O número de respostas corretas (ex: 8).
 * @param {number} totalQuestoes - O número total de questões (ex: 10).
 */
function atualizarGrafico(acertos, totalQuestoes) {
    const elementoGrafico = document.querySelector('.grafico-desempenho');
    const elementoValor = document.getElementById('valorDesempenho');
    
    // 1. Calcula a porcentagem e o ângulo
    const porcentagem = acertos / totalQuestoes; // Ex: 0.8
    const anguloPreenchido = porcentagem * 360; // Ex: 288 graus
    
    // 2. Define as cores
    const corSucesso = '#62c462'; // Verde
    const corFalha = '#dc3545';  // Vermelho
    
    // 3. Constrói a string do conic-gradient
    // O gradiente começa com a cor de sucesso e vai até o ângulo calculado.
    // O restante do círculo (de anguloPreenchido até 360deg) é preenchido com a cor de falha.
    const gradienteCSS = `
        conic-gradient(
            ${corSucesso} 0deg, 
            ${corSucesso} ${anguloPreenchido}deg, 
            ${corFalha} ${anguloPreenchido}deg, 
            ${corFalha} 360deg
        )
    `;

    // 4. Aplica o estilo e o texto
    elementoGrafico.style.background = gradienteCSS;
    elementoValor.textContent = `${acertos}/${totalQuestoes}`;
}

document.addEventListener('DOMContentLoaded', () => {
    carregarPergunta(0);
    
});