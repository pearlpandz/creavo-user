import React, { useState, useEffect } from 'react';
import { usePatchUser } from '../../hook/usePageData';
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Box,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from '../../utils/axios-interceptor';
import { SETTINGS } from '../../constants/settings';

const Preference = ({ profile }) => {
  const [languages, setLanguages] = useState([]);
  const [businessCategories, setBusinessCategories] = useState([]);
  const { mutate: patchUser } = usePatchUser();

  const [selectedLanguages, setSelectedLanguages] = useState(profile?.language?.map(a => a.id) || []);
  const [selectedCategories, setSelectedCategories] = useState(profile?.business_category?.map(a => a.id) || []);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchDropdownList = async () => {
      const res = await axios.get(`${SETTINGS.DJANGO_URL}/api/categories/signup-list/`);
      if (res?.data?.length > 0) {
        const langs = res.data.find(a => a.name?.toLowerCase().includes('language'));
        setLanguages(langs.subcategories);

        const cats = res.data.find(a => a.name?.toLowerCase().includes('business'));
        setBusinessCategories(cats.subcategories);
      }
    };
    fetchDropdownList();
  }, []);

  const handleSave = () => {
    const userId = profile?.id;
    if (userId) {
      patchUser(
        { userId, data: { language: selectedLanguages, business_category: selectedCategories } },
        {
          onSuccess: () => {
            setSnackbar({
              open: true,
              message: 'Preferences updated successfully!',
              severity: 'success',
            });
          },
          onError: (error) => {
            setSnackbar({
              open: true,
              message: error?.response?.data?.detail || 'Failed to update preferences.',
              severity: 'error',
            });
          },
        }
      );
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
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

      <Button variant="contained" onClick={handleSave}>
        Save
      </Button>

      {/* ✅ Unified Snackbar for both success and error */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Preference;
