import { Box, Tab, Tabs, Typography } from '@mui/material'
import React from 'react';
import PropTypes from 'prop-types';
import MyProfile from '../components/Account/MyProfile';
import { useProfile } from '../hook/usePageData';

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
                    <Typography>{children}</Typography>
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
                    {SECTIONS[1]}
                </TabPanel>
                <TabPanel value={value} index={2}>
                    {SECTIONS[2]}
                </TabPanel>
                <TabPanel value={value} index={3}>
                    {SECTIONS[3]}
                </TabPanel>
                <TabPanel value={value} index={4}>
                    {SECTIONS[4]}
                </TabPanel>
                <TabPanel value={value} index={5}>
                    {SECTIONS[5]}
                </TabPanel>
            </Box>
        </Box>
    )
}

export default AccountPage