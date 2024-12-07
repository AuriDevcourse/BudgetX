import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  MenuItem,
  TextField,
  Box,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getWallets, getTransactions } from '../utils/dataPersistence';
import { formatCurrency } from '../utils/currencyConverter';

const COLORS = [
  '#D4E157', // Light Lime Green
  '#AFB42B', // Dark Lime Green
  '#9E9E9E', // Medium Gray
  '#616161', // Dark Gray
  '#F5F5F5', // Light Gray
  '#81C784', // Light Green
  '#4CAF50', // Green
  '#FF8A65', // Light Red
  '#FF5722', // Deep Orange
];

const Summary = ({ userId }) => {
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [expensesByCategory, setExpensesByCategory] = useState([]);

  useEffect(() => {
    loadWallets();
  }, [userId]);

  useEffect(() => {
    if (selectedWallet) {
      loadTransactions();
    } else {
      setTransactions([]);
      setExpensesByCategory([]);
    }
  }, [selectedWallet]);

  const loadWallets = async () => {
    try {
      const userWallets = await getWallets(userId);
      setWallets(userWallets);
      if (!selectedWallet && userWallets.length > 0) {
        setSelectedWallet(userWallets[0]);
      }
    } catch (error) {
      console.error('Error loading wallets:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const walletTransactions = await getTransactions(selectedWallet.id);
      setTransactions(walletTransactions);
      calculateExpensesByCategory(walletTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const calculateExpensesByCategory = (transactionList) => {
    const expenses = transactionList
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const category = transaction.category || 'Other';
        // Use absolute value for display
        acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
        return acc;
      }, {});

    const data = Object.entries(expenses).map(([name, value], index) => ({
      name,
      value: Math.abs(value), // Ensure positive values for pie chart
      color: COLORS[index % COLORS.length],
    }));

    setExpensesByCategory(data);
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = Math.abs(transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card sx={{ p: 1, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography variant="body2">{data.name}</Typography>
          <Typography variant="body2" color="primary">
            {formatCurrency(data.value, selectedWallet?.currency)}
          </Typography>
        </Card>
      );
    }
    return null;
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          select
          label="Select Wallet"
          value={selectedWallet?.id || ''}
          onChange={(e) => {
            const wallet = wallets.find(w => w.id === e.target.value);
            setSelectedWallet(wallet);
          }}
          fullWidth
        >
          {wallets.map((wallet) => (
            <MenuItem key={wallet.id} value={wallet.id}>
              {wallet.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Balance Summary
            </Typography>
            <Typography variant="body1" color="success.main">
              Total Income: {formatCurrency(totalIncome, selectedWallet?.currency)}
            </Typography>
            <Typography variant="body1" color="error.main">
              Total Expenses: {formatCurrency(totalExpenses, selectedWallet?.currency)}
            </Typography>
            <Typography variant="body1" color="primary">
              Net Balance: {formatCurrency(totalIncome - totalExpenses, selectedWallet?.currency)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Expenses by Category
            </Typography>
            {expensesByCategory.length > 0 ? (
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => entry.name}
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                No expense data available
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Summary;
