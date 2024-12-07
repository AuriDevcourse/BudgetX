import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { calculateMonthlyAverages } from '../utils/dataPersistence';
import { formatCurrency } from '../utils/currencyConverter';

const Averages = ({ walletId, currency }) => {
  const [averages, setAverages] = useState({
    averageIncome: 0,
    averageExpenses: 0,
    monthlyData: {},
  });

  useEffect(() => {
    loadAverages();
  }, [walletId]);

  const loadAverages = async () => {
    try {
      const data = await calculateMonthlyAverages(walletId);
      setAverages(data);
    } catch (error) {
      console.error('Error loading averages:', error);
    }
  };

  const prepareChartData = () => {
    return Object.entries(averages.monthlyData).map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      savings: data.income - data.expenses,
    }));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Monthly Averages
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" color="success.main">
                Average Income: {formatCurrency(averages.averageIncome, currency)}
              </Typography>
              <Typography variant="subtitle1" color="error.main">
                Average Expenses: {formatCurrency(averages.averageExpenses, currency)}
              </Typography>
              <Typography variant="subtitle1" color="primary">
                Average Savings:{' '}
                {formatCurrency(
                  averages.averageIncome - averages.averageExpenses,
                  currency
                )}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Monthly Trends
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={prepareChartData()}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatCurrency(value, currency)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#4CAF50"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#f44336"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="savings"
                    stroke="#2196F3"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Averages;
