import React, { useEffect, useState } from "react";
import {
    Box,
    CircularProgress,
    Typography,
    Button,
    ButtonGroup,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
} from "@mui/material";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { HistoryData, microApiSdk } from "../utils/microApiSdk";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import dayjs from "dayjs";
import { Asset } from "../redux/slices/assetSlice";
import { selectAssetById } from "../redux/selectors";

interface AssetHistoryProps {
    assetId: string;
}

interface EnrichedHistoryPoint extends HistoryData {
    pnl?: number;
}

const AssetHistory: React.FC<AssetHistoryProps> = ({ assetId }) => {
    const [loading, setLoading] = useState(true);
    const [historyData, setHistoryData] = useState<EnrichedHistoryPoint[]>([]);
    const [filteredData, setFilteredData] = useState<HistoryData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState("1month");

    const asset: Asset | undefined = useSelector((state: RootState) =>
        selectAssetById(assetId)(state)
    );

    useEffect(() => {
        const fetchHistoryData = async () => {
            try {
                if (!asset) {
                    return;
                }
                setLoading(true);
                const data: HistoryData[] = await microApiSdk.getAssetHistory(
                    assetId
                );
                const enrichedData: EnrichedHistoryPoint[] = data.map(
                    (point) => ({
                        created_at: point.created_at,
                        date: point.created_at,
                        price: Number(point.price),
                        pnl: asset
                            ? Number(point.price) -
                              Number(asset.cost_basis || "0")
                            : 0,
                    })
                );

                setHistoryData(enrichedData);
                setError(null);
            } catch (err: unknown) {
                console.error(err);
                setError("Failed to load asset history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistoryData();
    }, [assetId, asset]);

    useEffect(() => {
        const now = new Date();
        let rangeDate = new Date();
        switch (dateRange) {
            case "1year":
                rangeDate.setFullYear(now.getFullYear() - 1);
                break;
            case "6months":
                rangeDate.setMonth(now.getMonth() - 6);
                break;
            case "3months":
                rangeDate.setMonth(now.getMonth() - 3);
                break;
            case "1month":
                rangeDate.setMonth(now.getMonth() - 1);
                break;
            default:
                rangeDate = now;
        }
        setFilteredData(
            historyData.filter(
                (dataPoint) => new Date(dataPoint.created_at) >= rangeDate
            )
        );
    }, [dateRange, historyData]);

    const highestPrice = (data: HistoryData[]): number => {
        const prices = data.map((e) => Number(e.price));
        const maxPrice = Math.max(...prices);
        return Math.round(maxPrice * 1.5);
    };

    const formatXAxis = (date: string) => {
        switch (dateRange) {
            case "1year":
                return dayjs(date).format("MMM 'YY");
            case "6months":
            case "3months":
                return dayjs(date).format("MMM D");
            case "1month":
                return dayjs(date).format("MMM D");
            default:
                return date;
        }
    };

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    const currentPrice = historyData.length
        ? historyData[historyData.length - 1].price
        : 0;

    const currentPnl = asset
        ? (currentPrice - parseFloat(asset.cost_basis || "0")).toFixed(2)
        : "0.00";

    return (
        <Box
            width="100%"
            sx={{
                py: "2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography
                variant="h6"
                color="primary"
                align="center"
                sx={{ mb: 2 }}
            >
                Price and P&L History for Asset {assetId}
            </Typography>

            {/* Asset Summary Table */}
            <TableContainer
                component={Paper}
                sx={{
                    mb: 3,
                    width: "80%",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Table size="small">
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                                Asset Name
                            </TableCell>
                            <TableCell>{asset?.token_name || "-"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                                Unit Basis
                            </TableCell>
                            <TableCell>
                                {asset
                                    ? `$${parseFloat(
                                          asset.cost_basis || "0"
                                      ).toFixed(2)}`
                                    : "-"}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                                Current Price
                            </TableCell>
                            <TableCell>
                                $
                                {parseFloat(currentPrice.toString()).toFixed(2)}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                                Current P&L
                            </TableCell>
                            <TableCell
                                sx={{
                                    color:
                                        parseFloat(currentPnl) > 0
                                            ? "green"
                                            : "red",
                                }}
                            >
                                ${currentPnl}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Date Range Buttons */}
            <ButtonGroup
                variant="outlined"
                aria-label="date range selector"
                sx={{ marginBottom: "1rem" }}
            >
                <Button
                    onClick={() => setDateRange("1year")}
                    variant={dateRange === "1year" ? "contained" : "outlined"}
                >
                    1 Year
                </Button>
                <Button
                    onClick={() => setDateRange("6months")}
                    variant={dateRange === "6months" ? "contained" : "outlined"}
                >
                    6 Months
                </Button>
                <Button
                    onClick={() => setDateRange("3months")}
                    variant={dateRange === "3months" ? "contained" : "outlined"}
                >
                    3 Months
                </Button>
                <Button
                    onClick={() => setDateRange("1month")}
                    variant={dateRange === "1month" ? "contained" : "outlined"}
                >
                    1 Month
                </Button>
            </ButtonGroup>

            {/* Line Chart */}
            <ResponsiveContainer width={800} height={500}>
                <LineChart
                    data={filteredData}
                    margin={{ top: 20, right: 110, left: 50, bottom: 50 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={formatXAxis} />
                    <YAxis
                        domain={[0, highestPrice(filteredData)]}
                        label={{
                            value: "Price & P&L",
                            angle: -90,
                            position: "insideLeft",
                        }}
                        tickFormatter={(value) =>
                            typeof value === "number"
                                ? `$${value.toFixed(2)}`
                                : ""
                        }
                    />
                    <Tooltip
                        formatter={(value, name) =>
                            typeof value === "number"
                                ? name === "price"
                                    ? `$${value.toFixed(2)}`
                                    : `P&L: $${value.toFixed(2)}`
                                : ""
                        }
                    />

                    <Tooltip
                        formatter={(value: number, name: string) =>
                            name === "price"
                                ? `$${value.toFixed(2)}`
                                : `P&L: $${value.toFixed(2)}`
                        }
                    />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#8884d8"
                        dot={false}
                        name="Price"
                    />
                    <Line
                        type="monotone"
                        dataKey="pnl"
                        stroke="#82ca9d"
                        dot={false}
                        name="P&L"
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default AssetHistory;
