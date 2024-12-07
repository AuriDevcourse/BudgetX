import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Typography,
} from '@mui/material';

const IncomeForm = ({ onAddIncome }) => {
  const [income, setIncome] = useState({
    amount: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!income.amount || !income.description) return;
    
    onAddIncome({
      ...income,
      amount: parseFloat(income.amount),
      id: Date.now(),
    });
    
    setIncome({ amount: '', description: '' });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Add Income
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Amount"
              type="number"
              value={income.amount}
              onChange={(e) => setIncome({ ...income, amount: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={income.description}
              onChange={(e) => setIncome({ ...income, description: e.target.value })}
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Add Income
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};

export default IncomeForm;
