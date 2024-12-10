import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { setupResponseInterceptor } from './lib/api';

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!loading) {
    setLoading(true);
    setupResponseInterceptor(navigate);
  }

  return <Outlet />;
}

export default App;
