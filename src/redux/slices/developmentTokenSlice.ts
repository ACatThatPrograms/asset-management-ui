import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DevelopmentTokenState {
    developmentJwt: string | null;
}

const initialState: DevelopmentTokenState = {
    developmentJwt: null,
};

const developmentTokenSlice = createSlice({
    name: "developmentToken",
    initialState,
    reducers: {
        setDevelopmentJwt(state, action: PayloadAction<string>) {
            state.developmentJwt = action.payload;
        },
    },
});

export const { setDevelopmentJwt } = developmentTokenSlice.actions;
export default developmentTokenSlice.reducer;
