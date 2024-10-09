import fs from 'fs-extra';
import path from 'path';
import { Expense } from '../models/Expense';

const filePath = path.join(__dirname, '../data/expenses.json');

export class ExpenseService {
    private expenses: Expense[] = [];

    constructor() {
        this.loadExpenses();
    }

    private async loadExpenses() {
        try {
            const data = await fs.readFile(filePath, 'utf8');
            this.expenses = JSON.parse(data);
        } catch (err) {
            console.error('Error reading expenses file:', err);
            this.expenses = [];
        }
    }

    private async saveExpenses() {
        try {
            await fs.writeFile(filePath, JSON.stringify(this.expenses, null, 2));
        } catch (err) {
            console.error('Error writing to expenses file:', err);
        }
    }

    async create(expense: Expense): Promise<Expense> {
        expense.id = this.expenses.length + 1;
        this.expenses.push(expense);
        await this.saveExpenses();
        return expense;
    }

    async getAll(): Promise<Expense[]> {
        return this.expenses;
    }

    async getById(id: number): Promise<Expense | undefined> {
        return this.expenses.find(e => e.id === id);
    }

    async update(id: number, updatedData: Partial<Expense>): Promise<Expense | undefined> {
        const expense = this.expenses.find(e => e.id === id);
        if (!expense) return undefined;

        Object.assign(expense, updatedData);
        await this.saveExpenses();
        return expense;
    }

    async delete(id: number): Promise<boolean> {
        const index = this.expenses.findIndex(e => e.id === id);
        if (index === -1) return false;

        this.expenses.splice(index, 1);
        await this.saveExpenses();
        return true;
    }
}
