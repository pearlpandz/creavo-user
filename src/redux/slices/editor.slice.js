import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const EditorSlice = createSlice({
  name: "UserSlice",
  initialState: {
    frameImg: null,
    selectedTemp: null,
  },
  reducers: {
    updateFrameImage: (state, action) => {
      state.frameImg = action.payload;
    },
    updateSelectedTemplate: (state, action) => {
      state.selectedTemp = action.payload;
    },
    resetEditor: (state) => {
      state.frameImg = null;
      state.selectedTemp = null;
    },
  },
});
export const { updateFrameImage, updateSelectedTemplate, resetEditor } =
  EditorSlice.actions;
export default EditorSlice.reducer;

export const useEditor = () => {
  const editor = useSelector((state) => state.editor);
  return editor;
};
