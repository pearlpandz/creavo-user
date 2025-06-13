import { Box, Tab, Tabs, Typography } from '@mui/material'
import React from 'react';
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

    return (
        <Box sx={{ p: 2, width: '100%' }}>
            <Typography component='h1' variant='h6' sx={{ fontWeight: 'bold', mb: 2 }}>Account & Settings</Typography>
            <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: 'divider' }}
                >
                    {
                        SECTIONS.map((section, index) => (
                            <Tab key={section} label={section} {...a11yProps(index)} />
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
                    <ChangePassword />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <CompanyDetails detail={profile?.company_details} />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <ProductInfo productList={profile?.products} />
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <PoliticalDetails detail={profile?.political} />
                </TabPanel>
                <TabPanel value={value} index={5}>
                    <Subscription detail={profile?.license_details} />
                </TabPanel>
            </Box>
        </Box>
    )
}

export default AccountPage