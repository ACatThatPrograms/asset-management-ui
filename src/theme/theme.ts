import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#4426D9",
        },
    },
    typography: {
        fontFamily: "Roboto Flex, sans-serif",
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "100px",
                },
                containedPrimary: {
                    fontWeight: 800,
                    boxShadow: "none",
                    background:
                        "linear-gradient(180deg, #FF0073 -114.9%, #811AB8 -51.51%, #4426D9 100%)",
                    color: "#fff",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: ".75rem",
                    height: "35px",
                    "&:hover": {
                        background:
                            "linear-gradient(180deg, #FF0073 -85.89%, #811AB8 34.45%, #4426D9 100%)",
                        boxShadow: "none",
                    },
                    "&.Mui-disabled": {
                        background: "#A6A1C1",
                        color: "#E0DEEA",
                        boxShadow: "none",
                    },
                },
                outlinedPrimary: {
                    boxSizing: "border-box",
                    alignItems: "center",
                    padding: ".75rem",
                    gap: "8px",
                    height: "35px",
                    border: "1px solid #361FAD",
                    color: "#4426D9",
                    "&:hover": {
                        background: "#ECE9FB",
                    },
                },
            },
        },
    },
});
