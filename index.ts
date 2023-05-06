#!/usr/bin/env node 
import inquirer from 'inquirer';

interface User {
  name: string;
  accountNumber: string;
  balance: number;
}

class Transaction {
  static transactionIdCounter = 1;
  id: number;
  amount: number;
  type: string;
  constructor(amount: number, type: string) {
    this.id = Transaction.transactionIdCounter++;
    this.amount = amount;
    this.type = type;
  }
}

const users: User[] = [
  { name: 'John Doe', accountNumber: '1234', balance: 1000 },
  { name: 'Jane Doe', accountNumber: '5678', balance: 500 },
];

class Bank {
  static getUser(accountNumber: string): User | undefined {
    return users.find((user) => user.accountNumber === accountNumber);
  }

  static getBalance(accountNumber: string): void {
    const user = Bank.getUser(accountNumber);
    if (user) {
      console.log(`Your balance is $${user.balance}`);
    } else {
      console.log(`No user found with account number ${accountNumber}`);
    }
  }

  static addFunds(accountNumber: string, amount: number, type: string): void {
    const user = Bank.getUser(accountNumber);
    if (user) {
      user.balance += amount;
      console.log(`$${amount} added to your account. Your new balance is $${user.balance}`);
      Bank.addTransaction(accountNumber, amount, type);
    } else {
      console.log(`No user found with account number ${accountNumber}`);
    }
  }

  static addTransaction(accountNumber: string, amount: number, type: string): void {
    const user = Bank.getUser(accountNumber);
    if (user) {
      const transaction = new Transaction(amount, type);
      console.log(`Transaction successful. Transaction ID: ${transaction.id}`);
    } else {
      console.log(`No user found with account number ${accountNumber}`);
    }
  }
}

inquirer
  .prompt([
    {
      type: 'input',
      name: 'accountNumber',
      message: 'Enter your account number:',
    },
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: ['Get balance', 'Add funds'],
    },
    {
      type: 'list',
      name: 'type',
      message: 'Choose transaction type:',
      choices: ['Check', 'Online'],
      when: (answers) => answers.action === 'Add funds',
    },
    {
      type: 'input',
      name: 'amount',
      message: 'Enter the amount to add to your account:',
      when: (answers) => answers.action === 'Add funds',
    },
  ])
  .then((answers) => {
    const { accountNumber, action, type, amount } = answers;
    if (action === 'Get balance') {
      Bank.getBalance(accountNumber);
    } else if (action === 'Add funds') {
      Bank.addFunds(accountNumber, parseInt(amount, 10), type);
    }
  });