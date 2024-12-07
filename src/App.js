import React from 'react';
import Dashboard from './pages/Dashboard';

function App() {
  // In a real app, this would come from authentication
  const dummyUserId = 'user123';

  return (
    <Dashboard userId={dummyUserId} />
  );
}

export default App;
