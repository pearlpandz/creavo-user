import React, { useState } from 'react'
import { Box, Grid, Paper, Typography, TextField, Button, Divider } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const ForgetPassword = () => {
    const [mobile, setMobile] = useState('')
    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh' }}>
            <Box component={Paper} elevation={6} >
                <Box sx={{ my: 8, mx: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 2, textTransform: 'uppercase' }}>
                        Forgot Password
                    </Typography>
                    <Divider sx={{ width: '100%', mb: 2 }} />
                    <Box component="form" sx={{ width: '100%', maxWidth: 400 }}>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Enter your registered mobile number to receive password reset instructions.
                        </Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="mobile"
                            label="Mobile Number"
                            name="mobile"
                            autoComplete="tel"
                            value={mobile}
                            onChange={e => setMobile(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Send Reset Link
                        </Button>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Button size="small" onClick={() => navigate('/login')}>Back to Login</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ForgetPassword
