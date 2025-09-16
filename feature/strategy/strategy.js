// --- The Strategy Interface (Conceptually) ---
// Each strategy must have a `calculateFee` method.

// --- Concrete Strategies ---
class StandardFee {
    calculateFee(amount) {
        return amount * 0.01; // 1% fee
    }
}

class PriorityFee {
    calculateFee(amount) {
        return amount * 0.03 + 5; // 3% fee + $5 flat fee
    }
}

class ExpressFee {
    calculateFee(amount) {
        return amount * 0.05 + 10; // 5% fee + $10 flat fee
    }
}

// --- The Context (The Transaction Processor) ---
class TransactionProcessor {
    constructor(strategy) {
        this.strategy = strategy;
    }

    // A method to dynamically set the strategy
    setStrategy(strategy) {
        this.strategy = strategy;
        console.log(`Strategy switched to: ${strategy.constructor.name}`);
    }

    // The main method that uses the strategy
    process(amount) {
        const fee = this.strategy.calculateFee(amount);
        const finalAmount = amount - fee;
        return { initialAmount: amount, fee, finalAmount };
    }
}

// --- Application Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Get DOM elements
    const amountInput = document.getElementById('amountInput');
    const processBtn = document.getElementById('processBtn');
    const strategyRadios = document.querySelectorAll('input[name="strategy"]');
    const initialAmountResult = document.getElementById('initialAmountResult');
    const feeResult = document.getElementById('feeResult');
    const finalAmountResult = document.getElementById('finalAmountResult');

    // 2. Initialize strategies and the context
    const standardStrategy = new StandardFee();
    const priorityStrategy = new PriorityFee();
    const expressStrategy = new ExpressFee();

    // Start with the standard strategy
    const transactionProcessor = new TransactionProcessor(standardStrategy);

    // 3. Add event listener for the button
    processBtn.addEventListener('click', () => {
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        // 4. Get the selected strategy from the radio buttons
        const selectedStrategyValue = document.querySelector('input[name="strategy"]:checked').value;
        
        switch (selectedStrategyValue) {
            case 'standard':
                transactionProcessor.setStrategy(standardStrategy);
                break;
            case 'priority':
                transactionProcessor.setStrategy(priorityStrategy);
                break;
            case 'express':
                transactionProcessor.setStrategy(expressStrategy);
                break;
        }

        // 5. Process the transaction using the selected strategy
        const result = transactionProcessor.process(amount);

        // 6. Display the results
        initialAmountResult.textContent = `$${result.initialAmount.toFixed(2)}`;
        feeResult.textContent = `$${result.fee.toFixed(2)}`;
        finalAmountResult.textContent = `$${result.finalAmount.toFixed(2)}`;

        // Little animation for flair
        animateResult(finalAmountResult);
    });

    function animateResult(element) {
        element.style.transition = 'none';
        element.style.transform = 'scale(1.1)';
        element.style.color = '#ff69b4';
        
        setTimeout(() => {
            element.style.transition = 'all 0.4s ease-out';
            element.style.transform = 'scale(1)';
            element.style.color = '#ff69b4'; // Keep the color
        }, 50);
    }
});