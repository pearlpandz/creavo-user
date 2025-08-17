import React, { useState, useEffect } from 'react';
import { usePatchUser } from '../../hook/usePageData';
import { Button, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Box, Chip, Snackbar, Alert } from '@mui/material';
import axios from '../../utils/axios-interceptor';
import { SETTINGS } from '../../constants/settings';

const Preference = ({ profile }) => {
    const [languages, setLanguages] = useState([]);
    const [businessCategories, setBusinessCategories] = useState([]);
    const { mutate: patchUser } = usePatchUser();
    const [open, setOpen] = useState(false)
    const [selectedLanguages, setSelectedLanguages] = useState(profile?.language?.map(a => a.id) || []);
    const [selectedCategories, setSelectedCategories] = useState(profile?.business_category?.map(a => a.id) || []);

    useEffect(() => {
        const fetchDropdownList = async () => {
            const res = await axios.get(`${SETTINGS.DJANGO_URL}/api/categories/signup-list/`);
            if (res?.data?.length > 0) {
                const langs = res.data.find(a => a.name?.toLowerCase().includes('language'))
                setLanguages(langs.subcategories)

                const cats = res.data.find(a => a.name?.toLowerCase().includes('business'))
                setBusinessCategories(cats.subcategories)
            }
        };
        fetchDropdownList();
    }, []);

    const handleSave = () => {
        const userId = profile?.id;
        if (userId) {
            patchUser({ userId, data: { language: selectedLanguages, business_category: selectedCategories } });
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <div>
            <h3>Preferences</h3>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="language-select-label">Languages</InputLabel>
                <Select
                    labelId="language-select-label"
                    multiple
                    value={selectedLanguages}
                    onChange={(e) => setSelectedLanguages(e.target.value)}
                    input={<OutlinedInput id="select-multiple-chip" label="Languages" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={languages?.find(l => l.id === value)?.name} />
                            ))}
                        </Box>
                    )}
                >
                    {languages?.map((language) => (
                        <MenuItem key={language.id} value={language.id}>
                            {language.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="category-select-label">Business Categories</InputLabel>
                <Select
                    labelId="category-select-label"
                    multiple
                    value={selectedCategories}
                    onChange={(e) => setSelectedCategories(e.target.value)}
                    input={<OutlinedInput id="select-multiple-chip" label="Business Categories" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={businessCategories?.find(c => c.id === value)?.name} />
                            ))}
                        </Box>
                    )}
                >
                    {businessCategories?.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                            {category.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button variant="contained" onClick={handleSave}>Save</Button>

            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Profile Successfully Updated!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Preference;