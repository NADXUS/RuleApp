import { createSlice } from "@reduxjs/toolkit";

export const galerySlice = createSlice({
	name: "galeryImages",
	initialState: {
		images: [],
		imageTags: "",
	},
	reducers: {
		addImagesTags: (state, action) => {
			const { imageTags } = action.payload;
			state.imageTags = imageTags;
		},
	},
});
export const { addImagesTags } = galerySlice.actions;
