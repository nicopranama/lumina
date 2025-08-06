import { HistoryItem } from '../types';

export const transformAPIDataToHistoryItems = (apiData: any[]): HistoryItem[] => {
  return apiData.map(item => ({
    analysis_id: parseInt(item.analysis_id),
    image_id: 0, // Not provided in API, using default
    image_url: item.image.image_url,
    analyzed_at: item.image.uploaded_at,
    recommendations: item.recommendations.map((rec: any, index: number) => ({
      recommendation_id: index, // Generate ID since not provided
      skincare_name: rec.skincare_name,
      skincare_type: rec.skincare_type,
      description: rec.description,
    }))
  })).sort((a, b) => new Date(b.analyzed_at).getTime() - new Date(a.analyzed_at).getTime());
};