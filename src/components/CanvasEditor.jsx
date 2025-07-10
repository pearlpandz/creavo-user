import { useState, useRef, useEffect } from "react";
import { useUndoRedo } from "../hook/useUndoRedo";
import { dataURLtoFile, formatArrayWithPipe } from "../utils";
import { useCreateTemplate, usePatchTemplate } from "../hook/useTemplate";
import KonvaBuilder from "../konva-components/KonvaBuilder";

// Canvas Editor
const CanvasEditor = (props) => {
  const { template, theme, selectedImg, profile, mode = "edit" } = props;
  const stageRef = useRef();
  const [elements, setElements] = useUndoRedo([]);
  const [templateObj, setTemplateObj] = useState({});
  const { mutate: patchMutate } = usePatchTemplate();
  const { mutate: createMutate } = useCreateTemplate();
  const mutate = mode === "edit" ? patchMutate : createMutate;

  useEffect(() => {
    // Load initial elements from template prop
    if (template?.elements) {
      const updatedElements = template.elements.map((element) => {
        if (element.type === "image" && element.src) {
          let src = element.src;
          if (element.slug === "{{logo}}") {
            const logo = profile?.company_details?.image;
            src = logo || element.src;
          } else if (element.slug === "{{frame_img}}") {
            src = selectedImg || element.src;
          }
          return {
            ...element,
            src,
          };
        } else if (element.type === "text" && element.text) {
          let text = element.text;
          if (element.slug === "{{company_name}}") {
            text = profile?.company_details?.company_name || element.text;
          } else if (element.slug === "{{content}}") {
            text = formatArrayWithPipe([
              profile?.company_details?.primary_contact,
              profile?.company_details?.secondary_contact,
              profile?.company_details?.email,
              profile?.company_details?.website
            ]);
          } else if (element.slug === "{{description}}") {
            text = profile?.company_details?.description || element.text;
          }
          return {
            ...element,
            text,
          };
        }
        return element;
      })



      setElements(updatedElements);
      setTemplateObj({
        name: template.name,
        category: template.category,
        state: template.state || "draft",
      });
    } else {
      setElements([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, theme, selectedImg, profile,]);

  const saveTemplate = async () => {
    const dataURL = stageRef.current.toDataURL({
      pixelRatio: 0.4, // 40% resolution of actual canvas size
    });
    const file = dataURLtoFile(dataURL, `${templateObj.name}.png`);
    const formdata = new FormData();
    formdata.append("name", templateObj.name);
    formdata.append("frame", file);
    formdata.append(
      "elements",
      JSON.stringify(elements?.filter((a) => Object.keys(a).length > 0))
    );
    formdata.append("category", templateObj.category);
    formdata.append("state", templateObj.state || "draft");
    mutate({
      payload: formdata
    });
  };

  const updateTemplate = async () => {
    const dataURL = stageRef.current.toDataURL({
      pixelRatio: 0.4, // 40% resolution of actual canvas size
    });
    const file = dataURLtoFile(dataURL, `${templateObj.name}.png`);
    const formdata = new FormData();
    formdata.append("name", templateObj.name);
    formdata.append("frame", file);
    formdata.append("elements", JSON.stringify(elements));
    formdata.append("category", templateObj.category);
    mutate({
      payload: formdata,
      id: template._id
    });
  };

  return (
    <KonvaBuilder
      elements={elements}
      setElements={setElements}
      templateObj={templateObj}
      setTemplateObj={setTemplateObj}
      mode="view"
      stageRef={stageRef}
    />
  );
};

export default CanvasEditor;
