import { Box, Button, IconButton, Tab, Tabs } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTemplateCategories, useTemplates } from '../hook/usePageData';
import { useNavigate, useSearchParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { updateSelectedTemplate } from '../redux/slices/editor.slice';

function FramesPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
        dispatch(updateSelectedTemplate(template))
        navigate('/editor')
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
                        <Tab key={category.id} label={category.name} onClick={() => {
                            setSelectedCategory(category.name)
                            searchParams.set('view', category.name)
                            setSearchParams(searchParams);
                        }} />
                    ))
                }
            </Tabs>
            <Box sx={{ mt: 2 }}>
                {
                    loading ? (
                        <div>Loading templates...</div>
                    ) :
                        templates?.length > 0 ?
                            templates?.map((template) => (
                                <Button key={template._id} sx={{ width: 200 }} onClick={() => handleSelect(template)}>
                                    <img src={template.image} alt={template.name} width='100%' height='100%' style={{ objectFit: 'contain' }} />
                                </Button>
                            )) :
                            <p>We couldn’t find any templates. Try a different category.</p>
                }
            </Box>
        </Box>
    )
}

export default FramesPage