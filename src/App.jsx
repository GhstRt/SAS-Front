import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import PrivateRoute from './components/auth/PrivateRoute';
import DataTable from './components/Table';
import AppLayout from './components/SidebarHeader';
import Edit from './components/auth/Edit';
import CredentialsPage from './components/Credentials';
import VCenterPage from './components/Vcenter';

import { Container, Typography, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import VcenterDetail from './components/VcenterDetail';
import { ViewCarousel } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e',
    },
    secondary: {
      main: '#ffd700',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/table" element={<DataTable />} />
          <Route
  path="/"
  element={
    <>
      <AppLayout> 
            <DataTable />
      </AppLayout>
    </>
  }
/>
          <Route
            path="/credentials"
            element={
              <>
                <AppLayout> 
                      <CredentialsPage />
                </AppLayout>
              </>
            }
          />
          <Route
            path="/vcenters"
            element={
              <>
                <AppLayout> 
                      <VCenterPage />
                </AppLayout>
              </>
            }
          />
          <Route
            path="/vcenter/:uuid"
            element={
              <AppLayout> 
                <VcenterDetail />
              </AppLayout>
            }
          />

            <Route path="/edit" element={<Edit />} />


        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
