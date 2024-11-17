import { createSelector } from "reselect";
import { RootState } from "../redux/store";
import { Asset } from "../redux/slices/assetSlice";

export const selectAssetById = (assetId: string) =>
    createSelector(
        (state: RootState) => state.assets.assets,
        (assets: Asset[]) => assets.find((asset) => asset.id === assetId)
    );

export const selectAssets = createSelector(
    (state: RootState) => state.assets.assets,
    (assets) => assets
);
