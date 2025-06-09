// Variáveis
const tickets = [];
const distancia = 100;
const resultadosSection = document.getElementById('resultados');
const ticketsSection = document.getElementById('tickets-section');
const resultsContent = document.getElementById('results-content');

// Elementos do DOM
const placaInput = document.getElementById('placa');
const stopAInput = document.getElementById('stopA');
const stopBInput = document.getElementById('stopB');

function add() {
    const placaValue = placaInput.value.trim().toUpperCase();
    const stopAValue = parseFloat(stopAInput.value);
    const stopBValue = parseFloat(stopBInput.value);
    
    // Validação
    if (!placaValue || isNaN(stopAValue) || isNaN(stopBValue)) {
        alert("Por favor, preencha todos os campos corretamente!");
        return;
    }
    
    if (stopBValue <= stopAValue) {
        alert("A hora da parada B deve ser maior que a parada A!");
        return;
    }
    
    // Calcula valores preliminares
    const tempo = stopBValue - stopAValue;
    const velocidade = distancia / tempo;
    let valor = calcularValorPedagio(velocidade);
    
    // Adiciona aos tickets
    const ticket = {
        placa: placaValue,
        horaEntrada: stopAValue,
        horaSaida: stopBValue,
        tempo: tempo,
        velocidade: velocidade,
        valorPago: valor
    };
    
    tickets.push(ticket);
    
    // Limpa os campos
    placaInput.value = '';
    stopAInput.value = '';
    stopBInput.value = '';
    
    // Exibe o ticket imediatamente
    exibirTicket(ticket);
    ticketsSection.style.display = 'block';
    placaInput.focus();
}

function calcularValorPedagio(velocidade) {
    let valor = 20; // Valor base
    if (velocidade <= 60) valor *= 0.85; // 15% desconto
    else if (velocidade <= 100) valor *= 0.90; // 10% desconto
    return parseFloat(valor.toFixed(2));
}

function exibirTicket(ticket) {
    const ticketElement = document.createElement('div');
    ticketElement.className = 'ticket-card fade-in';
    ticketElement.innerHTML = `
        <div class="ticket-header">
            <span>Ticket #${tickets.length} - ${ticket.placa}</span>
            <button class="print-btn" onclick="printTicket(this.parentElement.parentElement)">
                <i class="fas fa-print"></i> Imprimir
            </button>
        </div>
        <div class="ticket-body">
            <div class="ticket-row">
                <span class="ticket-label">Hora de Entrada (A):</span>
                <span class="ticket-value">${ticket.horaEntrada}h</span>
            </div>
            <div class="ticket-row">
                <span class="ticket-label">Hora de Saída (B):</span>
                <span class="ticket-value">${ticket.horaSaida}h</span>
            </div>
            <div class="ticket-row">
                <span class="ticket-label">Tempo no percurso:</span>
                <span class="ticket-value">${ticket.tempo.toFixed(2)} horas</span>
            </div>
            <div class="ticket-row">
                <span class="ticket-label">Velocidade média:</span>
                <span class="ticket-value">${ticket.velocidade.toFixed(2)} km/h</span>
            </div>
            <div class="ticket-row">
                <span class="ticket-label">Valor do pedágio:</span>
                <span class="ticket-value highlight">R$ ${ticket.valorPago.toFixed(2)}</span>
            </div>
        </div>
    `;
    ticketsSection.insertBefore(ticketElement, ticketsSection.firstChild);
}

function printTicket(ticketElement) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Ticket de Pedágio</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                    .ticket-print { border: 2px dashed #ccc; padding: 20px; max-width: 300px; margin: 0 auto; }
                    .ticket-header { text-align: center; margin-bottom: 15px; }
                    .ticket-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
                    .ticket-label { font-weight: bold; }
                    .ticket-value { text-align: right; }
                    .highlight { font-size: 1.2em; color: #d00; }
                </style>
            </head>
            <body>
                <div class="ticket-print">
                    <div class="ticket-header">
                        <h2>Ticket de Pedágio</h2>
                        <p>${new Date().toLocaleString()}</p>
                    </div>
                    ${ticketElement.querySelector('.ticket-body').innerHTML}
                </div>
                <script>window.print();</script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

function calculo() {
    if (tickets.length === 0) {
        alert("Adicione pelo menos um veículo antes de calcular!");
        return;
    }
    
    let somaVelocidades = 0;
    let totalValores = 0;
    let menorV = Infinity;
    let maiorV = -Infinity;
    
    tickets.forEach(ticket => {
        // Atualiza estatísticas
        menorV = Math.min(menorV, ticket.velocidade);
        maiorV = Math.max(maiorV, ticket.velocidade);
        somaVelocidades += ticket.velocidade;
        totalValores += ticket.valorPago;
    });
    
    const media = somaVelocidades / tickets.length;
    
    // Exibe resultados gerais
    resultsContent.innerHTML = `
        <div class="result-row">
            <span class="result-label">Total de veículos:</span>
            <span class="result-value">${tickets.length}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Menor velocidade:</span>
            <span class="result-value">${menorV.toFixed(2)} km/h</span>
        </div>
        <div class="result-row">
            <span class="result-label">Maior velocidade:</span>
            <span class="result-value">${maiorV.toFixed(2)} km/h</span>
        </div>
        <div class="result-row">
            <span class="result-label">Média de velocidades:</span>
            <span class="result-value">${media.toFixed(2)} km/h</span>
        </div>
        <div class="result-row">
            <span class="result-label">Total arrecadado:</span>
            <span class="result-value" style="color: var(--success);">R$ ${totalValores.toFixed(2)}</span>
        </div>
    `;
    
    resultadosSection.style.display = 'block';
    resultsContent.classList.add('fade-in');
}