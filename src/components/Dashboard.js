import React, { useState } from 'react';
import {
  Box,
  Tab,
  Tabs,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalanceWallet as WalletIcon,
  CalendarToday as CalendarIcon,
  ShowChart as ChartIcon,
} from '@mui/icons-material';

import Summary from './Summary';
import Wallets from './Wallets';
import Calendar from './Calendar';
import Averages from './Averages';

const Dashboard = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const tabs = [
    { label: 'Summary', icon: <DashboardIcon />, component: <Summary /> },
    { label: 'Wallets', icon: <WalletIcon />, component: <Wallets /> },
    { label: 'Calendar', icon: <CalendarIcon />, component: <Calendar /> },
    { label: 'Averages', icon: <ChartIcon />, component: <Averages /> },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant={isMobile ? 'fullWidth' : 'standard'}
          centered={!isMobile}
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: isMobile ? '0.75rem' : '0.875rem',
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1,
              }}
            />
          ))}
        </Tabs>
      </Box>
      <Box sx={{ py: 2 }}>
        {tabs[currentTab].component}
      </Box>
    </Container>
  );
};

export default Dashboard;
