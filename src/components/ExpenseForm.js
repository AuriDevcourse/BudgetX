import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Typography,
  MenuItem,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addTransaction } from '../utils/dataPersistence';

const EXPENSE_CATEGORIES = [
  'Groceries',
  'Rent',
  'Utilities',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Other',
];

const ExpenseForm = ({ walletId, onExpenseAdded }) => {
  const [expense, setExpense] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date(),
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!expense.amount || !expense.description || !expense.category) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const transactionData = {
        type: 'expense',
        amount: -Math.abs(parseFloat(expense.amount)), // Ensure negative for expenses
        description: expense.description,
        category: expense.category,
        date: expense.date.toISOString(),
        walletId,
        createdAt: new Date().toISOString(),
      };

      await addTransaction(transactionData);
      
      setExpense({
        amount: '',
        description: '',
        category: '',
        date: new Date(),
      });

      if (onExpenseAdded) {
        onExpenseAdded(transactionData);
      }
    } catch (err) {
      setError('Failed to add expense. Please try again.');
      console.error('Error adding expense:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Add Expense
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Amount"
              type="number"
              value={expense.amount}
              onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
              fullWidth
              required
              inputProps={{ min: "0", step: "0.01" }}
            />
            <TextField
              label="Description"
              value={expense.description}
              onChange={(e) => setExpense({ ...expense, description: e.target.value })}
              fullWidth
              required
            />
            <TextField
              select
              label="Category"
              value={expense.category}
              onChange={(e) => setExpense({ ...expense, category: e.target.value })}
              fullWidth
              required
            >
              {EXPENSE_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={expense.date}
                onChange={(newDate) => setExpense({ ...expense, date: newDate })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Adding Expense...' : 'Add Expense'}
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
