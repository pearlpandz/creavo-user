import { combineReducers, configureStore } from "@reduxjs/toolkit";
import EditorReducer from "./slices/editor.slice";

const rootReducer = combineReducers({
  editor: EditorReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
