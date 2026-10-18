import express from 'express';
import mongoose from 'mongoose';
import Expense from '../models/Expense.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({
      date: -1,
      createdAt: -1,
    });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    const categories = [
      'Food', 'Travel', 'Shopping', 'Education',
      'Bills', 'Health', 'Entertainment', 'Other',
    ];

    if (
      typeof title !== 'string' ||
      !title.trim() ||
      title.trim().length > 100 ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !categories.includes(category) ||
      typeof date !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(Date.parse(date)) ||
      new Date(date).toISOString().slice(0, 10) !== date
    ) {
      return res.status(400).json({
        message: 'Please provide valid expense details',
      });
    }

    const expense = await Expense.create({
      title: title.trim(),
      amount,
      category,
      date: new Date(`${date}T12:00:00.000Z`),
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save expense' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid expense ID' });
    }

    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete expense' });
  }
});

export default router;
