import React from "react";
import { Box, Container } from "@mui/material";
import NavigationBar from "./NavigationBar";

interface PageWrapperProps {
    children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
    return (
        <Box
            sx={{
                minWidth: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                pt: "2rem"
            }}
        >
            <Container maxWidth="lg">
                <NavigationBar />
                {children}
            </Container>
        </Box>
    );
};

export default PageWrapper;
