import { useState, useRef, useEffect } from "react";
import { useUndoRedo } from "../hook/useUndoRedo";
import { dataURLtoFile, formatArrayWithPipe } from "../utils";
import { useCreateTemplate, usePatchTemplate } from "../hook/useTemplate";
import KonvaBuilder from "../konva-components/KonvaBuilder";
import { Box } from "@mui/material";
import { usePatchUser } from "../hook/usePageData";

// Canvas Editor
const CanvasEditor = (props) => {
  const { template, theme, selectedImg, profile, mode = "edit" } = props;
  const stageRef = useRef();
  const [elements, setElements] = useUndoRedo([]);
  const [templateObj, setTemplateObj] = useState({});
  const { mutate: patchMutate } = usePatchTemplate();
  const { mutate: createMutate } = useCreateTemplate();
  const mutate = mode === "edit" ? patchMutate : createMutate;
  const { mutate: mutateUser } = usePatchUser((updatedUser) => {
    console.log(updatedUser);
  });

  useEffect(() => {
    // Load initial elements from template prop
    if (template?.elements) {
      const updatedElements = template.elements.map((element) => {
        if (element.type === "image" && element.src) {
          let src = null;
          if (element.slug === "{{logo}}") {
            src = profile?.company_details?.image;
          } else if (element.slug === "{{frame-img}}") {
            src = selectedImg;
          } else if (element.slug === "{{product-img1}}") {
            src = profile?.products?.[0]?.image
          } else if (element.slug === "{{product-img2}}") {
            src = profile?.products?.[1]?.image
          } else if (element.slug === "{{product-img3}}") {
            src = profile?.products?.[2]?.image
          } else if (element.slug === "{{political-supporter-1}}") {
            src = profile?.political?.supporters?.[0]?.image
          } else if (element.slug === "{{political-supporter-2}}") {
            src = profile?.political?.supporters?.[1]?.image
          } else if (element.slug === "{{political-supporter-3}}") {
            src = profile?.political?.supporters?.[2]?.image
          } else if (element.slug === "{{leader-image}}") {
            src = profile?.political?.image
          }
          src = src || element.src
          return {
            ...element,
            src,
          };
        } else if (element.type === "text" && element.text) {
          let text = '';
          if (element.slug === "{{companyName}}") {
            text = profile?.company_details?.company_name;
          } else if (element.slug === "{{content}}") {
            text = formatArrayWithPipe([
              profile?.company_details?.primary_contact,
              profile?.company_details?.secondary_contact,
              profile?.company_details?.email,
              profile?.company_details?.website
            ]);
          } else if (element.slug === "{{description}}") {
            text = profile?.company_details?.description;
          } else if (element.slug === "{{leader-name}}") {
            text = profile?.political?.leader_name;
          } else if (element.slug === "{{leader-designation}}") {
            text = profile?.political?.leader_designation;
          }
          text = text || element.text
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

  // eslint-disable-next-line no-unused-vars
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

  // eslint-disable-next-line no-unused-vars
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

  // Download canvas as high quality image
  const handleDownload = () => {
    if (!stageRef.current) return;
    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 }); // High quality
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `${templateObj.name || 'canvas'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCountUpdate = () => {
    const userId = JSON.parse(localStorage.getItem('userDetails'))?.id;
    if (userId) {
      const day_downloads = profile?.day_downloads ? profile?.day_downloads + 1 : 1;
      const overall_downloads = profile?.overall_downloads ? profile?.overall_downloads + 1 : 1;
      mutateUser({ userId, data: { day_downloads, overall_downloads } });
    }
  }

  const handleClick = () => {
    // add condition for day limit exceed accordingly disable the download button
    handleDownload();
    handleCountUpdate()
  }

  return (
    <KonvaBuilder
      elements={elements}
      setElements={setElements}
      templateObj={templateObj}
      setTemplateObj={setTemplateObj}
      mode="view"
      stageRef={stageRef}
      handleClick={handleClick}
    />
  );
};

export default CanvasEditor;
