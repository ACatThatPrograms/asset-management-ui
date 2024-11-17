import axios, { AxiosInstance, AxiosResponse } from "axios";
import { getEnv } from "./checkEnv";

export type AddAssetDto = {
    tokenDescription: string;
    assetType: string;
    smartContractAddress: string;
    quantity?: number;
    tokenId?: string;
    costBasis?: number;
};

export type HistoryData = {
    created_at: string;
    price: number;
};

export type PortfolioData = {
    total_value: string;
    last_updated: string;
    total_basis: string;
    pnl: number;
};

class MicroApiSdk {
    private apiClient: AxiosInstance;
    private developmentJwt: string | null = null;

    constructor() {
        this.apiClient = axios.create({
            baseURL: getEnv("VITE_METAVERSAL_BACKEND_BASE_URL"),
        });
    }

    public async authenticateUser(
        privyToken: string | null
    ): Promise<AxiosResponse> {
        if (!privyToken) {
            throw new Error("Missing privyToken on authenticateUser request");
        }
        const response = await this.apiClient.post("/auth", {
            privy_token: privyToken,
        });
        if (response.data.developmentJwt) {
            this.developmentJwt = response.data.developmentJwt;
        }
        return response;
    }

    private getAuthHeaders() {
        return this.developmentJwt
            ? { headers: { Authorization: `Bearer ${this.developmentJwt}` } }
            : { withCredentials: true };
    }

    public async getAssets() {
        return this.apiClient.get("/assets", this.getAuthHeaders());
    }

    public async deleteAllAssets() {
        return this.apiClient.delete("/assets", this.getAuthHeaders());
    }

    public async deleteAssetById(assetId: string) {
        return this.apiClient.delete(
            `/assets/${assetId}`,
            this.getAuthHeaders()
        );
    }

    public async addAsset(assetData: AddAssetDto) {
        return this.apiClient.post("/assets", assetData, this.getAuthHeaders());
    }

    public async generateAssetValues() {
        return await this.apiClient.post(
            "/portfolio/backfill-price-data",
            {},
            this.getAuthHeaders()
        );
    }

    public async getAssetHistory(assetId: string): Promise<HistoryData[]> {
        const res = await this.apiClient.get(
            `/assets/${assetId}/history`,
            this.getAuthHeaders()
        );
        return res.data;
    }

    public async getPortfolioData(): Promise<PortfolioData> {
        const res = await this.apiClient.get(
            `/portfolio`,
            this.getAuthHeaders()
        );
        return res.data;
    }

    public async getNewAssets() {
        const res = await this.apiClient.get(
            `/assets/new-get-assets`,
            this.getAuthHeaders()
        );
        return res.data;
    }

    public async updateDailyPrices() {
        return await this.apiClient.post(
            `/assets/update-prices`,
            {},
            this.getAuthHeaders()
        );
    }

    public async recalculatePortfolio() {
        return await this.apiClient.post(
            `/portfolio/recalculate`,
            {},
            this.getAuthHeaders()
        );
    }
}

export const microApiSdk = new MicroApiSdk();
