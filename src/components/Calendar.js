import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
} from '@mui/material';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format';
import { 
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths 
} from 'date-fns';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { getTransactions } from '../utils/dataPersistence';
import { formatCurrency } from '../utils/currencyConverter';

const Calendar = ({ walletId, currency }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);
  const [dailyTransactions, setDailyTransactions] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, [walletId]);

  useEffect(() => {
    filterDailyTransactions();
  }, [selectedDate, transactions]);

  const loadTransactions = async () => {
    try {
      const walletTransactions = await getTransactions(walletId);
      setTransactions(walletTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const filterDailyTransactions = () => {
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    const filtered = transactions.filter(
      (transaction) => format(new Date(transaction.date), 'yyyy-MM-dd') === selectedDateStr
    );
    setDailyTransactions(filtered);
  };

  const getDayTransactionsCount = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return transactions.filter(
      (transaction) => format(new Date(transaction.date), 'yyyy-MM-dd') === dateStr
    ).length;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <DateCalendar
                value={selectedDate}
                onChange={setSelectedDate}
                renderDay={(day, _value, DayComponentProps) => {
                  const transactionsCount = getDayTransactionsCount(day);
                  return (
                    <Box
                      sx={{
                        position: 'relative',
                        ...DayComponentProps.sx,
                      }}
                    >
                      {DayComponentProps.children}
                      {transactionsCount > 0 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 2,
                            right: 2,
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                          }}
                        />
                      )}
                    </Box>
                  );
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transactions for {format(selectedDate, 'MMMM d, yyyy')}
              </Typography>
              {dailyTransactions.length > 0 ? (
                <List>
                  {dailyTransactions.map((transaction) => (
                    <ListItem key={transaction.id}>
                      <ListItemIcon>
                        {transaction.type === 'income' ? (
                          <ArrowUpward color="success" />
                        ) : (
                          <ArrowDownward color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={transaction.description}
                        secondary={transaction.category}
                      />
                      <Typography
                        color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                      >
                        {formatCurrency(transaction.amount, currency)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary" align="center">
                  No transactions for this date
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default Calendar;
