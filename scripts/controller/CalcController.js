class CalcController {
    // Construtor da classe
    constructor() {
        // Configuração inicial
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        
        // Inicialização da calculadora
        this.initialize();
        // Configuração de eventos dos botões
        this.initButtonsEvents();
    }

    // Inicialização da calculadora
    initialize() {
        // Configura um intervalo de 1 segundo para atualizar a data e hora no display
        setInterval(() => {
            // Chama a função para atualizar data e hora no display
            this.setDisplayDateTime();
        }, 1000);
    }

    // Adiciona múltiplos eventos a um elemento
    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

    // Configura os eventos dos botões da calculadora
    initButtonsEvents() {
        // Seleciona todos os botões da calculadora
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        // Para cada botão, configura eventos de clique e arrastar
        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, "click drag", e => {
                // Exibe no console a classe do botão, removendo o prefixo "btn-"
                console.log(btn.className.baseVal.replace("btn-", ""));
            });

            // Configura eventos de mouseover, mouseup e mousedown para mostrar o cursor como ponteiro
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
            });
        });
    }

    // Atualiza a data e hora no display
    setDisplayDateTime() {
        // Formata a data e atualiza o display
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
        // Atualiza a hora no display
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    // Obtém a hora do display
    get displayTime() {
        return this._timeEl.innerHTML;
    }

    // Define a hora no display
    set displayTime(value) {
        return this._timeEl.innerHTML = value;
    }

    // Obtém a data do display
    get displayDate() {
        return this._dateEl.innerHTML;
    }

    // Define a data no display
    set displayDate(value) {
        return this._dateEl.innerHTML = value;
    }

    // Obtém o valor atual no display da calculadora
    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    // Define o valor no display da calculadora
    set displayCalc(value) {
        this._displayCalcEl.innerHTML = value;
    }

    // Obtém a data atual
    get currentDate() {
        return new Date();
    }

    // Define a data atual
    set currentDate(value) {
        this.currentDate = value;
    }
}
