import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { setupInterceptors } from '@/lib/api.ts';

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!loading) {
    setLoading(true);
    setupInterceptors(navigate);
  }

  return <Outlet />;
}

export default App;
