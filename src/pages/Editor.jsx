import { useEffect, useMemo, useState } from "react";
import CanvasRenderer from "../CanvasComponents/CanvasRenderer";
import { SIDEBAR } from "../constants";
import './Editor.css';
import { useProfile, useTemplateCategories, useTemplateDetail, useTemplates } from "../hook/usePageData";
import { resetEditor, updateFrameImage, useEditor } from "../redux/slices/editor.slice";
import { useDispatch } from "react-redux";
import CompanyDetails from "../components/Account/CompanyDetails";
import ProductInfo from "../components/Account/ProductInfo";
import PoliticalDetails from "../components/Account/Political";
import { Box, Typography, TextField, InputLabel, Stack, Button } from "@mui/material";
import EditorMobileMessage from './EditorMobileMessage';

export default function Editor() {
    const dispatch = useDispatch();
    const { data: templateCategories, isLoading, isFetching, isRefetching } = useTemplateCategories();
    const { frameImg, selectedTemp } = useEditor();
    const { data: profile } = useProfile();
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedTemplate, setSelectedTemplate] = useState(null)

    useEffect(() => {
        if (templateCategories?.length && !selectedCategory?.name) {
            const category = templateCategories?.[0];
            setSelectedCategory(category);
        }
    }, [selectedCategory, templateCategories])

    const { data: templates = [], isLoading1, isFetching1, isRefetching1 } = useTemplates(selectedCategory?.name, {
        enabled: !!selectedCategory?.name
    });

    useEffect(() => {
        if (selectedTemp) {
            setSelectedTemplate(selectedTemp)
        }
        else if (templates?.length > 0) {
            setSelectedTemplate(templates[0])
        } else {
            setSelectedTemplate(null)
        }
    }, [selectedTemp, templates])

    const { data: selectedTemplateDetail } = useTemplateDetail(selectedTemplate?._id, {
        enabled: !!selectedTemplate?._id
    })

    const [selectedSidebar, setSelectedSidebar] = useState(SIDEBAR[0].key)
    const [selectedTheme, setSelectedTheme] = useState(null)

    const loading = isLoading || isFetching || isRefetching || isLoading1 || isFetching1 || isRefetching1

    const framesContainer = useMemo(() => {
        return (
            <FramesContainer
                isLoading={loading}

                templateCategories={templateCategories}
                templates={templates}

                selectedTemplate={selectedTemplateDetail}
                setSelectedTemplate={setSelectedTemplate}

                setSelectedCategory={setSelectedCategory}
                selectedCategory={selectedCategory}
            />
        )
    }, [templateCategories, templates, selectedTemplateDetail, selectedCategory, loading])

    const handleColorChange = (type, color) => {
        if (type === 'bgColor') {
            setSelectedTheme(prev => ({ ...prev, bgColor: color }))
        } else {
            setSelectedTheme(prev => ({ ...prev, textColor: color }))
        }
    }

    const themesContainer = useMemo(() => {
        return (
            <ThemesContainer handleColorChange={handleColorChange} selectedTheme={selectedTheme} />
        )
    }, [selectedTheme])

    const companyDetails = useMemo(() => {
        return (
            <CompanyDetails detail={profile?.company_details} isEditorView={true} />
        )
    }, [profile?.company_details])

    const productDetails = useMemo(() => {
        return (
            <ProductInfo productList={profile?.products} isEditorView={true} />
        )
    }, [profile?.products])

    const politicalDetails = useMemo(() => {
        return (
            <PoliticalDetails detail={profile?.political} isEditorView={true} />
        )
    }, [profile?.political])

    const currentSidebarElement = useMemo(() => {
        switch (selectedSidebar) {
            case 'frames':
                return framesContainer;

            case 'themes':
                return themesContainer;

            case 'companydetails':
                return companyDetails;

            case 'product':
                return productDetails;

            case 'political':
                return politicalDetails;

            default:
                return <h1>test</h1>
        }
    }, [selectedSidebar, framesContainer, themesContainer, companyDetails, productDetails, politicalDetails])

    useEffect(() => {
        return () => {
            dispatch(resetEditor())
        }
    }, [])

    // Mobile view detection
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 600);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (isMobile) {
        return <EditorMobileMessage />;
    }

    return (
        <>
            <div className="editor-body">
                <div className="sidebar-container">
                    {
                        SIDEBAR.map(item => (
                            <div key={item.key} onClick={() => setSelectedSidebar(item.key)} className={selectedSidebar === item.key ? "active sidebar-item" : "sidebar-item"}>
                                <item.icon fontSize={20} />
                                <h6>{item.name}</h6>
                            </div>
                        ))
                    }
                </div>

                <div className="picker-container">
                    {currentSidebarElement}
                </div>

                {selectedTemplate && <div className="canvas-container">
                    <CanvasRenderer theme={selectedTheme} selectedImg={frameImg} template={selectedTemplateDetail} profile={profile} />
                </div>}
            </div>
        </>
    )
}

const FramesContainer = ({ templates, selectedTemplate, setSelectedTemplate, selectedCategory, setSelectedCategory, templateCategories, loading }) => {
    if (loading) {
        <div className="frame-container">
            <p>Loading...</p>
        </div>
    }

    const selectedCateogoryItems = templates?.filter(template => template.category === selectedCategory?.name);

    return (
        <div className="frame-container">
            <div className="frames-section">
                <ul className="frame-list">
                    {templateCategories?.map(category => (
                        <li key={category.id} className={selectedCategory?.name === category.name ? 'active' : ''}>
                            <button onClick={() => setSelectedCategory(category)}>{category.name}</button>
                        </li>))}
                </ul>
                <div className="frame-scroll-view">
                    <div className="frames">
                        {
                            selectedCateogoryItems.length > 0 ?
                                selectedCateogoryItems.map((template, index) => (
                                    <button title={template.name} style={{ borderStyle: selectedTemplate?._id === template._id ? 'solid' : 'dotted' }} onClick={() => setSelectedTemplate(template)} key={index}>
                                        <img src={template.image} alt={template.name} />
                                    </button>
                                )) :
                                <p>No Frames found.</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

const ThemesContainer = ({ handleColorChange, selectedTheme }) => {

    const dispatch = useDispatch();
    const { frameImg } = useEditor();

    return (
        <Box className="frame-container">
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Frame Appearance
            </Typography>
            <Box sx={{ mb: 2, mt: 2 }}>
                <InputLabel shrink htmlFor="color-picker">
                    Background Color
                </InputLabel>
                <TextField
                    id="color-picker"
                    type="color"
                    value={selectedTheme?.bgColor || "#000000"}
                    onChange={event => handleColorChange('bgColor', event.target.value)}
                    variant="outlined"
                    sx={{ width: 60, p: 0, minWidth: 60, border: "none" }}
                    inputProps={{ style: { padding: 0, height: 30 } }}
                />
            </Box>

            <Box sx={{ mb: 2 }}>
                <InputLabel shrink htmlFor="color-picker">
                    Text Color
                </InputLabel>
                <TextField
                    id="color-picker"
                    type="color"
                    value={selectedTheme?.textColor || "#000000"}
                    onChange={event => handleColorChange('textColor', event.target.value)}
                    variant="outlined"
                    sx={{ width: 60, p: 0, minWidth: 60, border: "none" }}
                    inputProps={{ style: { padding: 0, height: 30 } }}
                />
            </Box>

            {/* Frame Image Section */}
            <Box>
                <InputLabel shrink htmlFor="frame-image-upload">
                    Frame Image
                </InputLabel>
                <Stack direction="column" spacing={2}>
                    {frameImg && (
                        <Box
                            component="img"
                            src={frameImg}
                            alt="Frame Preview"
                            sx={{ width: 100, height: 100, objectFit: "cover", borderRadius: 1, border: "1px solid #ccc" }}
                        />
                    )}
                    <Button variant="contained" component="label" size="small" sx={{ fontSize: 12, width: 150, height: 30 }}>
                        Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            id="frame-image-upload"
                            onChange={e => {
                                if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    const reader = new FileReader();
                                    reader.onload = function (event) {
                                        dispatch(updateFrameImage(event.target.result));
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                    </Button>
                </Stack>
            </Box>
        </Box>
    )
}