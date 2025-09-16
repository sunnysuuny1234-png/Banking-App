// --- The Subject (The Bank Account) ---
class BankAccount {
    constructor(initialBalance = 0) {
        this.balance = initialBalance;
        this.observers = [];
    }

    // A method to register a new observer
    addObserver(observer) {
        this.observers.push(observer);
        console.log(`${observer.name} is now subscribed.`);
    }

    // A method to notify all observers
    notifyObservers() {
        console.log(`--- Notifying all observers of a balance change ---`);
        this.observers.forEach(observer => {
            observer.update(this.balance);
        });
    }

    // A method to change the state (the balance)
    deposit(amount) {
        if (amount > 0) {
            this.balance += amount;
            console.log(`Deposit successful! New balance: $${this.balance.toFixed(2)}`);
            this.notifyObservers();
        }
    }

    withdraw(amount) {
        if (amount > 0 && this.balance >= amount) {
            this.balance -= amount;
            console.log(`Withdrawal successful! New balance: $${this.balance.toFixed(2)}`);
            this.notifyObservers();
        } else {
            console.log(`Withdrawal failed. Insufficient funds or invalid amount.`);
        }
    }
}

// --- The Observers (The Planet Terminals) ---
class PlanetTerminal {
    constructor(name, displayElement) {
        this.name = name;
        this.displayElement = displayElement;
    }

    // The update method that the subject will call
    update(newBalance) {
        console.log(`*${this.name}* received a balance update!`);
        this.displayElement.textContent = `$${newBalance.toFixed(2)}`;
        this.animateUpdate();
    }

    // A little animation to make it more creative
    animateUpdate() {
        this.displayElement.style.transition = 'none';
        this.displayElement.style.transform = 'scale(1.2)';
        this.displayElement.style.color = '#ffeb3b';
        
        setTimeout(() => {
            this.displayElement.style.transition = 'all 0.5s ease-out';
            this.displayElement.style.transform = 'scale(1)';
            this.displayElement.style.color = '#e0e0ff';
        }, 100);
    }
}

// --- Application Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Create the Subject (the Bank Account)
    const bankAccount = new BankAccount(1000);

    // 2. Get the DOM elements
    const balanceDisplay = document.getElementById('balance');
    const depositBtn = document.getElementById('depositBtn');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const amountInput = document.getElementById('amount');

    const earthDisplay = document.querySelector('#earth .display-balance');
    const marsDisplay = document.querySelector('#mars .display-balance');
    const jupiterDisplay = document.querySelector('#jupiter .display-balance');

    // 3. Create the Observers (the Planet Terminals)
    const earthTerminal = new PlanetTerminal('Earth', earthDisplay);
    const marsTerminal = new PlanetTerminal('Mars', marsDisplay);
    const jupiterTerminal = new PlanetTerminal('Jupiter', jupiterDisplay);

    // 4. Register the observers with the subject
    bankAccount.addObserver(earthTerminal);
    bankAccount.addObserver(marsTerminal);
    bankAccount.addObserver(jupiterTerminal);

    // 5. Initial update for all displays
    balanceDisplay.textContent = bankAccount.balance.toFixed(2);
    bankAccount.notifyObservers();

    // 6. Add event listeners to the buttons
    depositBtn.addEventListener('click', () => {
        const amount = parseFloat(amountInput.value);
        if (!isNaN(amount) && amount > 0) {
            bankAccount.deposit(amount);
            balanceDisplay.textContent = bankAccount.balance.toFixed(2);
            amountInput.value = '';
        }
    });

    withdrawBtn.addEventListener('click', () => {
        const amount = parseFloat(amountInput.value);
        if (!isNaN(amount) && amount > 0) {
            bankAccount.withdraw(amount);
            balanceDisplay.textContent = bankAccount.balance.toFixed(2);
            amountInput.value = '';
        }
    });
});