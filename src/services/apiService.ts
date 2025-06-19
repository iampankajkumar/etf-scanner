import { AssetItem } from '../types';
import { API_BASE_URL } from '../constants/api';

class ApiService {
  private static instance: ApiService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = API_BASE_URL;
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private async fetchWithTimeout(url: string, options: RequestInit & { timeout?: number } = {}) {
    const { timeout = 8000, ...fetchOptions } = options;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  public async fetchAssetData(symbol: string): Promise<AssetItem> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/api/assets/${symbol}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      throw error;
    }
  }

  public async fetchMultipleAssets(symbols: string[]): Promise<AssetItem[]> {
    try {
      const promises = symbols.map(symbol => this.fetchAssetData(symbol));
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error fetching multiple assets:', error);
      throw error;
    }
  }
}
