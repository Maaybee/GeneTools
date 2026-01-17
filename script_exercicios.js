// --- CONFIGURAÇÕES DO EMAILJS ---
const EMAIL_SERVICE_ID = "service_yrb52a6"; 
const EMAIL_TEMPLATE_ID = "template_zh3cvvq"; // Ex: template_a82j19
const EMAIL_PUBLIC_KEY = "hQ9f6X9ebPtkBCCMA";   // Ex: user_9812379...

// Inicializa o EmailJS
(function() {
    emailjs.init(EMAIL_PUBLIC_KEY);
})();

// --- DADOS DO QUIZ ---
let progressoAtual = 0;
const valorMaximo = 10;
let acertos = 0;
let historicoParaPDF = []; 

// Gabarito (ajuste conforme necessário)
const gabarito = ['a', 'b', 'c', 'b', 'a', 'b', 'b', 'c', 'b', 'b'];

const perguntas = [
    '1- Suponha o seguinte cenário, dois animais homozigotos iguais tem 2 filhos, qual a probabilidade dos dois filhos serem homozigotos?', 
    '2- No simulador, o genótipo "Aa" é classificado como:',
    '3- Qual a definição correta de Fenótipo?',
    '4- Se um alelo é dominante (A), isso significa que:',
    '5- Cruzando Aa x Aa, qual a chance de nascer "aa"?',
    '6- Qual a principal função do Quadrado de Punnett?',
    '7- O genótipo "Aa" aparece com qual frequência no cruzamento Aa x Aa?',
    '8- Para uma característica recessiva se manifestar, o genótipo deve ser:',
    '9- "Gato com pelo cinza" refere-se ao:',
    '10- Alelos são:'
];

const todasRespostas = {
    a: ['100%', 'Homozigoto', 'Genótipo', 'Sempre morre', '25%', 'Dar nomes', '25%', 'AA', 'Genótipo', 'Cores'],
    b: ['50%', 'Heterozigoto', 'Probabilidade', 'Se manifesta com 1 cópia', '50%', 'Prever probabilidades', '50%', 'Aa', 'Fenótipo', 'Versões do gene'],
    c: ['25%', 'Recessivo', 'Característica visível', 'É sempre fraco', '75%', 'Mutar o DNA', '75%', 'aa', 'Alelo', 'Proteínas'],
    d: ['0%', 'Fenótipo', 'Divisão celular', 'Não é herdado', '100%', 'Contar animais', '100%', 'A', 'Quadrado', 'Células']
};

// --- LÓGICA DO QUIZ ---

function carregarPergunta(index) {
    document.getElementById('pergunta').textContent = perguntas[index];
    document.getElementById('resposta_a').textContent = todasRespostas.a[index] || "---";
    document.getElementById('resposta_b').textContent = todasRespostas.b[index] || "---";
    document.getElementById('resposta_c').textContent = todasRespostas.c[index] || "---";
    document.getElementById('resposta_d').textContent = todasRespostas.d[index] || "---";
}

document.querySelectorAll('.opcao-container').forEach(container => {
    container.addEventListener('click', function () {
        document.querySelectorAll('.bolinha_alternativa').forEach(alt => alt.classList.remove('alternativa-selecionada'));
        const bolinha = this.querySelector('.bolinha_alternativa');
        bolinha.classList.add('alternativa-selecionada');
    });
});

document.getElementById('btnProxQuestao').addEventListener('click', function () {
    const selecionada = document.querySelector('.alternativa-selecionada');
    if (!selecionada) return alert("Selecione uma opção!");

    const letraEscolhida = selecionada.id.split('_')[1];
    const letraCorreta = gabarito[progressoAtual];

    historicoParaPDF.push({
        numero: progressoAtual + 1,
        pergunta: perguntas[progressoAtual],
        escolha: todasRespostas[letraEscolhida][progressoAtual] || "---",
        correta: todasRespostas[letraCorreta][progressoAtual] || "---",
        acertou: letraEscolhida === letraCorreta
    });

    if (letraEscolhida === letraCorreta) {
        selecionada.classList.add('correta');
        acertos++;
    } else {
        selecionada.classList.add('errada');
        document.getElementById('alternativa_' + letraCorreta).classList.add('correta');
    }

    setTimeout(() => {
        progressoAtual++;
        if (progressoAtual < valorMaximo) {
            limparEProxima();
        } else {
            mostrarResultados();
        }
    }, 1000);
});

function limparEProxima() {
    document.querySelectorAll('.bolinha_alternativa').forEach(alt => alt.classList.remove('alternativa-selecionada', 'correta', 'errada'));
    carregarPergunta(progressoAtual);
    const porcentagemBarra = (progressoAtual / valorMaximo) * 100;
    document.getElementById('value').style.width = porcentagemBarra + '%';
}

function mostrarResultados() {
    const container = document.getElementById('container');
    document.getElementById('title').textContent = "RESULTADOS";
    document.getElementById('barra-progresso').style.display = "none";
    document.getElementById('btnProxQuestao').style.display = "none";

    // Layout Final com Gráfico e Email lado a lado
    container.innerHTML = `
        <h2 id="pergunta" style="margin-bottom: 2vh;">Você concluiu a lista de exercícios!!</h2>
        
        <div class="row-itens grafico"> 
            <div id="grafico_container"> 
                <div class="grafico-wrapper">
                    <div class="grafico-desempenho"></div>
                    <div id="valorDesempenho" class="valor-central">${acertos}/${valorMaximo}</div>
                </div>
            </div> 
            
            <div id="email-container"> 
                <h2 id="email-text"> Enviar resultados para: </h2> 
                <input type="email" id="email-input" placeholder="professor@email.com">
                <button id="btnEnviarEmail" style="margin-top:10px; padding:10px 20px; cursor:pointer; border-radius:30em; border:none; background:#70A1E2; font-family:'SourGummy'; font-weight:bold; font-size: 1.5rem; width: 100%;">Enviar</button>
            </div> 
        </div>

        <button id="btnInicio" onclick="location.reload()" style="margin-top: 4vh;"> Voltar para o início</button>
    `;

    atualizarGrafico(acertos, valorMaximo);
    
    // Adiciona evento ao novo botão
    document.getElementById('btnEnviarEmail').addEventListener('click', processarEnvioEmail);
}

function atualizarGrafico(acertos, total) {
    const elemento = document.querySelector('.grafico-desempenho');
    const angulo = (acertos / total) * 360;
    elemento.style.background = `conic-gradient(#62c462 0deg, #62c462 ${angulo}deg, #dc3545 ${angulo}deg, #dc3545 360deg)`;
}

// --- FUNÇÃO DE ENVIO E GERAÇÃO DE PDF ---

function processarEnvioEmail() {
    const emailDestino = document.getElementById('email-input').value;
    
    if (!emailDestino || !emailDestino.includes('@')) {
        alert("Por favor, digite um e-mail válido.");
        return;
    }

    const btn = document.getElementById('btnEnviarEmail');
    const textoOriginal = btn.textContent;
    btn.textContent = "Enviando...";
    btn.disabled = true;

    // 1. Gera PDF (Mantemos igual)
    gerarPDFDownload(emailDestino);

    // 2. PREPARAÇÃO DO EMAIL FORMATADO (HTML)
    // Aqui criamos linhas de uma tabela HTML
    const linhasTabela = historicoParaPDF.map(item => {
        // Define cores: verde claro para acerto, vermelho claro para erro
        const bgCor = item.acertou ? '#e8f5e9' : '#ffebee'; 
        const bordaCor = item.acertou ? '#c8e6c9' : '#ffcdd2';
        const icone = item.acertou ? '✅' : '❌';
        const textoCorreta = item.acertou ? '' : `<br><span style="font-size: 12px; color: #d32f2f;">Gabarito: <b>${item.correta}</b></span>`;

        return `
            <tr style="background-color: ${bgCor}; border-bottom: 1px solid ${bordaCor};">
                <td style="padding: 12px; text-align: center; width: 40px;">${icone}</td>
                <td style="padding: 12px; font-family: sans-serif;">
                    <div style="font-size: 14px; font-weight: bold; color: #333;">Questão ${item.numero}</div>
                    <div style="font-size: 13px; color: #555;">${item.pergunta}</div>
                </td>
                <td style="padding: 12px; font-family: sans-serif;">
                    <div style="font-size: 14px;">Sua resp: <b>${item.escolha}</b></div>
                    ${textoCorreta}
                </td>
            </tr>
        `;
    }).join('');

    // Encapsula as linhas em uma tabela completa
    const htmlTabelaCompleta = `
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; background-color: white;">
            ${linhasTabela}
        </table>
    `;

    const templateParams = {
        destinatario: emailDestino,
        acertos: acertos,
        total: valorMaximo,
        // Enviamos o HTML pronto na variável 'detalhes'
        detalhes: htmlTabelaCompleta 
    };

    // 3. Envia para o EmailJS
    emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, templateParams)
        .then(function() {
            alert("Sucesso! E-mail enviado com o relatório detalhado.");
            btn.textContent = "Enviado!";
            btn.style.backgroundColor = "#62c462";
        }, function(error) {
            console.error('Erro:', error);
            alert("Erro ao enviar e-mail.");
            btn.textContent = textoOriginal;
            btn.disabled = false;
        });
}

function gerarPDFDownload(nomeEmail) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.text(`Relatório GeneTools`, 10, 10);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Destinatário: ${nomeEmail}`, 10, 20);
    doc.text(`Nota: ${acertos} / ${valorMaximo}`, 10, 28);
    doc.line(10, 32, 200, 32);

    let y = 40;
    
    historicoParaPDF.forEach((item) => {
        if (y > 270) { doc.addPage(); y = 20; }
        
        doc.setFont("helvetica", "bold");
        doc.text(`${item.numero}. ${item.pergunta}`, 10, y);
        y += 7;
        
        doc.setFont("helvetica", "normal");
        if (item.acertou) {
            doc.setTextColor(0, 150, 0); // Verde
            doc.text(`Sua resposta: ${item.escolha} (Correto)`, 15, y);
        } else {
            doc.setTextColor(200, 0, 0); // Vermelho
            doc.text(`Sua resposta: ${item.escolha} (Incorreto)`, 15, y);
            y += 6;
            doc.setTextColor(50, 50, 50);
            doc.text(`Resposta correta: ${item.correta}`, 15, y);
        }
        doc.setTextColor(0, 0, 0);
        y += 12;
    });

}

document.addEventListener('DOMContentLoaded', () => carregarPergunta(0));