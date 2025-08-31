const digitButtons = document.querySelectorAll(".number"); 
const operatorButtons = document.querySelectorAll(".operator"); 
const displayLines = document.querySelectorAll(".display p"); 
const equalsButton = document.querySelector(".equal"); 
const clearAllButton = document.querySelector(".clearall"); 
const backspaceButton = document.querySelector("#backspace"); 
const decimalButton = document.querySelector('#dot'); 

let firstOperand, secondOperand, currentOperator, calculationResult;


const operations = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => a / b,
  "%": (a, b) => (a / 100) * b
};

// -------------------- Functions --------------------

function setOperator(input) { 
    currentOperator = input;
};

// Capture operands for calculation
function setOperand() {
    if (firstOperand == null) {
        firstOperand = Number(displayLines[1].textContent) ?? null;
    } else if (secondOperand == null) {
        secondOperand = Number(displayLines[1].textContent) ?? null;
        calculateResult();
        setOperator(null); // reset operator after calculation
    }
};

// Perform calculation 
function calculateResult(){
    calculationResult = roundToEightDecimals(
        operations[currentOperator](firstOperand, secondOperand)
    ) ?? null;
    console.log(calculationResult ?? "Calculation error");
};

// Limit decimals to a maximum of 8 digits
function roundToEightDecimals(num) {
    if (num % 1 !== 0) {
        const decimal = num.toString().split(".")[1] || "";
        if (decimal.length > 8) {
            return Number(num.toFixed(8));
        }
    }
    return num;
}

// Reset operands
function resetOperands() {
    firstOperand = null;
    secondOperand = null;
}

// Allow chaining operations (use result as next operand)
function prepareNextOperation() {
    if (calculationResult) {
        firstOperand = calculationResult;
        secondOperand = null;
    }
};

// Update display (clear, append input, or show result)
function updateDisplay(input,index){  
    if(input === "clearEntry"){
        displayLines[index].textContent = "";
        return;
    }

    if(input === "clearAll"){
        resetOperands();
        displayLines.forEach(element => element.textContent = "");
        return;
    }

    if(input === "newLine"){
        displayLines[0].textContent = `${firstOperand}${currentOperator}`;
        displayLines[1].textContent = "";
        return;
    }
    displayLines[index].textContent += input;
};

// -------------------- Event Listeners --------------------

// Decimal point button
decimalButton.addEventListener("click", () => { 
    if (!displayLines[1].textContent.includes(".")) {
        updateDisplay(decimalButton.textContent,1);
    }
});

// Backspace button
backspaceButton.addEventListener("click", () => {
    displayLines[1].textContent = displayLines[1].textContent.slice(0, -1);
});

// Clear all button
clearAllButton.addEventListener("click", () => {
    calculationResult = null;
    updateDisplay("clearAll"); 
});

// Number buttons
digitButtons.forEach(button => {
    button.addEventListener("click", () => {
        updateDisplay(button.textContent,1);
    });    
});

// Operator buttons
operatorButtons.forEach(operator => {
    operator.addEventListener("click",() => {
        setOperand();
        setOperator(operator.textContent);
        prepareNextOperation();
        updateDisplay("newLine");
    });
});

// Equals button
equalsButton.addEventListener("click", () => {
    setOperand();
    updateDisplay("clearAll");
    updateDisplay(calculationResult, 1);
});
