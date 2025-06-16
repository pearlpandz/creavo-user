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
  },
});
export const { updateFrameImage, updateSelectedTemplate } = EditorSlice.actions;
export default EditorSlice.reducer;

export const useEditor = () => {
  const editor = useSelector((state) => state.editor);
  return editor;
};
