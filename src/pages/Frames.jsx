import { Box, Button, IconButton, Tab, Tabs } from '@mui/material'
import React, { useState } from 'react'
import { useTemplateCategories, useTemplates } from '../hook/usePageData';

function FramesPage() {
    const { data: templateCategories } = useTemplateCategories();

    const categoryName = templateCategories?.[0]?.name;
    const [selectedCategory, setSelectedCategory] = useState(categoryName)

    const { data: templates } = useTemplates(selectedCategory, {
        enabled: !!selectedCategory
    });
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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
                        <Tab key={category.id} label={category.name} onClick={() => setSelectedCategory(category.name)} />
                    ))
                }
            </Tabs>
            <Box sx={{ mt: 2 }}>
                {
                    templates?.length > 0 ?
                        templates?.map((template) => (
                            <Button key={template.id} sx={{ width: 200 }}>
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