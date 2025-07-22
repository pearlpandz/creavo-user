import React, { useState } from 'react'
import { Box, Grid, Paper, Typography, TextField, Button, IconButton, InputAdornment, Divider } from '@mui/material'
import { Visibility, VisibilityOff, Google, Facebook, ConstructionOutlined } from '@mui/icons-material'
import MasonryImageList from '../components/ImageGallery'
import { useNavigate } from 'react-router-dom'
import { SETTINGS } from '../constants/settings'
import axios from '../utils/axios-interceptor'
import { useAuth } from '../context/auth.context'

const Register = () => {
    const { login } = useAuth()
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        mobile_number: '',
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleTogglePassword = () => setShowPassword((show) => !show)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const url = `${SETTINGS.DJANGO_URL}/accounts/auth/user/signup`;
            console.log(form);
            const res = await axios.post(url, form)
            if (res.status === 201) {
                login(res.data.user)
                navigate('/select-category')
            } else {
                console.error('Login failed:', res.data)
            }
        } catch (error) {
            console.error('Login error:', error)
        }
    }

    return (
        <Grid container sx={{ width: '100vw' }}>
            {/* Left Image Section */}
            <Grid size={6} sx={{ display: { xs: 'none', md: 'block' }, height: '100vh', overflow: 'hidden', background: '#fafbfc' }}>
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                        src="assets/signup.png"
                        alt="Login Visual"
                        style={{ objectFit: 'contain', height: '100%', maxHeight: 500 }}
                    />
                </Box>
            </Grid>
            {/* Right Signup Form Section */}
            <Grid size={6} sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="first_name"
                            label="First Name"
                            name="first_name"
                            value={form.first_name}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="last_name"
                            label="Last Name"
                            name="last_name"
                            value={form.last_name}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="mobile_number"
                            label="mobile_number Number"
                            name="mobile_number"
                            autoComplete="tel"
                            value={form.mobile_number}
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
