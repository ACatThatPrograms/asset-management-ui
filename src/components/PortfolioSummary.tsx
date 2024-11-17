import React, { useEffect, useState, useCallback } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    CircularProgress,
    Typography,
    Box,
    Paper,
} from "@mui/material";
import { microApiSdk, PortfolioData } from "../utils/microApiSdk";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface PortfolioSummaryProps {
    onRefresh?: (refreshFn: () => Promise<void>) => void;
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ onRefresh }) => {
    const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
        null
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

    const fetchPortfolioData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await microApiSdk.getPortfolioData();
            setPortfolioData(data);
            setError(null);
        } catch (err) {
            console.error("Error fetching portfolio data:", err);
            setError("Failed to load portfolio data.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            fetchPortfolioData();
        }
    }, [isLoggedIn, fetchPortfolioData]);

    useEffect(() => {
        if (onRefresh) {
            onRefresh(fetchPortfolioData);
        }
    }, [onRefresh, fetchPortfolioData]);

    return (
        <TableContainer
            component={Paper}
            sx={{
                width: "100%",
                border: "1px solid rgba(224, 224, 224, 1)",
                borderRadius: "8px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                marginTop: "1rem",
                overflow: "hidden",
            }}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                padding="0.5rem"
                sx={{
                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                }}
            >
                <Typography variant="h6" color="primary">
                    Portfolio Summary
                </Typography>
                {loading && <CircularProgress size={16} />}
            </Box>
            {error ? (
                <Typography color="error" align="center" padding="1rem">
                    {error}
                </Typography>
            ) : portfolioData ? (
                <Table
                    size="small"
                    sx={{
                        "& .MuiTableCell-root": {
                            padding: "8px",
                            borderBottom: "1px solid rgba(224, 224, 224, 1)",
                        },
                    }}
                >
                    <TableBody>
                        <TableRow>
                            <TableCell
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    color: "#333",
                                }}
                            >
                                Total Basis
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{ fontSize: "14px", color: "#333" }}
                            >
                                {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(Number(portfolioData.total_basis))}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    color: "#333",
                                }}
                            >
                                Total Value
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{ fontSize: "14px", color: "#333" }}
                            >
                                {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(Number(portfolioData.total_value))}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    color: "#333",
                                }}
                            >
                                P&L
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{
                                    fontSize: "14px",
                                    color:
                                        Number(portfolioData.pnl) > 0
                                            ? "green"
                                            : Number(portfolioData.pnl) < 0
                                            ? "red"
                                            : "#333",
                                }}
                            >
                                {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(Number(portfolioData.pnl))}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell
                                sx={{
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    color: "#333",
                                }}
                            >
                                Last Updated
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{ fontSize: "14px", color: "#333" }}
                            >
                                {new Date(
                                    portfolioData.last_updated
                                ).toLocaleString()}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            ) : (
                <Typography color="textSecondary" align="center" padding="1rem">
                    No portfolio data available.
                </Typography>
            )}
        </TableContainer>
    );
};

export default PortfolioSummary;
