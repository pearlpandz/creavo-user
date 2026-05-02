import React, { useState, useEffect } from 'react';
import { usePatchUser } from '../../hook/usePageData';
import {
  Button,
  Box,
  Chip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Autocomplete,
  TextField,
  Checkbox,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios-interceptor';
import { SETTINGS } from '../../constants/settings';

const Preference = ({ profile }) => {
  const [languages, setLanguages] = useState([]);
  const [businessCategories, setBusinessCategories] = useState([]);
  const { mutate: patchUser } = usePatchUser();
  const navigate = useNavigate();

  const [selectedLanguages, setSelectedLanguages] = useState(profile?.language?.map(a => a.id) || []);
  const [selectedCategories, setSelectedCategories] = useState(profile?.business_category?.map(a => a.id) || []);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [upgradeDialog, setUpgradeDialog] = useState({
    open: false,
    type: '', // 'language' or 'business'
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
    const hasLicense = profile?.license_details?.subscription;
    const isFreeTrial = !hasLicense || hasLicense?.plan_type === 'free';
    
    // For free trial users (7 days), allow unlimited preferences
    if (isFreeTrial) {
      // Check if trial period is still valid (you can add date check here if needed)
      // For now, allowing free users to add preferences
    } else {
      const languageLimit = parseInt(profile?.license_details?.subscription?.language_cat_count || 0);
      const businessLimit = parseInt(profile?.license_details?.subscription?.business_cat_count || 0);

      // Check language limit for paid users
      if (selectedLanguages.length > languageLimit) {
        setUpgradeDialog({ open: true, type: 'language' });
        return;
      }

      // Check business category limit for paid users
      if (selectedCategories.length > businessLimit) {
        setUpgradeDialog({ open: true, type: 'business' });
        return;
      }
    }

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

      <Autocomplete
        multiple
        options={languages || []}
        getOptionLabel={(option) => option.name}
        value={languages?.filter(lang => selectedLanguages.includes(lang.id)) || []}
        onChange={(event, newValue) => {
          setSelectedLanguages(newValue.map(item => item.id));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Languages"
            placeholder="Search languages..."
          />
        )}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </li>
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option.name}
              size="small"
              {...getTagProps({ index })}
            />
          ))
        }
        sx={{ mb: 2 }}
      />

      <Autocomplete
        multiple
        options={businessCategories || []}
        getOptionLabel={(option) => option.name}
        value={businessCategories?.filter(cat => selectedCategories.includes(cat.id)) || []}
        onChange={(event, newValue) => {
          setSelectedCategories(newValue.map(item => item.id));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Business Categories"
            placeholder="Search categories..."
          />
        )}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </li>
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option.name}
              size="small"
              {...getTagProps({ index })}
            />
          ))
        }
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={handleSave}>
        Save
      </Button>

      {/* Upgrade Dialog */}
      <Dialog 
        open={upgradeDialog.open} 
        onClose={() => setUpgradeDialog({ open: false, type: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>Subscription Limit Reached</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You've selected <strong>{upgradeDialog.type === 'language' ? selectedLanguages.length : selectedCategories.length}</strong> {upgradeDialog.type === 'language' ? 'languages' : 'business categories'}, but your current plan includes only <strong>{upgradeDialog.type === 'language' ? profile?.license_details?.subscription?.language_cat_count : profile?.license_details?.subscription?.business_cat_count}</strong>.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upgrade to a premium plan to unlock unlimited preferences and access advanced features for your business needs.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setUpgradeDialog({ open: false, type: '' })}
            color="inherit"
          >
            Maybe Later
          </Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setUpgradeDialog({ open: false, type: '' });
              navigate('/subscription');
            }}
            sx={{ ml: 1 }}
          >
            View Plans
          </Button>
        </DialogActions>
      </Dialog>

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
