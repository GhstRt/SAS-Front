import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import AppLayout from './components/SidebarHeader';
import Edit from './components/auth/Edit';
import CredentialsPage from './components/Credentials';
import VCenterPage from './components/Vcenter';
import FilterTable from './components/FilterTable';
import AddPhysicalServer from './components/AddPhysicalServer';
import SnapshotTable from './components/SnapshotTable';
import DeletedTable from './components/DeletedTable';
import PhysicalTable from './components/PhysicalTable';
import EsxiTable from './components/EsxiTable';

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
          <Route
            path="/servers"
            element={
              <>
                <AppLayout>
                  <FilterTable />
                  <PhysicalTable />
                </AppLayout>
              </>
            }
          />
          <Route
            path="/"
            element={
              <>
                <AppLayout>
                  <FilterTable />
                  <PhysicalTable />
                </AppLayout>
              </>
            }
          />
          <Route
            path="/servers/virtual/:os"
            element={
              <>
                <AppLayout>
                  <FilterTable />
                </AppLayout>
              </>
            }
          />
          <Route
            path="/servers/physical/:os"
            element={
              <>
                <AppLayout>
                  <PhysicalTable />
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
          <Route
            path="/servers/physical/add"
            element={
              <AppLayout>
                <AddPhysicalServer />
              </AppLayout>
            }
          />
          <Route
            path="/vcenter/snapshots"
            element={
              <AppLayout>
                <SnapshotTable />
              </AppLayout>
            }
          />
          <Route
            path="/vcenter/deleted"
            element={
              <AppLayout>
                <DeletedTable />
              </AppLayout>
            }
          />
          <Route
            path="/servers/esxi"
            element={
              <AppLayout>
                <EsxiTable />
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
