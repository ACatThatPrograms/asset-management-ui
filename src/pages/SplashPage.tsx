import { useState } from "react";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setDevelopmentJwt } from "../redux/slices/developmentTokenSlice";
import { microApiSdk } from "../utils/microApiSdk";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Paper,
} from "@mui/material";

const SplashPage = () => {
    const { getAccessToken, authenticated, ready } = usePrivy();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { login } = useLogin({
        onComplete: () => {
            setLoading(false);
            initJwpForPrivyTokenSwap();
        },
        onError: () => {
            setLoading(false);
        },
    });

    const handleFullLogin = async () => {
        setLoading(true);
        if (!authenticated || !ready) {
            login();
        } else if (authenticated && ready) {
            initJwpForPrivyTokenSwap();
        }
    };

    async function initJwpForPrivyTokenSwap() {
        const privyAccessToken = await getAccessToken();
        const res = await microApiSdk.authenticateUser(privyAccessToken);
        if (res.data.message === "Login successful") {
            setLoading(false);
            if (res.data.developmentJwt) {
                dispatch(setDevelopmentJwt(res.data.developmentJwt));
            }
            navigate("/asset-management");
        }
    }

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100%",
                background: "linear-gradient(180deg, #F9FAFA, #E0E0E0)",
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: "2rem",
                    width: "350px",
                    textAlign: "center",
                    borderRadius: "10px",
                    background: "linear-gradient(to bottom, #FFF, #F9FAFA)",
                    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Box sx={{ marginBottom: "1.5rem" }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "0.5rem",
                            color: "#4426D9",
                        }}
                    >
                        Asset Management Login
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ color: "#555" }}
                    >
                        Please login using Privy.IO to access your account
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    onClick={handleFullLogin}
                    disabled={loading}
                    fullWidth
                    sx={{
                        fontSize: "16px",
                        padding: "0.75rem",
                        borderRadius: "5px",
                        background:
                            "linear-gradient(to right, #FF0073, #811AB8, #4426D9)",
                        color: "#fff",
                        "&:hover": {
                            background:
                                "linear-gradient(to right, #FF3388, #9338D1, #5535E0)",
                        },
                    }}
                >
                    {loading ? (
                        <CircularProgress size={24} style={{ color: "#fff" }} />
                    ) : (
                        "Login"
                    )}
                </Button>
            </Paper>
        </Box>
    );
};

export default SplashPage;
