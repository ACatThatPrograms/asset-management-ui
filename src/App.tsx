import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import AssetManagementPage from "./pages/AssetManagementPage";
import { PrivyProvider } from "@privy-io/react-auth";
import "./App.css";
import { getEnv } from "./utils/checkEnv";
import AuthChecker from "./components/AuthChecker";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme/theme";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <PrivyProvider appId={getEnv("VITE_PRIVY_APP_ID")}>
                <Router>
                    <AuthChecker />
                    <Routes>
                        <Route path="/" element={<SplashPage />} />
                        <Route
                            path="/asset-management"
                            element={<AssetManagementPage />}
                        />
                    </Routes>
                </Router>
            </PrivyProvider>
        </ThemeProvider>
    );
}

export default App;
