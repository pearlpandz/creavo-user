import { AppBar, Toolbar, Typography, Box, Avatar, IconButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function TopNav({ onMenuClick, darkMode, onToggleTheme }) {
    return (
        <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={onMenuClick} sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Creavo
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={onToggleTheme} color="inherit" sx={{ p: 1, visibility: 'hidden' }}>
                        {darkMode ? <Brightness7Icon sx={{ color: '#FFD600' }} /> : <Brightness4Icon sx={{ color: '#212121' }} />}
                    </IconButton>
                    {/* <Button color="primary" variant="outlined" size ="small">Logout</Button> */}
                    {/* <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>Muthupandi V</Typography>
                    </Box> */}
                    <Avatar sx={{ bgcolor: 'primary.main', fontSize: 12, width: 30, height: 30 }}>MV</Avatar>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
