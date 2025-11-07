import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const EditorSlice = createSlice({
  name: "editor",
  initialState: {
    frameImg: null,
    mediaType: "image", // 'image' | 'video'
    selectedTemp: null,
  },
  reducers: {
    updateFrameImage: (state, action) => {
      if (typeof action.payload === "string") {
        state.frameImg = action.payload;
        state.mediaType = "image";
      } else {
        state.frameImg = action.payload.url;
        state.mediaType = action.payload.type || "image";
      }
    },
    updateSelectedTemplate: (state, action) => {
      state.selectedTemp = action.payload;
    },
    resetEditor: (state) => {
      state.frameImg = null;
      state.mediaType = "image";
      state.selectedTemp = null;
    },
  },
});

export const { updateFrameImage, updateSelectedTemplate, resetEditor } =
  EditorSlice.actions;
export default EditorSlice.reducer;

// Updated hook to return mediaType
export const useEditor = () => {
  return useSelector((state) => state.editor);
};