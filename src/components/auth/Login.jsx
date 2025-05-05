import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Link,
  Alert,
  Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        'https://cloudsamapi.fw.dteknoloji.com.tr/api/login/',
        { username, password }, // Gövde (Body)
        {
          headers: {
            'Content-Type': 'application/json',  // JSON formatında veri gönderiyoruz
            'Authorization': 'Token z8vpx5l3fqkwn7m1dj9trsahguy42bo6ceqxtkih', // Eğer yetkilendirme gerekiyorsa
          }
        }
      );
      
      console.log("saaa");

      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

      navigate('/');
    } catch (error) {
      setError(error.response?.data?.error || 'Giriş yapılırken bir hata oluştu');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5',
        position: 'fixed',
        top: 0,
        left: 0
      }}
    >
      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 2
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            sx={{ 
              mb: 4, 
              color: 'primary.main',
              fontWeight: 'bold'
            }}
          >
            Giriş Yap
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              fullWidth
              label="Email"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Şifre"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ 
                mt: 2, 
                mb: 3,
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Giriş Yap
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
