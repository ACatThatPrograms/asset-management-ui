import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { fetchAssets, deleteAllAssets } from "../redux/slices/assetSlice";
import { RootState, useAppDispatch } from "../redux/store";
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { microApiSdk } from "../utils/microApiSdk";
import PageWrapper from "../components/PageWrapper";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AssetTable from "../components/AssetTable";
import PortfolioSummary from "../components/PortfolioSummary";

const AssetManagementPage = () => {
    const dispatch = useAppDispatch();
    const [refreshingAssets, setRefreshingAssets] = useState(false);
    const [updatingPrice, setUpdatingPrice] = useState(false);
    const [recalculatingPortfolio, setRecalculatingPortfolio] = useState(false);
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

    const [deleteAssetId, setDeleteAssetId] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({
        assetType: "ERC-20",
        smartContractAddress: "",
        quantity: undefined,
        tokenId: undefined,
        costBasis: undefined,
        tokenDescription: "",
    });

    const portfolioRef = useRef<() => Promise<void>>();

    const triggerRefresh = () => {
        if (portfolioRef.current) {
            portfolioRef.current();
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(fetchAssets());
        }
    }, [dispatch, isLoggedIn]);

    const handleDeleteAll = async () => {
        dispatch(deleteAllAssets());
        await microApiSdk.deleteAllAssets();
        await microApiSdk.recalculatePortfolio();
        triggerRefresh();
    };

    const updateDailyPrice = async () => {
        setUpdatingPrice(true);
        await microApiSdk.updateDailyPrices();
        dispatch(fetchAssets());
        triggerRefresh();
        setUpdatingPrice(false);
    };

    const recalculatePortfolio = async () => {
        setRecalculatingPortfolio(true);
        await microApiSdk.recalculatePortfolio();
        dispatch(fetchAssets());
        setRecalculatingPortfolio(false);
        triggerRefresh();
    };

    const getRandomSmartContractAddress = () => {
        const hexChars = "0123456789abcdef";
        let address = "0x";
        for (let i = 0; i < 40; i++) {
            address += hexChars[Math.floor(Math.random() * hexChars.length)];
        }
        return address;
    };

    const handleAddRandomERC20 = async () => {
        const randomData = {
            tokenDescription: "Random ERC-20 token",
            assetType: "ERC-20",
            smartContractAddress: getRandomSmartContractAddress(),
            quantity: Math.floor(Math.random() * 10000) + 1,
            costBasis: parseFloat((Math.random() * 20 + 1).toFixed(2)),
        };
        await microApiSdk.addAsset(randomData);
        dispatch(fetchAssets());
        triggerRefresh();
    };

    const handleAddRandomERC721 = async () => {
        const randomData = {
            tokenDescription: "Random ERC-721 token",
            assetType: "ERC-721",
            smartContractAddress: getRandomSmartContractAddress(),
            tokenId: Math.floor(Math.random() * 10000).toString(),
            costBasis: parseFloat((Math.random() * 10000 + 1).toFixed(2)),
        };
        await microApiSdk.addAsset(randomData);
        dispatch(fetchAssets());
        triggerRefresh();
    };

    const handleDeleteAssetById = async (forcedId?: string) => {
        if (deleteAssetId.trim() === "" && !forcedId) {
            alert("Please enter a valid asset ID.");
            return;
        }
        await microApiSdk.deleteAssetById(forcedId || deleteAssetId);
        setDeleteAssetId("");
        dispatch(fetchAssets());
        await recalculatePortfolio();
    };

    const generateAssetValues = async () => {
        setRefreshingAssets(true);
        await microApiSdk.generateAssetValues();
        await microApiSdk.recalculatePortfolio();
        dispatch(fetchAssets());
        setRefreshingAssets(false);
        triggerRefresh();
    };

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddCustomAsset = async () => {
        const {
            assetType,
            smartContractAddress,
            quantity,
            tokenId,
            costBasis,
            tokenDescription,
        } = formData;
        const customAssetData = {
            assetType,
            smartContractAddress,
            quantity: quantity ? parseFloat(quantity) : undefined,
            tokenId: tokenId ? String(tokenId) : undefined,
            costBasis: costBasis ? parseFloat(costBasis) : undefined,
            tokenDescription,
        };
        await microApiSdk.addAsset(customAssetData);
        dispatch(fetchAssets());
        handleCloseModal();
    };

    return (
        <PageWrapper>
            <Box
                sx={{
                    padding: "1rem",
                    background: "#FFF",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Box
                    sx={{
                        marginBottom: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <Button
                        onClick={handleAddRandomERC20}
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                    >
                        Add Random ERC20
                    </Button>
                    <Button
                        onClick={handleAddRandomERC721}
                        variant="contained"
                        startIcon={<AddIcon />}
                    >
                        Add Random ERC721
                    </Button>
                    <Button
                        onClick={handleOpenModal}
                        variant="contained"
                        startIcon={<AddIcon />}
                    >
                        Add Custom Asset
                    </Button>
                    <Button
                        onClick={handleDeleteAll}
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                    >
                        Delete All Assets
                    </Button>
                </Box>

                <AssetTable onDelete={handleDeleteAssetById} />

                <PortfolioSummary
                    onRefresh={(fn) => (portfolioRef.current = fn)}
                />

                <Dialog open={openModal} onClose={handleCloseModal}>
                    <DialogTitle>Add Custom Asset</DialogTitle>
                    <DialogContent>
                        <TextField
                            select
                            label="Asset Type"
                            name="assetType"
                            value={formData.assetType}
                            onChange={handleInputChange}
                            fullWidth
                            margin="dense"
                        >
                            <MenuItem value="ERC-20">ERC-20</MenuItem>
                            <MenuItem value="ERC-721">ERC-721</MenuItem>
                        </TextField>
                        <TextField
                            label="Smart Contract Address (Not checked atm, enter 0x0 if you like)"
                            name="smartContractAddress"
                            value={formData.smartContractAddress}
                            onChange={handleInputChange}
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            label="Quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            fullWidth
                            margin="dense"
                            type="number"
                            disabled={formData.assetType === "ERC-721"}
                        />
                        <TextField
                            label="Token ID"
                            name="tokenId"
                            value={formData.tokenId}
                            onChange={handleInputChange}
                            fullWidth
                            margin="dense"
                            type="number"
                            disabled={formData.assetType === "ERC-20"}
                        />
                        <TextField
                            label="Cost Basis"
                            name="costBasis"
                            value={formData.costBasis}
                            onChange={handleInputChange}
                            fullWidth
                            margin="dense"
                            type="number"
                        />
                        <TextField
                            label="Token Description"
                            name="tokenDescription"
                            value={formData.tokenDescription}
                            onChange={handleInputChange}
                            fullWidth
                            margin="dense"
                        />
                    </DialogContent>
                    <DialogActions sx={{ pb: 3 }}>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleCloseModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddCustomAsset}
                        >
                            Add Asset
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Box
                sx={{
                    p: "1rem",
                    display: "flex",
                    justifyContent: "flex-end",
                    background: "linear-gradient(180deg, #FFFFFF, #FFFAF5)",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Button
                    onClick={generateAssetValues}
                    sx={{ width: "320px" }}
                    variant="contained"
                    startIcon={
                        refreshingAssets ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            <AttachMoneyIcon />
                        )
                    }
                    disabled={refreshingAssets}
                >
                    {refreshingAssets
                        ? "Refreshing..."
                        : "Mock 6 Months Of Value"}
                </Button>
                <Button
                    onClick={updateDailyPrice}
                    sx={{ width: "320px", ml: "1rem" }}
                    variant="contained"
                    startIcon={
                        updatingPrice ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            <AttachMoneyIcon />
                        )
                    }
                    disabled={updatingPrice}
                >
                    {refreshingAssets
                        ? "Updating..."
                        : "Update Daily Price (Mock)"}
                </Button>
                <Button
                    onClick={recalculatePortfolio}
                    variant="contained"
                    sx={{ ml: "1rem", width: "260px" }}
                    startIcon={
                        recalculatingPortfolio ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            <AttachMoneyIcon />
                        )
                    }
                    disabled={refreshingAssets || recalculatingPortfolio}
                >
                    {recalculatingPortfolio
                        ? "Recalculating..."
                        : "Recalculate Portfolio"}
                </Button>
            </Box>
        </PageWrapper>
    );
};

export default AssetManagementPage;
