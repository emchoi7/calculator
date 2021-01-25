// Math Controller
const MathCtrl = (function() {

    const data = {
        operator: '',
        saved: '',
        input: '0',
        result: '',
        exceedLimit: false
    };

    return {
        getData: function() {
            return data
        },
        updateCurrInput: function(num) {
            if(data.result !== '') {
                data.operator = '';
                data.result = '';
                data.saved = '';
                data.exceedLimit = false;
                data.input = num;
            } else if(data.input === '0' && num !== '.') {
                if(num !== '0'){
                    data.input = num;
                }
            } else {
                // If less than the upper limit bounds (12 digits)
                if((data.input.length < 12 && data.input[0] !== '-') || (data.input.length < 13 && (data.input[0] === '-' || data.input.includes('.')))) {
                    if(num !== '.' || !data.input.includes('.')) {
                        data.input += num;
                    }
                }
            }
        },
        negateInput: function() {
            if(data.result !== '') {
                let result = parseFloat(data.result);
                result *= -1;
                data.saved = '';
                data.operator = '';
                data.result = '';
                data.exceedLimit = false;
                data.input = result.toString();
            } else {
                if(data.input !== '') {
                    let input = parseFloat(data.input);
                    input *= -1;
                    data.input = input.toString();
                } else {
                    data.input = '-' + data.saved;
                }
            }
        },
        resetInput: function() {
            if(data.input === '0') {
                data.saved = '';
                data.operator = '';
            } else {
                data.input = '0';
            }
        },
        setOperator: function(op) {
            data.operator = op;
            if(data.result !== '') {
                data.saved = data.result;
                data.input = '';
                data.result = '';
                data.exceedLimit = false;
            } else if(data.saved === '') {
                data.saved = data.input;
                data.input = '';
            }
            return data.operator;
        },
        calculate: function() {
            if(data.operator !== '') {
                const saved = parseFloat(data.saved);
                let input;
                if (data.input === '') {
                    input = saved;
                } else {
                    input = parseFloat(data.input);
                }
                let result;
                switch(data.operator) {
                    case "+":
                        result = saved + input;
                        break;
                    case '-':
                        result = saved - input;
                        break;
                    case '*':
                        result = saved * input;
                        break;
                    case '/':
                        result = saved / input;
                        break;
                    case '%':
                        result = saved % input;
                        break;
                } 
                if(result > 999999999999) {
                    result = 999999999999;
                    data.exceedLimit = true;
                } else if (result < -999999999999) {
                    result = -999999999999;
                    data.exceedLimit = true;
                }
                data.result = result.toString();
                if(data.result.includes('.') && (data.result.length > 12 || data.result.length > 13 && data.result[0] === '-')) {
                    const resultArr = data.result.split('.');
                    let wholeNumber = resultArr[0];
                    if(wholeNumber[0] === '-') {
                        wholeNumber = wholeNumber.substring(1, wholeNumber.length);
                    }
                    const allowedDecLen = 12 - wholeNumber.length;
                    const decNumber = resultArr[1].substring(0, allowedDecLen);

                    data.result = wholeNumber + '.' + decNumber;
                }
            } else if (data.operator === '') {
                const input = parseFloat(data.input);
                data.result = input.toString();
            }
        },
        deleteDigit: function() {
            if(data.input.length === 1) {
                data.input = '0';
            } else if(data.input !== '0') {
                data.input = data.input.substring(0, data.input.length - 1);
            }
        }
    }
})();

// UI Controller
const UICtrl = (function() {
    const UISelectors = {
        warning: '.warning',
        card: '.card',
        container: '.container',
        display: '#num-display',
        opDisplay: '#op-display',
        clearBtn: '#clear-btn',
        numBtns: '.num-btn',
        opsBtns: '.ops-btn'
    };
    const UIButtonIDs = {
        negBtn: 'neg-btn',
        '=': 'equals-btn',
        '.': '.-btn',
        '%': 'mod-btn',
        '/': 'div-btn',
        '*': 'mult-btn',
        '+': 'add-btn',
        '-': 'min-btn',
        '1': '1-btn',
        '2': '2-btn',
        '3': '3-btn',
        '4': '4-btn',
        '5': '5-btn',
        '6': '6-btn',
        '7': '7-btn',
        '8': '8-btn',
        '9': '9-btn',
        '0': '0-btn',
    }

    return {
        getSelectors: function() {
            return UISelectors;
        },
        getNumberIDs: function() {
            return UIButtonIDs;
        },
        updateDisplay: function(input) {
            let temp = '';
            let decimal = '';
            if(input.includes('.')) {
                const inputArr = input.split('.');
                if(inputArr[1] != '') {
                    decimal = inputArr[1];
                }
                input = inputArr[0];
            }
            if((input.length > 3 && input[0] !== '-') || (input.length > 4 && input[0] === '-')) {
                let abs;
                if(input[0] === '-') {
                    abs = input.substring(1, input.length);
                } else {
                    abs = input;
                }
                for(let i = 1; i <= abs.length; i++) {
                    temp += abs[abs.length - i];
                    if(i % 3 === 0) {
                        temp += ',';
                    }
                }
                if(temp[temp.length-1] === ',') {
                    temp = temp.substring(0, temp.length-1);
                }
                if(input[0] == '-') {
                    temp += '-';
                }
                temp = temp.split('').reverse().join('');
                if(decimal !== '') {
                    temp += '.' + decimal;
                }
            } else {
                if(decimal !== '') {
                    temp = input + '.' + decimal;
                } else {
                    temp = input;
                }
            }
            document.querySelector(UISelectors.display).textContent = temp;
        },
        showOperation: function(input, saved, operator) {
            let operation = '';
            if(input === '') {
                operation = saved + ' ' + operator;
            } else if (saved !== '') {
                operation = saved + ' ' + operator + ' ' + input + ' =';
            }
            document.querySelector(UISelectors.opDisplay).textContent = operation;
        },
        resetOperation: function(saved, input, operator) {
            if(saved === '') {
                document.querySelector(UISelectors.opDisplay).textContent = '';
            }
        },
        keypressButtonUpdate: function(key) {
            if(Object.keys(UIButtonIDs).includes(key)) {
                const button = document.getElementById(UIButtonIDs[key]);
                if(button.classList.contains('darken-2')){
                    button.classList.remove('darken-2');
                } else {
                    button.classList.add('darken-2');
                }
            }
        },
        toggleNegPos: function(input) {
            let negPos;
            if(input < 0) {
                negPos = 'POS';
            } else {
                negPos = 'NEG';
            }
            document.getElementById(UIButtonIDs.negBtn).textContent = negPos;
        },
        showWarning: function(msg) {
            const warningDiv = document.createElement('div');
            warningDiv.className = 'warning red center-align white-text';
            warningDiv.appendChild(document.createTextNode(msg));
            const card = document.querySelector(UISelectors.card);
            const container = document.querySelector(UISelectors.container);

            container.insertBefore(warningDiv, card);

            setTimeout(UICtrl.clearError, 3000);
        },
        clearError: function() {
            document.querySelector(UISelectors.warning).remove();
        }
    }
})();

// App Controller
const AppCtrl = (function() {

    const loadEventListeners = function() {
        const UISelectors = UICtrl.getSelectors();
        const UIButtonIDs = UICtrl.getNumberIDs();
        
        // Connect number buttons
        let numButtons = document.querySelectorAll(UISelectors.numBtns);
        numButtons = Array.from(numButtons);
        numButtons.forEach(function(btn) {
            btn.addEventListener('click', clickInput);
        });

        // Connect operator buttons
        let opButtons = document.querySelectorAll(UISelectors.opsBtns);
        opButtons = Array.from(opButtons);
        opButtons.forEach(function(btn) {
            btn.addEventListener('click', clickOperator);
        });

        // Connect equals button
        document.getElementById(UIButtonIDs['=']).addEventListener('click', equalsUpdate);

        // Connect neg/pos button
        document.getElementById(UIButtonIDs.negBtn).addEventListener('click', clickNegateInput);

        // Add keypress events
        document.addEventListener('keydown', keypressInput);

        // Add keyup events
        document.addEventListener('keyup', keyupUpdate);

        // Clear input
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearInput);
    }

    const keypressInput = function(e) {
        const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '1', '0'];
        const operators = ['+', '-', '/', '*', '%']
        // Show button response
        UICtrl.keypressButtonUpdate(e.key);

        // Update input
        if(digits.includes(e.key) || e.key === '.' || operators.includes(e.key) || e.key === 'Backspace') {
            if(digits.includes(e.key) || e.key === '.') {
                MathCtrl.updateCurrInput(e.key);
            } else if (operators.includes(e.key)) {
                MathCtrl.setOperator(e.key);
            } else if (e.key === 'Backspace') {
                MathCtrl.deleteDigit();
            }

            const {input, saved, operator} = MathCtrl.getData();

            if(input !== '') {
                UICtrl.updateDisplay(input);
            }
            if(operators.includes(e.key)) {
                UICtrl.showOperation(input, saved, operator);
            }
        } else if (e.key === '=') {
            equalsUpdate(e);
        }

        e.preventDefault();
    }

    const equalsUpdate = function(e) {
        const {input, saved, operator} = MathCtrl.getData();
        UICtrl.showOperation(input, saved, operator);
        MathCtrl.calculate();
        const {result, exceedLimit} = MathCtrl.getData();
        if(exceedLimit) {
            UICtrl.showWarning('Result exceeds the maximum number of digits');
        }
        UICtrl.updateDisplay(result);
        UICtrl.toggleNegPos(result);

        e.preventDefault();
    }

    const keyupUpdate = function(e) {
        UICtrl.keypressButtonUpdate(e.key);

        e.preventDefault();
    }

    const clickNegateInput = function(e) {
        MathCtrl.negateInput();
        const {input} = MathCtrl.getData();
        UICtrl.updateDisplay(input);
        UICtrl.toggleNegPos(input);
        e.preventDefault();
    }

    const clickInput = function(e) {
        const num = e.target.id[0];

        // Add to current input
        MathCtrl.updateCurrInput(num);

        let {input} = MathCtrl.getData();

        // Show on display
        UICtrl.updateDisplay(input);

        e.preventDefault();
    }

    const clickOperator = function(e) {
        MathCtrl.setOperator(e.target.textContent);
        const {input, saved, operator} = MathCtrl.getData();
        UICtrl.showOperation(input, saved, operator);

        e.preventDefault();
    }

    const clearInput = function(e) {
        // Set current input to 0
        MathCtrl.resetInput();
        const {saved, input} = MathCtrl.getData();

        // Show on display
        UICtrl.updateDisplay(input);
        UICtrl.resetOperation(saved, input);

        e.preventDefault();
    }

    return {
        init: function() {
            loadEventListeners();

            // Update input display
            const input = MathCtrl.getData().input;
            UICtrl.updateDisplay(input);
        }
    }
})(UICtrl, MathCtrl);

AppCtrl.init();