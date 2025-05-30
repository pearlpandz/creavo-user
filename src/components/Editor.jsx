import { useMemo, useState } from "react";
import './Editor.css';
import CanvasRenderer from "../CanvasComponents/CanvasRenderer";
import { SIDEBAR } from "../constants";
import { SETTINGS } from "../constants/settings";
import { useQueryClient } from "@tanstack/react-query";

function Editor(props) {
    const { selectedImg } = props;
    const queryClient = useQueryClient();
    const templates = queryClient.getQueryData(['templates']); // your query key
    const [selectedTemplate, setSelectedTemplate] = useState(templates?.[0])
    const [selectedSidebar, setSelectedSidebar] = useState(SIDEBAR[0].key)
    const [selectedTheme, setSelectedTheme] = useState({ textColor: 'white', bgColor: 'red' })
    const businessDetails = JSON.parse(localStorage.getItem('companyDetails')) ?? {}

    const framesContainer = useMemo(() => {
        return (
            <FramesContainer templates={templates} setSelectedTemplate={setSelectedTemplate} />
        )
    }, [setSelectedTemplate, templates])

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
                    <CanvasRenderer theme={selectedTheme} selectedImg={selectedImg} template={selectedTemplate} businessDetails={businessDetails} />
                </div>}
            </div>
        </>
    )
}

export default Editor;



const FramesContainer = ({ templates, setSelectedTemplate }) => {
    const types = ['regular', 'product', 'political'];
    const [selectedType, setSelectedType] = useState(types[0])
    return (
        <div className="frame-container">
            <div className="frames-section">
                <ul className="frame-list">
                    {types.map(type => (
                        <li key={type} className={selectedType === type ? 'active' : ''}>
                            <button onClick={() => setSelectedType(type)}>{type}</button>
                        </li>))}
                </ul>
                <div className="frame-scroll-view">
                    <div className="frames">
                        {
                            templates.filter(template => template.category === selectedType).length > 0 ?
                                templates.filter(template => template.category === selectedType).map((template, index) => (
                                    <button title={template.name} onClick={() => setSelectedTemplate(template)} key={index}>
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
                        <input type="color" value={selectedTheme[selectedType.value]} onChange={(event) => handleColorChange(selectedType.value, event.target.value)} />
                    </div>
                </div>
            </div>
        </div>
    )
}