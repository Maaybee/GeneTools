let progressoAtual = 0;
const valorMaximo = 10;
const barraDeValor = document.getElementById('value');
const barraProgresso = document.getElementById('barra-progresso')
const gabarito = ['a','a','a','a','a','a','a','a','a','a'];
const perguntas = [
    '1- Pergunta 1', 
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


const respostasA = ['a','a','a','a','a','a','a','a','a','a'];
const respostasB = ['b','b','b','b','b','b','b','b','b','b'];
const respostasC = ['c','c','c','c','c','c','c','c','c','c'];
const respostasD = ['d','d','d','d','d','d','d','d','d','d'];

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
            title.textContent = "RESULTADOS"
            barraProgresso.style.display = "none"
            document.getElementById('pergunta').style.display = "none"
            const blocoAlt = document.getElementsById('blocoAlt');
            blocoAlt.style.display = "none";
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
