import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Stack,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, AddCircle as AddExpenseIcon } from '@mui/icons-material';
import { AVAILABLE_CURRENCIES } from '../utils/currencyConverter';
import { createWallet, getWallets, updateWallet, deleteWallet } from '../utils/dataPersistence';
import ExpenseForm from './ExpenseForm';

const Wallets = ({ userId }) => {
  const [wallets, setWallets] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openExpenseDialog, setOpenExpenseDialog] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    currency: 'DKK',
    initialBalance: '',
  });

  useEffect(() => {
    loadWallets();
  }, [userId]);

  const loadWallets = async () => {
    try {
      const userWallets = await getWallets(userId);
      setWallets(userWallets);
    } catch (error) {
      console.error('Error loading wallets:', error);
    }
  };

  const handleOpenDialog = (wallet = null) => {
    if (wallet) {
      setFormData({
        name: wallet.name,
        currency: wallet.currency,
        initialBalance: wallet.initialBalance,
      });
      setSelectedWallet(wallet);
    } else {
      setFormData({
        name: '',
        currency: 'DKK',
        initialBalance: '',
      });
      setSelectedWallet(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWallet(null);
    setFormData({
      name: '',
      currency: 'DKK',
      initialBalance: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (selectedWallet) {
        await updateWallet(selectedWallet.id, formData);
      } else {
        await createWallet({
          ...formData,
          userId,
          initialBalance: parseFloat(formData.initialBalance),
        });
      }
      handleCloseDialog();
      loadWallets();
    } catch (error) {
      console.error('Error saving wallet:', error);
    }
  };

  const handleDelete = async (walletId) => {
    if (window.confirm('Are you sure you want to delete this wallet?')) {
      try {
        await deleteWallet(walletId);
        loadWallets();
      } catch (error) {
        console.error('Error deleting wallet:', error);
      }
    }
  };

  const handleOpenExpenseDialog = (wallet) => {
    setSelectedWallet(wallet);
    setOpenExpenseDialog(true);
  };

  const handleCloseExpenseDialog = () => {
    setOpenExpenseDialog(false);
    setSelectedWallet(null);
  };

  const handleExpenseAdded = async () => {
    handleCloseExpenseDialog();
    await loadWallets(); // Refresh wallets to show updated balance
  };

  return (
    <div>
      <Grid container spacing={2}>
        {wallets.map((wallet) => (
          <Grid item xs={12} sm={6} md={4} key={wallet.id}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                  <Typography variant="h6">{wallet.name}</Typography>
                  <div>
                    <IconButton onClick={() => handleOpenExpenseDialog(wallet)} color="primary" title="Add Expense">
                      <AddExpenseIcon />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDialog(wallet)} color="primary" title="Edit Wallet">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(wallet.id)} color="error" title="Delete Wallet">
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </Stack>
                <Typography color="textSecondary">
                  Balance: {wallet.currency} {wallet.initialBalance}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            onClick={() => handleOpenDialog(null)}
          >
            <CardContent>
              <Stack alignItems="center" spacing={1}>
                <AddIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography color="primary">Add Wallet</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Wallet Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedWallet ? 'Edit Wallet' : 'Add Wallet'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Wallet Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              select
              label="Currency"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              fullWidth
              required
            >
              {AVAILABLE_CURRENCIES.map((currency) => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Initial Balance"
              type="number"
              value={formData.initialBalance}
              onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
              fullWidth
              required
              inputProps={{ step: "0.01" }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedWallet ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Expense Dialog */}
      <Dialog open={openExpenseDialog} onClose={handleCloseExpenseDialog} maxWidth="sm" fullWidth>
        <DialogContent>
          <ExpenseForm walletId={selectedWallet?.id} onExpenseAdded={handleExpenseAdded} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExpenseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Wallets;
