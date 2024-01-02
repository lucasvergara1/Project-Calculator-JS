class CalcController {

    // Construtor da classe
    constructor(){

        // Variáveis de estado da calculadora
        this._lastOperator = ''; // Último operador
        this._lastNumber = ''; // Último número

        // Array para armazenar a sequência de operações
        this._operation = [];

        // Configurações de localização
        this._locale = 'pt-BR';

        // Elementos HTML
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");

        // Data atual
        this._currentDate;

        // Inicialização da calculadora
        this.initialize();

        // Configuração de eventos nos botões
        this.initButtonsEvents();

        this.initKeyboard();

    }

    pasteFromClipboard() {

        document.addEventListener('paste', e=>{

            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);

        });
        

    }


    copyToClipboard() {
        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();

    }



    // Método de inicialização
    initialize(){

        // Configuração inicial do display de data e hora
        this.setDisplayDateTime()

        // Atualização contínua da data e hora a cada segundo
        setInterval(()=>{
            this.setDisplayDateTime();
        }, 1000);

        // Configuração inicial do último número a ser exibido no display
        this.setLastNumberToDisplay();

        this.pasteFromClipboard();

    }

    initKeyboard(){

        document.addEventListener('keyup', e=>{

            switch (e.key) {
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':   
                case '*':
                case '/':
                case '%':     
                    this.addOperation(e.key);
                    break;
                
                case 'Enter':
                case '=':    
                    this.calc();
                    break;
                case '.':
                case ',':    
                    this.addDot();
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;

                case 'c':
                    if (e.ctrlKey) this.copyToClipboard();
                    break;
                    
            }

        });
    }

    // Método para adicionar eventos a um elemento para múltiplos eventos
    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        })
    }

    // Método para limpar toda a operação
    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();
    }

    // Método para apagar o último elemento da operação
    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    // Método para obter o último elemento da operação
    getLastOperation(){
        return this._operation[this._operation.length-1];
    }

    // Método para definir o valor do último elemento da operação
    setLastOperation(value){
        this._operation[this._operation.length-1] = value;
    }

    // Verifica se o valor é um operador
    isOperator(value){
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }

    // Adiciona um valor à operação
    pushOperation(value){
        this._operation.push(value);
        
        // Se houver mais de 3 elementos na operação, realiza o cálculo
        if (this._operation.length > 3) {
            this.calc();
        }
    }

    // Obtém o resultado da operação
    getResult(){


        return eval(this._operation.join(""));
    }

    // Realiza o cálculo
    calc(){
        let last = '';
        
        // Obtém o último operador
        this._lastOperator = this.getLastItem();

        // Se a operação tiver menos de 3 elementos, reorganiza para realizar o cálculo
        if (this._operation.length < 3) {
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        // Se houver mais de 3 elementos, obtém o último elemento e o resultado
        if (this._operation.length > 3) {
            last = this._operation.pop();
            this._lastNumber = this.getResult();
        } else if (this._operation.length == 3) {
            this._lastNumber = this.getLastItem(false);
        }
        
        // Realiza o cálculo final
        let result = this.getResult();

        if (last == '%') {
            result /= 100;
            this._operation = [result];
        } else {
            this._operation = [result];
            if (last) this._operation.push(last);
        }

        // Atualiza o último número no display
        this.setLastNumberToDisplay();
    }

    // Obtém o último item da operação
    getLastItem(isOperator = true){
        let lastItem;
        for (let i = this._operation.length-1; i >= 0; i--){
            if (this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }

        // Se não houver último item, retorna o último operador ou número
        if (!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    // Define o último número a ser exibido no display
    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false);
        if (!lastNumber) lastNumber = 0;
        this.displayCalc = lastNumber;
    }

    // Adiciona um valor à operação
    addOperation(value){
        // Se o último elemento da operação não for um número, verifica o tipo de valor
        if (isNaN(this.getLastOperation())) {
            if (this.isOperator(value)) {
                this.setLastOperation(value);
            }  else {
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
        } else {
            // Se o último elemento for um número, concatena o novo valor
            if (this.isOperator(value)){
                this.pushOperation(value);
            } else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);
                this.setLastNumberToDisplay();
            }
        }    

    }

    // Exibe mensagem de erro no display
    setError(){
        this.displayCalc = "Error";
    }

    addDot(){
        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');

        } else {
            this.setLastOperation(lastOperation.toString() + '.');

            this.setLastNumberToDisplay();  
        }

    }

    // Executa ação com base no botão clicado
    execBtn(value){
        switch (value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addDot();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;
        }
    }

    // Inicializa os eventos dos botões
    initButtonsEvents(){
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        buttons.forEach((btn, index)=>{
            this.addEventListenerAll(btn, "click drag", e => {
                let textBtn = btn.className.baseVal.replace("btn-","");
                this.execBtn(textBtn);
            })
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
            })
        })
    }

    // Atualiza a exibição da data e hora
    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    // Getter para o elemento de exibição do tempo
    get displayTime(){
        return this._timeEl.innerHTML;
    }

    // Setter para o elemento de exibição do tempo
    set displayTime(value){
        return this._timeEl.innerHTML = value;
    }

    // Getter para o elemento de exibição da data
    get displayDate(){
        return this._dateEl.innerHTML;
    }

    // Setter para o elemento de exibição da data
    set displayDate(value){
        return this._dateEl.innerHTML = value;
    }

    // Getter para o elemento de exibição do resultado da calculadora
    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }

    // Setter para o elemento de exibição do resultado da calculadora
    set displayCalc(value){
        this._displayCalcEl.innerHTML = value;
    }

    // Getter para a data atual
    get currentDate(){
        return new Date();
    }

    // Setter para a data atual
    set currentDate(value){
        this._currentDate = value;
    }
}
