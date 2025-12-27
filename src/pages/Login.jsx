import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, Google, Facebook } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios-interceptor';
import { useAuth } from '../context/auth.context';
import { SETTINGS } from '../constants/settings';
import ErrorDialog from './ErrorDialog';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [dialogError, setDialogError] = useState(null);

  // Snackbar state (for success/error notifications)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    setDialogError(error);
  }, [error]);

  useEffect(() => {
    setError(null);
  }, []);

  const handleDialogClose = () => {
    setDialogError(null);
    setError(null);
  };

  const handleTogglePassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${SETTINGS.DJANGO_URL}/accounts/auth/user/`;
      const res = await axios.post(url, { email, password });

      if (res.status === 200) {
        login(res.data.user);
        setSnackbar({
          open: true,
          message: 'Login successful!',
          severity: 'success',
        });
        setTimeout(() => navigate('/'), 1500); // Slight delay so user sees success message
      } else {
        setError(res.data);
        setSnackbar({
          open: true,
          message: 'Login failed. Please check your credentials.',
          severity: 'error',
        });
      }
    } catch (error) {
      setError(error);
      setSnackbar({
        open: true,
        message: 'Something went wrong. Please try again!',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  const leftImages = [
    'assets/login-image1.png',
    'assets/login-image2.png',
    'assets/login-image3.png',
    'assets/login-image4.png',
    'assets/login-image5.png',
    'assets/login-image6.png',
  ];

  return (
    <>
      <Grid
        container
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
        }}
      >
        {/* LEFT SECTION */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flex: 1,
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
            '@media (max-width: 1100px)': { display: 'none' },
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(3, 1fr)',
              gap: 0,
            }}
          >
            {[...Array(9)].map((_, i) => (
              <Box
                key={i}
                component="img"
                src={leftImages[i % leftImages.length]}
                alt={`background-${i}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ))}
          </Box>

          {/* Dark overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.4)',
              zIndex: 1,
            }}
          />

          {/* Center text overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#fff',
              textAlign: 'center',
              zIndex: 2,
              width: '80%',
            }}
          >
            <Typography variant="h4" fontWeight={700}>
              Transform Your Marketing Strategy
            </Typography>
            <Typography variant="h6">
              Join thousands of successful marketers
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Trusted by over 10,000+ businesses worldwide
            </Typography>
          </Box>
        </Grid>

        {/* RIGHT SECTION */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 400,
              px: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: 3,
              }}
            >
              Creavo
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <IconButton color="primary" size="large">
                <Google />
              </IconButton>
              <IconButton color="primary" size="large">
                <Facebook />
              </IconButton>
            </Box>

            <Divider sx={{ width: '100%', mb: 2 }}>or</Divider>

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button size="small" onClick={() => navigate('/forget-password')}>
                  Forgot password?
                </Button>
              </Box>

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Login
              </Button>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography variant="body2">Don't have an account?</Typography>
                <Button size="small" onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <ErrorDialog error={dialogError} onClose={handleDialogClose} />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
