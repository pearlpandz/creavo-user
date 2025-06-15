import { useEffect, useMemo, useState } from "react";
import CanvasRenderer from "../CanvasComponents/CanvasRenderer";
import { SIDEBAR } from "../constants";
import './Editor.css';
import { useProfile, useTemplateCategories, useTemplateDetail, useTemplates } from "../hook/usePageData";
import { useEditor } from "../redux/slices/editor.slice";

export default function Editor() {
    const { data: templateCategories, isLoading, isFetching, isRefetching } = useTemplateCategories();
    const { frameImg } = useEditor();
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
        if (templates?.length > 0) {
            setSelectedTemplate(templates[0])
        }
    }, [templates])

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

    const currentSidebarElement = useMemo(() => {
        switch (selectedSidebar) {
            case 'frames':
                return framesContainer;

            case 'themes':
                return themesContainer;

            default:
                return <h1>test</h1>
        }
    }, [selectedSidebar, framesContainer, themesContainer])


    return (
        <>
            <div className="editor-body">
                <div className="sidebar-container">
                    {
                        SIDEBAR.map(item => (
                            <div key={item.key} onClick={() => setSelectedSidebar(item.key)} className={selectedSidebar === item.key ? "active sidebar-item" : "sidebar-item"}>
                                <item.icon />
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
                            templates?.filter(template => template.category === selectedCategory?.name).length > 0 ?
                                templates?.filter(template => template.category === selectedCategory?.name).map((template, index) => (
                                    <button title={template.name} style={{ border: selectedTemplate?.id === template.id ? `1px solid #000` : 'none' }} onClick={() => setSelectedTemplate(template)} key={index}>
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
    const types = [
        { lable: 'background', value: 'bgColor' },
        { lable: 'text', value: 'textColor' }
    ];
    const [selectedType, setSelectedType] = useState(types[0])
    return (
        <div className="frame-container">
            <div className="frames-section">
                <ul className="frame-list">
                    {types.map(type => (
                        <li key={type.value} className={selectedType.value === type.value ? 'active' : ''}>
                            <button onClick={() => setSelectedType(type)}>{type.lable}</button>
                        </li>))}
                </ul>
                <div className="frame-scroll-view">
                    <div className="frames">
                        <input type="color" value={selectedTheme?.[selectedType?.value]} onChange={(event) => handleColorChange(selectedType.value, event.target.value)} />
                    </div>
                </div>
            </div>
        </div>
    )
}