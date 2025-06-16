import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const EditorSlice = createSlice({
  name: "UserSlice",
  initialState: {
    frameImg: null,
  },
  reducers: {
    updateFrameImage: (state, action) => {
      state.frameImg = action.payload;
    },
  },
});
export const { updateFrameImage } = EditorSlice.actions;
export default EditorSlice.reducer;

export const useEditor = () => {
  const editor = useSelector((state) => state.editor);
  return editor;
};
