import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
    Dialog,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import AssetHistory from "./AssetHistory";
import { Asset } from "../redux/slices/assetSlice";

interface AssetTableProps {
    onDelete: (assetId: string) => void;
}

const tableStyles = {
    fontSize: "10px",
    header: {
        fontWeight: "bold",
        color: "#333",
    },
    columnWidths: {
        name: "7%",
        type: "7%",
        chain: "6%",
        contract: "12%",
        quantity: "6%",
        tokenId: "8%",
        unitBasis: "10%",
        totalBasis: "10%",
        unitPrice: "10%",
        currentValue: "10%",
        profitLoss: "10%",
        delete: "4%",
        history: "4%",
    },
    link: {
        color: "#4a90e2",
        textDecoration: "none",
        transition: "color 0.2s",
    },
};

const AssetTable: React.FC<AssetTableProps> = ({ onDelete }) => {
    const { assets } = useSelector((state: RootState) => state.assets);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

    const handleOpenHistoryModal = (assetId: string) => {
        setSelectedAssetId(assetId);
        setIsHistoryModalOpen(true);
    };

    const handleCloseHistoryModal = () => {
        setIsHistoryModalOpen(false);
        setSelectedAssetId(null);
    };

    const renderRow = (asset: Asset) => {
        const totalBasis =
            Number(asset.cost_basis) * Number(asset.quantity_owned || 1);
        const currentValue =
            Number(asset.latest_price) * Number(asset.quantity_owned || 1);
        const profitLoss = currentValue - totalBasis;

        return (
            <TableRow key={asset.id} hover>
                <TableCell sx={{ fontSize: tableStyles.fontSize }}>
                    {asset.token_name}
                </TableCell>
                <TableCell sx={{ fontSize: tableStyles.fontSize }}>
                    {asset.asset_type}
                </TableCell>
                <TableCell sx={{ fontSize: tableStyles.fontSize }}>
                    {asset.chain}
                </TableCell>
                <TableCell sx={{ fontSize: tableStyles.fontSize }}>
                    {asset.smart_contract_address ? (
                        <a
                            href={`https://etherscan.io/address/${asset.smart_contract_address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={tableStyles.link}
                        >
                            {`${asset.smart_contract_address.slice(
                                0,
                                6
                            )}...${asset.smart_contract_address.slice(-4)}`}
                        </a>
                    ) : (
                        "-"
                    )}
                </TableCell>
                <TableCell sx={{ fontSize: tableStyles.fontSize }}>
                    {asset.quantity_owned || "-"}
                </TableCell>
                <TableCell sx={{ fontSize: tableStyles.fontSize }}>
                    {asset.token_id || "-"}
                </TableCell>
                <TableCell sx={{ fontSize: tableStyles.fontSize }}>
                    {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                    }).format(Number(asset.cost_basis))}
                </TableCell>
                <TableCell sx={{ fontSize: tableStyles.fontSize }}>
                    {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                    }).format(totalBasis)}
                </TableCell>
                <TableCell sx={{ fontSize: tableStyles.fontSize }}>
                    {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                    }).format(Number(asset.latest_price))}
                </TableCell>
                <TableCell sx={{ fontSize: tableStyles.fontSize }}>
                    {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                    }).format(currentValue)}
                </TableCell>
                <TableCell
                    sx={{
                        fontSize: tableStyles.fontSize,
                        color:
                            profitLoss > 0
                                ? "#4caf50"
                                : profitLoss < 0
                                ? "#f44336"
                                : "#666",
                    }}
                >
                    {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                    }).format(profitLoss)}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                    <IconButton
                        onClick={() => onDelete(asset.id)}
                        color="error"
                    >
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                    <IconButton
                        onClick={() => handleOpenHistoryModal(asset.id)}
                        color="primary"
                    >
                        <HistoryIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    };

    if (assets.length === 0) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    padding: "1rem",
                }}
            >
                <Typography color="textSecondary" variant="body1">
                    You have no assets added yet.
                </Typography>
            </Box>
        );
    }

    return (
        <TableContainer
            component={Paper}
            sx={{
                maxHeight: "45vh",
                marginTop: "20px",
                maxWidth: "100%",
                overflowY: "auto",
            }}
        >
            <Table
                size="small"
                aria-label="assets table"
                sx={{ tableLayout: "fixed", width: "100%" }}
            >
                <TableHead>
                    <TableRow>
                        {Object.keys(tableStyles.columnWidths).map(
                            (header, index) => (
                                <TableCell
                                    key={header}
                                    sx={{
                                        width: Object.values(
                                            tableStyles.columnWidths
                                        )[index],
                                        ...tableStyles.header,
                                        fontSize: tableStyles.fontSize,
                                    }}
                                >
                                    {header.charAt(0).toUpperCase() +
                                        header.slice(1).replace(/_/g, " ")}
                                </TableCell>
                            )
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>{assets.map(renderRow)}</TableBody>
            </Table>
            <Dialog
                open={isHistoryModalOpen}
                onClose={handleCloseHistoryModal}
                maxWidth="xl"
            >
                {selectedAssetId && <AssetHistory assetId={selectedAssetId} />}
            </Dialog>
        </TableContainer>
    );
};

export default AssetTable;
