import { useState } from 'react'
import { ThemeProvider, CssBaseline, Button, Box, AppBar, Toolbar, Typography } from '@mui/material'
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { lightTheme, darkTheme } from './theme'
import Login from './pages/Login'
import Signup from './pages/Register'
import ForgetPassword from './pages/ForgetPassword'
import Home from './pages/Home'
import TopNav from './components/TopNav'
import Sidebar from './components/Sidebar'
import { AuthContext } from './context/auth.context'
import TanstackProvider from './tanstack-query/Provider';
import './App.css'
import ComingSoon from './components/ComingSoon'
import CategoryPage from './pages/Category'
import AccountPage from './pages/Account'
import FramesPage from './pages/Frames'
import Editor from './pages/Editor'
import PickBusinessCategory from './pages/PickBusinessCategory'
import PickLanguage from './pages/PickLanguage'
import Loader from './pages/Loader'

function ProtectedRoute({ isAuthenticated }) {
    return isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

function ProtectedLayout({ isAuthenticated, sidebarOpen, setSidebarOpen, onToggleTheme, darkMode }) {
    return isAuthenticated ? (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f6f6fd', overflow: 'hidden', width: "-webkit-fill-available" }}>
            <Sidebar open={sidebarOpen?.toString()} />
            <div style={{ width: sidebarOpen ? "calc(100% - 220px)" : "100%", flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', marginLeft: sidebarOpen ? 220 : 0, transition: 'margin-left 0.3s' }}>
                <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} onToggleTheme={onToggleTheme} darkMode={darkMode} />
                <div style={{ flex: 1, overflowY: 'auto' }} id="scrollable-container">
                    <Outlet />
                </div>
            </div>
        </div>

    ) : <Navigate to="/login" replace />
}

function NoAuthLayout({ toggleTheme }) {
    return (
        <>
            <Button sx={{ position: 'absolute', top: 16, right: 16, zIndex: 999 }} onClick={toggleTheme} variant="contained">Toggle Theme</Button>
            <Outlet />
        </>
    )
}

function BasicLayout({ toggleTheme }) {
    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
            <AppBar
                position="static"
                elevation={0}
                sx={{
                    bgcolor: "#fff",
                    color: "#222",
                    borderBottom: "1px solid #f0f0f0",
                }}
            >
                <Toolbar>
                    <Typography variant="subtitle1" fontWeight={600}>
                        CREAVO
                    </Typography>
                </Toolbar>
            </AppBar>
            <Button sx={{ position: 'absolute', top: 16, right: 16, zIndex: 999 }} onClick={toggleTheme} variant="contained">Toggle Theme</Button>
            <Outlet />
        </Box>
    )
}

function App() {
    const [darkMode, setDarkMode] = useState(false)

    // Apply authentication logic
    const [isAuthenticated, setAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true' || false);
    const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem('userDetails')) || null);
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const toggleTheme = () => setDarkMode((prev) => !prev)

    const login = (data) => {
        setAuthenticated(true)
        setUserDetails(data)
        localStorage.setItem('isAuthenticated', true);
        localStorage.setItem('userDetails', JSON.stringify(data));
    }

    const logout = () => {
        setAuthenticated(false)
        setUserDetails(null)
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userDetails');
    }

    return (
        <TanstackProvider>
            <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
                <AuthContext.Provider value={{ isAuthenticated, userDetails, login, logout }}>
                    <CssBaseline />
                    <Router>
                        <Routes>
                            <Route element={<NoAuthLayout toggleTheme={toggleTheme} />}>
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route element={<BasicLayout toggleTheme={toggleTheme} />}>
                                    <Route path="/select-category" element={<PickBusinessCategory />} />
                                    <Route path="/select-language" element={<PickLanguage />} />
                                    <Route path="/forget-password" element={<ForgetPassword />} />
                                    <Route path="/loader" element={<Loader />} />
                                </Route>
                            </Route>
                            <Route
                                element={
                                    <ProtectedLayout
                                        sidebarOpen={sidebarOpen}
                                        setSidebarOpen={setSidebarOpen}
                                        isAuthenticated={isAuthenticated}
                                        onToggleTheme={toggleTheme}
                                        darkMode={darkMode}
                                    />
                                }
                            >
                                <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/category/:id" element={<CategoryPage />} />
                                    <Route path="/category/:id/:sub" element={<CategoryPage />} />
                                    <Route path="/account" element={<AccountPage />} />
                                    <Route path="/frames" element={<FramesPage />} />
                                    <Route path="/editor" element={<Editor />} />
                                </Route>
                            </Route>
                            <Route path="*" element={<ComingSoon />} />
                        </Routes>
                    </Router>
                </AuthContext.Provider>
            </ThemeProvider>
        </TanstackProvider>
    )
}

export default App