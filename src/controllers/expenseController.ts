import { Request, Response } from 'express';
import { Expense } from '../models/Expense';
import { ExpenseService } from '../services/expenseService';

const expenseService = new ExpenseService();

export const createExpense = async (req: Request, res: Response) => {
    const expense: Expense = req.body;
    const newExpense = await expenseService.create(expense);
    return res.status(201).json(newExpense);
};

export const getExpenses = async (req: Request, res: Response) => {
    const expenses = await expenseService.getAll();
    return res.json(expenses);
};

export const getExpenseById = async (req: Request, res: Response) => {
    const expense = await expenseService.getById(parseInt(req.params.id));
    if (!expense) return res.status(404).send('Expense not found');
    return res.json(expense);
};

export const updateExpense = async (req: Request, res: Response) => {
    const updatedExpense = await expenseService.update(parseInt(req.params.id), req.body);
    if (!updatedExpense) return res.status(404).send('Expense not found');
    return res.json(updatedExpense);
};

export const deleteExpense = async (req: Request, res: Response) => {
    const result = await expenseService.delete(parseInt(req.params.id));
    if (!result) return res.status(404).send('Expense not found');
    return res.status(204).send();
};
