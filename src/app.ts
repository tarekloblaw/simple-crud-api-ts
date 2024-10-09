import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Expense } from './models/Expense';
import fs from 'fs-extra';
import path from 'path';

const app = express();
const port = 3000;
const filePath = path.join(__dirname, 'expenses.json');

app.use(bodyParser.json());

let expenses: Expense[] = [];

// Load existing expenses from file
const loadExpenses = async () => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        expenses = JSON.parse(data);
    } catch (err) {
        console.error('Error reading expenses file:', err);
        expenses = [];
    }
};

// Save expenses to file
const saveExpenses = async () => {
    try {
        await fs.writeFile(filePath, JSON.stringify(expenses, null, 2));
    } catch (err) {
        console.error('Error writing to expenses file:', err);
    }
};

loadExpenses();

// CREATE
app.post('/expenses', async (req: Request, res: Response) => {
    const { date, title, amount } = req.body;
    const expense: Expense = {
        id: expenses.length + 1,
        date,
        title,
        amount,
    };
    expenses.push(expense);
    await saveExpenses();
    return res.status(201).json(expense);
});

// READ ALL
app.get('/expenses', (req: Request, res: Response) => {
    return res.json(expenses);
});

// READ ONE
app.get('/expenses/:id', (req: Request, res: Response) => {
    const expense = expenses.find(e => e.id === parseInt(req.params.id));
    if (!expense) return res.status(404).send('Expense not found');
    return res.json(expense);
});

// UPDATE
app.put('/expenses/:id', async (req: Request, res: Response) => {
    const expense = expenses.find(e => e.id === parseInt(req.params.id));
    if (!expense) return res.status(404).send('Expense not found');

    const { date, title, amount } = req.body;
    expense.date = date;
    expense.title = title;
    expense.amount = amount;
    await saveExpenses();
    return res.json(expense);
});

// DELETE
app.delete('/expenses/:id', async (req: Request, res: Response) => {
    const expenseIndex = expenses.findIndex(e => e.id === parseInt(req.params.id));
    if (expenseIndex === -1) return res.status(404).send('Expense not found');

    expenses.splice(expenseIndex, 1);
    await saveExpenses();
    return res.status(204).send();
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
