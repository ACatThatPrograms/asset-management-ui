import React, { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoggedIn } from "../redux/slices/authSlice";
import { microApiSdk } from "../utils/microApiSdk";

const AuthChecker: React.FC = () => {
    const { getAccessToken, authenticated, ready } = usePrivy();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            if (ready && !authenticated) {
                navigate("/");
            }
            if (!authenticated || !ready) {
                return;
            }
            try {
                const privyToken = await getAccessToken();
                if (!privyToken) {
                    throw new Error("No Privy token available");
                }
                try {
                    await microApiSdk.authenticateUser(privyToken);
                } catch (ex) {
                    console.warn("Auto auth check failed", ex);
                    return;
                }
                dispatch(setLoggedIn(true));
                if (location.pathname == "/") {
                    navigate("/asset-management");
                }
            } catch (error) {
                console.error("Authentication failed:", error);
                navigate("/");
            }
        };

        checkAuth();
    }, [navigate, dispatch, getAccessToken, authenticated, ready]);

    return <></>;
};

export default AuthChecker;
