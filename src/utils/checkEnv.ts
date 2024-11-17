const requiredEnvVariables = [
    "VITE_METAVERSAL_BACKEND_BASE_URL",
    "VITE_PRIVY_APP_ID",
];

export const checkEnvVariables = () => {
    requiredEnvVariables.forEach((variable) => {
        if (!import.meta.env[variable]) {
            throw `Environment variable ${variable} is not set.`;
        }
    });
};

export type AvailableEnv =
    | "VITE_PRIVY_APP_ID"
    | "VITE_METAVERSAL_BACKEND_BASE_URL";

export const getEnv = (key: AvailableEnv) => {
    return import.meta.env[key] || false;
};
