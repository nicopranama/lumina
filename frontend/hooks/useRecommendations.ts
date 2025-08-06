import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { getAllRecommendations, getRecommendationsByAnalysisId, SkincareRecommendation } from '../services/api';

export interface CategoryData {
  title: string;
  products: SkincareRecommendation[];
}

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromHistory, setIsFromHistory] = useState(false);

  // Function to group recommendations by skincare type
  const groupRecommendationsByType = (recs: SkincareRecommendation[]): CategoryData[] => {
    const grouped = recs.reduce((acc, rec) => {
      const type = rec.skincare_type || 'Other';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(rec);
      return acc;
    }, {} as Record<string, SkincareRecommendation[]>);

    return Object.keys(grouped).map(type => ({
      title: type,
      products: grouped[type]
    }));
  };

  // Check if this page is accessed from history
  const checkIfFromHistory = useCallback(async () => {
    try {
      const fromHistory = await AsyncStorage.getItem('viewingHistoryRecommendations');
      setIsFromHistory(fromHistory === 'true');
    } catch (error) {
      console.error('Error checking history status:', error);
    }
  }, []);

  const loadRecommendations = async () => {
    try {
      setError(null);
      
      // Check if we're viewing from history
      const fromHistory = await AsyncStorage.getItem('viewingHistoryRecommendations');
      const historyAnalysisId = await AsyncStorage.getItem('historyAnalysisId');
      
      if (fromHistory === 'true' && historyAnalysisId) {
        // Load recommendations for specific analysis from history
        console.log('Loading recommendations for analysis:', historyAnalysisId);
        const analysisRecs = await getRecommendationsByAnalysisId(parseInt(historyAnalysisId));
        const groupedRecs = groupRecommendationsByType(analysisRecs);
        setRecommendations(groupedRecs);
      } else {
        // First, try to get latest recommendations from AsyncStorage
        const latestRecsString = await AsyncStorage.getItem('latestRecommendations');
        
        if (latestRecsString) {
          const latestRecs: SkincareRecommendation[] = JSON.parse(latestRecsString);
          const groupedRecs = groupRecommendationsByType(latestRecs);
          setRecommendations(groupedRecs);
          console.log('Loaded latest recommendations:', groupedRecs);
        } else {
          // If no latest recommendations, try to get all recommendations from backend
          const allRecs = await getAllRecommendations();
          const groupedRecs = groupRecommendationsByType(allRecs);
          setRecommendations(groupedRecs);
          console.log('Loaded all recommendations:', groupedRecs);
        }
      }
      
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setError('Failed to load recommendations. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecommendations();
  };

  useEffect(() => {
    checkIfFromHistory();
    loadRecommendations();
  }, [checkIfFromHistory]);

  return {
    recommendations,
    loading,
    refreshing,
    error,
    isFromHistory,
    onRefresh,
    loadRecommendations,
  };
}; 