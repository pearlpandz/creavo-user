import React, { useState } from 'react'
import { Box, Grid, Paper, Typography, TextField, Button, IconButton, InputAdornment, Divider } from '@mui/material'
import { Visibility, VisibilityOff, Google, Facebook } from '@mui/icons-material'
import MasonryImageList from '../components/ImageGallery'
import { useNavigate } from 'react-router-dom'

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleTogglePassword = () => setShowPassword((show) => !show)

    return (
        <Grid container sx={{ width: '100vw' }}>
            {/* Left Image Section */}
            <Grid size={7} sx={{ display: { xs: 'none', md: 'block' }, height: '100vh', overflow: 'hidden' }}>
                <MasonryImageList />
            </Grid>
            {/* Right Signup Form Section */}
            <Grid size={5} sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ my: 8, mx: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: 3 }}>
                        creavo
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
                    <Box component="form" sx={{ width: '100%', maxWidth: 400 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="mobile"
                            label="Mobile Number"
                            name="mobile"
                            autoComplete="tel"
                            value={form.mobile}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="new-password"
                            value={form.password}
                            onChange={handleChange}
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
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Typography variant="body2">Already have an account?</Typography>
                            <Button size="small" onClick={() => navigate('/login')}>Login</Button>
                        </Box>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}

export default Register
