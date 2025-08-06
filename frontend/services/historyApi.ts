// services/historyApi.ts - Complete API functions for history management

import AsyncStorage from '@react-native-async-storage/async-storage';
import { History, HistoryItemFromAPI } from '../types';

export const checkLoggedIn = async (): Promise<{ token: string; userId: string }> => {
  const token = await AsyncStorage.getItem('authToken');
  const userId = await AsyncStorage.getItem('userId');
  console.log('checkLoggedIn token:', token, 'userId:', userId);
  if (!token || !userId) throw new Error('User not logged in');
  return { token, userId };
};

// Delete history entry
export const deleteHistoryEntry = async (historyId: number): Promise<void> => {
  try {
    const { token, userId } = await checkLoggedIn();

    const response = await fetch(`http://192.168.102.47:8080/history/${historyId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete history entry');
    }

    console.log('History entry deleted successfully');
  } catch (error) {
    console.error('Error deleting history entry:', error);
    throw error;
  }
};

// Delete all history entries for a specific analysis
export const deleteHistoryByAnalysisId = async (analysisId: number): Promise<void> => {
  try {
    const { token, userId } = await checkLoggedIn();
    const allHistories = await fetch(`http://192.168.102.47:8080/history?user_id=${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    
    if (!allHistories.ok) {
      throw new Error('Failed to fetch histories for deletion');
    }

    const histories: History[] = await allHistories.json();
    const historiesToDelete = histories.filter(history => history.analysis_id === analysisId);
    const deletePromises = historiesToDelete.map(history => 
      deleteHistoryEntry(history.history_id)
    );

    await Promise.all(deletePromises);
    console.log(`Deleted ${historiesToDelete.length} history entries for analysis ${analysisId}`);
  } catch (error) {
    console.error('Error deleting histories by analysis ID:', error);
    throw error;
  }
};

export const fetchUserHistory = async (): Promise<HistoryItemFromAPI[]> => {
  const token = await AsyncStorage.getItem('authToken');
  if (!token) throw new Error('Unauthorized');
  
  const res = await fetch('http://192.168.102.47:8080/history/user', {
    headers: { Authorization: 'Bearer ' + token },
  });
  
  if (!res.ok) throw new Error('Gagal mengambil data history');
  
  const histories = await res.json();
  
  const fullHistories = await Promise.all(
    histories.map(async (history: any) => {
      const recRes = await fetch(
        `http://192.168.102.47:8080/skincare_recommendation/analysis/${history.analysis_id}`
      );
      const recommendations = await recRes.json();
      return { ...history, recommendations };
    })
  );
  
  return fullHistories;
};