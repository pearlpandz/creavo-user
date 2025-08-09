import { Box, Button, Tab, Tabs } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useProfile, useTemplateCategories, useTemplates } from '../hook/usePageData';
import { useNavigate, useSearchParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { updateFrameImage } from '../redux/slices/editor.slice';
import './FramesTab.css';
import { useExpire } from '../hook/useExpire';

function FramesPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data: profile } = useProfile();
    const { expireIn } = useExpire(profile)
    const { data: templateCategories } = useTemplateCategories();
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [value, setValue] = React.useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const view = searchParams.get('view')
    // Set selectedCategory when categories are available
    useEffect(() => {
        if (templateCategories?.length && !selectedCategory) {
            if (view) {
                const index = templateCategories?.findIndex(category => category.name === view)
                const isExist = index > -1;
                if (isExist) {
                    setSelectedCategory(templateCategories[index].name);
                    setValue(index)
                } else {
                    setSelectedCategory(templateCategories[0].name);
                    setValue(0)
                }
            } else {
                setSelectedCategory(templateCategories[0].name);
                setValue(0)
            }
        }
    }, [templateCategories, selectedCategory, view]);

    const { data: templates, isLoading, isFetching, isRefetching } = useTemplates(selectedCategory, {
        enabled: !!selectedCategory
    });

    const loading = !selectedCategory || isLoading || isFetching || isRefetching;



    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleSelect = (template) => {
        if (!profile?.license) {
            navigate('/subscription')
        } else if (expireIn === 0) {
            navigate('/expired')
        } else {
            dispatch(updateFrameImage(template.image))
            navigate('/editor')
        }
    }

    return (
        <Box sx={{ p: 2, width: '100%' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
            >
                {
                    templateCategories?.map((category) => (
                        <Tab
                            key={category.id}
                            label={category.name}
                            className="custom-tab"
                            onClick={() => {
                                setSelectedCategory(category.name)
                                searchParams.set('view', category.name)
                                setSearchParams(searchParams);
                            }}
                        />
                    ))
                }
            </Tabs>
            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {
                    loading ? (
                        <div>Loading templates...</div>
                    ) :
                        templates?.length > 0 ?
                            templates?.map((template) => (
                                <Button
                                    key={template._id}
                                    sx={{
                                        width: { xs: '100%', sm: 220 },
                                        p: 0,
                                        m: 0,
                                        borderRadius: 2,
                                        // boxShadow: 3,
                                        border: '2px solid #e0e0e0',
                                        backgroundColor: '#fff',
                                        transition: 'box-shadow 0.2s, border-color 0.2s',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        '&:hover': {
                                            boxShadow: 6,
                                            borderColor: '#1976d2',
                                            backgroundColor: '#f5faff',
                                        }
                                    }}
                                    onClick={() => handleSelect(template)}
                                >
                                    <img
                                        src={template.image}
                                        alt={template.name}
                                        width='100%'
                                        height='100%'
                                        style={{
                                            objectFit: 'contain',
                                            borderRadius: 8,
                                            background: '#fafafa'
                                        }}
                                    />
                                </Button>
                            )) :
                            <p>We couldn’t find any templates. Try a different category.</p>
                }
            </Box>
        </Box>
    )
}

export default FramesPage