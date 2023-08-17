import { configureStore } from "@reduxjs/toolkit";
import { galerySlice } from "./reducers";

export const store = configureStore({
	reducer: {
		galeryImages: galerySlice.reducer,
	},
});
