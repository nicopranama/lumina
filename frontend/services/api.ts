// services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SkincareRecommendation {
  recommendation_id: number;
  analysis_id: number;
  skincare_name: string;
  skincare_type: string;
  description: string;
}

// Function to get auth token
const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Function to get all skincare recommendations
export const getAllRecommendations = async (): Promise<SkincareRecommendation[]> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`http://192.168.102.47:8080/skincare_recommendation/dashboard/recommendations`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch recommendations: ${response.status}`);
    }

    const recommendations: SkincareRecommendation[] = await response.json();
    return recommendations;
  } catch (error) {
    console.error('Error fetching all recommendations:', error);
    throw error;
  }
};

export const getRecommendationsByAnalysisId = async (analysisId: number): Promise<SkincareRecommendation[]> => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`http://192.168.102.47:8080/skincare_recommendation?analysis_id=${analysisId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch recommendations for analysis: ${response.status}`);
    }

    const recommendations: SkincareRecommendation[] = await response.json();
    return recommendations;
  } catch (error) {
    console.error('Error fetching recommendations by analysis ID:', error);
    throw error;
  }
};