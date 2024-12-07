import React, { useState } from 'react';
import {
  Container,
  Box,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import Wallets from '../components/Wallets';
import Calendar from '../components/Calendar';
import Averages from '../components/Averages';
import Summary from '../components/Summary';

function TabPanel({ children, value, index }) {
  return (
    <Box hidden={value !== index} sx={{ py: 3 }}>
      {value === index && children}
    </Box>
  );
}

const Dashboard = ({ userId }) => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedWallet, setSelectedWallet] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleWalletSelect = (wallet) => {
    setSelectedWallet(wallet);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Tab label="Summary" />
            <Tab label="Wallets" />
            <Tab label="Calendar" />
            <Tab label="Averages" />
          </Tabs>
        </Paper>

        <TabPanel value={tabValue} index={0}>
          <Summary
            userId={userId}
            selectedWallet={selectedWallet}
            onWalletSelect={handleWalletSelect}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Wallets
            userId={userId}
            onWalletSelect={handleWalletSelect}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {selectedWallet && (
            <Calendar
              walletId={selectedWallet.id}
              currency={selectedWallet.currency}
            />
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {selectedWallet && (
            <Averages
              walletId={selectedWallet.id}
              currency={selectedWallet.currency}
            />
          )}
        </TabPanel>
      </Box>
    </Container>
  );
};

export default Dashboard;
