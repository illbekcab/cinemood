import axios from 'axios';
import { Recommendation } from '../types';

const API_BASE_URL = 'http://localhost:8000';

export const getRecommendations = async (mood: string): Promise<Recommendation> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/recommend`, { mood });
        const { genres, movies } = response.data;

        return {
            mood,
            genres,
            movies,
            timestamp: Date.now(),
        };
    } catch (error) {
        console.error("Error fetching recommendations from backend:", error);
        throw error;
    }
};
