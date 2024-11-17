import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { useLogout } from "@privy-io/react-auth";
import { setLoggedIn } from "../redux/slices/authSlice";
import { Box, Theme } from "@mui/material";

const useStyles = makeStyles((theme: Theme) => ({
    navigationBar: {
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "36px 20px",
        height: "56px",
        borderBottom: "1px solid #DFDFDF",
        boxShadow: "0px 1px 3px rgba(26, 26, 26, 0.08)",
        minWidth: "100%",
        background: "linear-gradient(180deg, #ECE9FB, #FDEDE7)",
        borderRadius: "10px 10px 0px 0px",
    },
    navLinks: {
        display: "flex",
        gap: "20px",
    },
    navLink: {
        textDecoration: "none",
        color: theme.palette.primary.light,
        fontWeight: "bold",
        "&.active": {
            color: theme.palette.primary.main,
        },
        "&:hover": {
            color: theme.palette.primary.main,
        },
    },
}));

const NavigationBar: React.FC = () => {
    const classes = useStyles();
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { logout } = useLogout({
        onSuccess: () => {
            dispatch(setLoggedIn(false));
            navigate("/");
        },
    });

    const handleLogout = () => {
        logout();
    };

    return (
        isLoggedIn && (
            <nav className={classes.navigationBar}>
                <Box className={classes.navLinks}>
                    <NavLink
                        to="/asset-management"
                        className={({ isActive }) =>
                            `${classes.navLink} ${isActive ? "active" : ""}`
                        }
                    >
                        Asset Management
                    </NavLink>
                </Box>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleLogout}
                >
                    Log Out
                </Button>
            </nav>
        )
    );
};

export default NavigationBar;
