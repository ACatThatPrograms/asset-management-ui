import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../store";
import { microApiSdk } from "../../utils/microApiSdk";

export interface Asset {
    id: string;
    token_name: string;
    smart_contract_address: string;
    asset_type: string;
    chain: string;
    quantity_owned?: string;
    token_id?: string;
    cost_basis: string;
    latest_price: string;
    p_or_l: number;
}

interface AssetState {
    assets: Asset[];
}

const initialState: AssetState = {
    assets: [],
};

const assetSlice = createSlice({
    name: "assets",
    initialState,
    reducers: {
        setAssets(state, action: PayloadAction<Asset[]>) {
            state.assets = action.payload;
        },
        addAsset(state, action: PayloadAction<Asset>) {
            state.assets.push(action.payload);
        },
        deleteAllAssets(state) {
            state.assets = [];
        },
    },
});

export const {
    setAssets,
    addAsset,
    deleteAllAssets: deleteAllAssetsAction,
} = assetSlice.actions;

export const fetchAssets = (): AppThunk => async (dispatch) => {
    try {
        const response = await microApiSdk.getAssets();
        dispatch(setAssets(response.data));
    } catch (error) {
        console.log(error);
        console.error("Failed to fetch assets:", error);
    }
};

export const deleteAllAssets = (): AppThunk => async (dispatch) => {
    try {
        await microApiSdk.deleteAllAssets();
        dispatch(deleteAllAssetsAction());
    } catch (error) {
        console.error("Failed to fetch assets:", error);
    }
};

export default assetSlice.reducer;
