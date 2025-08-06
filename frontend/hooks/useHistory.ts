import { useCallback, useEffect, useState } from 'react';
import { deleteHistoryByAnalysisId, fetchUserHistory } from '../services/historyApi';
import { GroupedHistory, HistoryItem } from '../types';
import { groupHistoryByMonth } from '../utils/dateUtils';
import { transformAPIDataToHistoryItems } from '../utils/historyUtils';

export const useHistory = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupedHistory, setGroupedHistory] = useState<GroupedHistory[]>([]);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiHistories = await fetchUserHistory();
      const historyItems: HistoryItem[] = transformAPIDataToHistoryItems(apiHistories);
      setGroupedHistory(groupHistoryByMonth(historyItems));
    } catch (err: any) {
      setError('Failed to load history. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
  };

  const handleDelete = async (analysisId: number) => {
    setLoading(true);
    try {
      await deleteHistoryByAnalysisId(analysisId);
      await loadHistory();
    } catch (err: any) {
      setError('Failed to delete history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    loading,
    refreshing,
    error,
    groupedHistory,
    onRefresh,
    handleDelete,
  };
};