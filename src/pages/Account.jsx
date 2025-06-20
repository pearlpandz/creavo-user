import { Box, Tab, Tabs, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import MyProfile from '../components/Account/MyProfile';
import { useProfile } from '../hook/usePageData';
import ChangePassword from '../components/Account/ChangePassword';
import CompanyDetails from '../components/Account/CompanyDetails';
import ProductInfo from '../components/Account/ProductInfo';
import PoliticalDetails from '../components/Account/Political';
import Subscription from '../components/Account/Subscription';

const SECTIONS = [
    "My Profile",
    "Change Password",
    "Company Details",
    "Product Info",
    "Political Info",
    "Subscription",
]

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
            component='div'
            sx={{ flex: 1 }}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </Box>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function AccountPage() {
    const { data: profile, isLoading, isFetching, isRefetching } = useProfile();
    const [value, setValue] = React.useState(0);
    const loading = isLoading || isFetching || isRefetching;

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 600);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <Box sx={{ p: 2, width: '100%' }}>
            <Typography component='h1' variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>Account & Settings</Typography>
            <Box sx={{
                flexGrow: 1,
                bgcolor: 'background.paper',
                display: { xs: 'block', sm: 'flex' },
                flexDirection: { xs: 'column', sm: 'row' },
                minHeight: 400,
            }}>
                <Tabs
                    orientation={window.innerWidth < 600 ? 'horizontal' : 'vertical'}
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Account tabs"
                    TabIndicatorProps={{
                        sx: {
                            left: 0,
                            width: 4,
                            borderRadius: 2,
                            backgroundColor: '#1976d2',
                        }
                    }}
                    sx={{
                        borderColor: 'divider',
                        minWidth: { xs: '100%', sm: 200 },
                        mb: { xs: 2, sm: 0 },
                        background: '#d8ecff',
                        boxShadow: { sm: '0 2px 12px 0 rgba(25, 118, 210, 0.04)' },
                        // borderRadius: { sm: 3, xs: 2 },
                        py: { sm: 3, xs: 1 },
                        px: { sm: 0, xs: 1 },
                    }}
                >
                    {
                        SECTIONS.map((section, index) => (
                            <Tab
                                key={section}
                                label={section}
                                {...a11yProps(index)}
                                disableRipple
                                sx={{
                                    minWidth: 120,
                                    minHeight: 30,
                                    fontSize: { xs: 12, sm: 14 },
                                    color: 'rgba(44, 62, 80, 0.8)',
                                    fontWeight: 500,
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                    textAlign: 'left',
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    mx: { sm: 1, xs: 0 },
                                    my: { sm: 1, xs: 0 },
                                    transition: 'background 0.2s, color 0.2s',
                                    letterSpacing: 0.2,
                                    '&.Mui-selected': {
                                        color: '#fff',
                                        background: '#115293',
                                        fontWeight: 700,
                                        boxShadow: '0 2px 8px 0 rgba(25, 118, 210, 0.06)',
                                    },
                                    '&:not(.Mui-selected)': {
                                        background: 'transparent',
                                    },
                                    '&:hover': {
                                        background: '#115293',
                                        color: '#fff',
                                    },
                                }}
                            />
                        ))
                    }
                </Tabs>
                <TabPanel value={value} index={0}>
                    {
                        loading ?
                            <Typography>Loading...</Typography> :
                            <MyProfile userDetail={profile} />
                    }
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <ChangePassword isMobile={isMobile} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <CompanyDetails detail={profile?.company_details} isEditorView={isMobile} />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <ProductInfo productList={profile?.products} isEditorView={isMobile} />
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <PoliticalDetails detail={profile?.political} isEditorView={isMobile} />
                </TabPanel>
                <TabPanel value={value} index={5}>
                    <Subscription detail={profile?.license_details} isEditorView={isMobile} />
                </TabPanel>
            </Box>
        </Box>
    )
}

export default AccountPage