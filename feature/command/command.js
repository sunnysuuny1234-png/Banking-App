// --- The Receiver (The Bank Account) ---
class BankAccount {
    constructor(initialBalance = 0) {
        this.balance = initialBalance;
    }

    deposit(amount) {
        if (amount > 0) {
            this.balance += amount;
            return true;
        }
        return false;
    }

    withdraw(amount) {
        if (amount > 0 && this.balance >= amount) {
            this.balance -= amount;
            return true;
        }
        return false;
    }
}

// --- The Command Interface (Conceptually) ---
// Each command must have an `execute` and an `undo` method.

// --- Concrete Commands ---
class DepositCommand {
    constructor(account, amount) {
        this.account = account;
        this.amount = amount;
    }

    execute() {
        console.log(`Executing Deposit Command: $${this.amount}`);
        return this.account.deposit(this.amount);
    }

    undo() {
        console.log(`Undoing Deposit Command: -$${this.amount}`);
        this.account.withdraw(this.amount);
    }
}

class WithdrawCommand {
    constructor(account, amount) {
        this.account = account;
        this.amount = amount;
    }

    execute() {
        console.log(`Executing Withdraw Command: -$${this.amount}`);
        return this.account.withdraw(this.amount);
    }

    undo() {
        console.log(`Undoing Withdraw Command: +$${this.amount}`);
        this.account.deposit(this.amount);
    }
}

// --- The Invoker (The Command History/Manager) ---
class CommandManager {
    constructor() {
        this.history = [];
        this.currentPosition = -1;
    }

    executeCommand(command) {
        if (command.execute()) {
            // Clear future history if a new command is executed
            this.history = this.history.slice(0, this.currentPosition + 1);
            this.history.push(command);
            this.currentPosition++;
            return true;
        }
        return false;
    }

    undo() {
        if (this.currentPosition >= 0) {
            const command = this.history[this.currentPosition];
            command.undo();
            this.currentPosition--;
            return true;
        }
        return false;
    }

    redo() {
        if (this.currentPosition < this.history.length - 1) {
            this.currentPosition++;
            const command = this.history[this.currentPosition];
            command.execute();
            return true;
        }
        return false;
    }
}

// --- Application Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize the Receiver and the Invoker
    const bankAccount = new BankAccount(1000);
    const commandManager = new CommandManager();

    // 2. Get DOM elements
    const balanceDisplay = document.getElementById('balanceDisplay');
    const amountInput = document.getElementById('amountInput');
    const depositBtn = document.getElementById('depositBtn');
    const withdrawBtn = document.getElementById('withdrawBtn');
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const logList = document.getElementById('logList');

    // 3. Update the UI
    const updateUI = () => {
        balanceDisplay.textContent = bankAccount.balance.toFixed(2);
        undoBtn.disabled = commandManager.currentPosition < 0;
        redoBtn.disabled = commandManager.currentPosition >= commandManager.history.length - 1;
    };

    const addLogEntry = (message, type) => {
        const li = document.createElement('li');
        li.textContent = message;
        li.classList.add(type);
        logList.prepend(li);
        if (logList.children.length > 10) {
            logList.removeChild(logList.lastChild);
        }
    };

    // 4. Event Listeners for action buttons
    depositBtn.addEventListener('click', () => {
        const amount = parseFloat(amountInput.value);
        if (!isNaN(amount) && amount > 0) {
            const command = new DepositCommand(bankAccount, amount);
            if (commandManager.executeCommand(command)) {
                addLogEntry(`Deposited $${amount.toFixed(2)}`, 'deposit');
            }
            updateUI();
        }
    });

    withdrawBtn.addEventListener('click', () => {
        const amount = parseFloat(amountInput.value);
        if (!isNaN(amount) && amount > 0) {
            const command = new WithdrawCommand(bankAccount, amount);
            if (commandManager.executeCommand(command)) {
                addLogEntry(`Withdrew $${amount.toFixed(2)}`, 'withdraw');
            }
            updateUI();
        }
    });

    // 5. Event Listeners for history buttons
    undoBtn.addEventListener('click', () => {
        if (commandManager.undo()) {
            addLogEntry(`Undid last action`, 'undo');
            updateUI();
        }
    });

    redoBtn.addEventListener('click', () => {
        if (commandManager.redo()) {
            addLogEntry(`Redid last action`, 'redo');
            updateUI();
        }
    });

    // Initial UI update
    updateUI();
});