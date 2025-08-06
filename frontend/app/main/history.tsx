// app/main/history.tsx 
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import MonthSection from '../../components/history/MonthSection';
import ScreenWrapper from '../../components/myscreenwrapper';
import Typo from '../../components/typography';
import { colors } from '../../constants/theme';
import { checkLoggedIn, deleteHistoryByAnalysisId, fetchUserHistory } from '../../services/historyApi';
import { HistoryItem } from '../../types';
import { formatDate, groupHistoryByMonth } from '../../utils/dateUtils';
import { transformAPIDataToHistoryItems } from '../../utils/historyUtils';
import { moderateScale, scale, verticalScale } from '../../utils/styling';

// --- HistoryPage Component ---
const HistoryPage: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const groupedHistory = groupHistoryByMonth(historyData);

  const loadHistories = useCallback(async () => {
    try {
      setError(null);
      const apiHistories = await fetchUserHistory();
      const transformedHistories = transformAPIDataToHistoryItems(apiHistories);
      setHistoryData(transformedHistories);
    } catch (err: any) {
      console.error('Error loading histories:', err);
      setError(err.message || 'Failed to load history. Please try again.');
      setHistoryData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHistories();
  }, [loadHistories]);

  useEffect(() => {
    const checkLoginAndLoad = async () => {
      try {
        await checkLoggedIn();
        await loadHistories();
      } catch (error) {
        console.error('User not logged in:', error);
        setError('Please log in to view your history');
        setLoading(false);
      }
    };
    checkLoginAndLoad();
  }, [loadHistories]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('History screen focused, reloading data');
      loadHistories();
    });
    return unsubscribe;
  }, [router, loadHistories]);

  const handleBack = () => router.back();
  const handleItemPress = (item: HistoryItem) => {
    const { fullDate } = formatDate(item.analyzed_at);
    router.push({ pathname: '/main/historyresult', params: { date: fullDate, analysisData: JSON.stringify(item) } } as any);
  };
  const handleItemDelete = async (analysisId: number) => {
    try {
      setDeleting(analysisId);
      await deleteHistoryByAnalysisId(analysisId);
      setHistoryData(prev => prev.filter(item => item.analysis_id !== analysisId));
      console.log(`Successfully deleted history for analysis ${analysisId}`);
    } catch (error) {
      console.error('Error deleting history:', error);
      Alert.alert('Delete Failed', 'Failed to delete history. Please check your connection and try again.', [{ text: 'OK' }]);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <CaretLeft weight="bold" size={moderateScale(25)} color={colors.black} />
            </TouchableOpacity>
            <Typo style={styles.headerTitle}>History</Typo>
            <View style={styles.headerRightPlaceholder} />
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.black} />
            <Typo style={styles.loadingText}>Loading history...</Typo>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <CaretLeft weight="bold" size={moderateScale(25)} color={colors.black} />
            </TouchableOpacity>
            <Typo style={styles.headerTitle}>History</Typo>
            <View style={styles.headerRightPlaceholder} />
          </View>
          <View style={styles.errorContainer}>
            <Typo style={styles.errorText}>{error}</Typo>
            <TouchableOpacity style={styles.retryButton} onPress={() => { setLoading(true); setError(null); loadHistories(); }}>
              <Typo style={styles.retryText}>Try Again</Typo>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <CaretLeft weight="bold" size={moderateScale(25)} color={colors.black} />
          </TouchableOpacity>
          <Typo style={styles.headerTitle}>History</Typo>
          <View style={styles.headerRightPlaceholder} />
        </View>
        {groupedHistory.length > 0 ? (
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.black]}
              />
            }
          >
            {deleting && (
              <View style={styles.deletingIndicator}>
                <ActivityIndicator size="small" color={colors.black} />
                <Typo style={styles.deletingText}>Deleting history...</Typo>
              </View>
            )}
            {groupedHistory.map((group, index) => (
              <MonthSection
                key={index}
                group={group}
                onItemPress={handleItemPress}
                onItemDelete={handleItemDelete}
                styles={styles}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <Typo style={styles.emptyTitle}>No History Found</Typo>
            <Typo style={styles.emptySubtitle}>
              You haven't performed any skin analysis yet. Start analyzing your skin to see your history here.
            </Typo>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};
// --- End HistoryPage ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(30),
    marginBottom: verticalScale(15),
    paddingHorizontal: scale(20),
  },
  backButton: {
    paddingTop: verticalScale(2),
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontFamily: 'Sf-Bold',
    textAlign: 'center',
    flex: 1,
    marginLeft: scale(0),
  },
  headerRightPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(30),
  },
  monthSection: {
    marginBottom: verticalScale(25),
  },
  monthTitle: {
    fontSize: moderateScale(18),
    fontFamily: 'Sf-Bold',
    marginBottom: verticalScale(15),
  },
  historyCard: {
    backgroundColor: colors.neutral50,
    borderRadius: 12,
    marginBottom: verticalScale(10),
    padding: scale(15),
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: scale(15),
  },
  historyImage: {
    width: scale(60),
    height: scale(60),
    borderRadius: 8,
  },
  placeholderImage: {
    width: scale(60),
    height: scale(60),
    borderRadius: 8,
    backgroundColor: colors.neutral200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: moderateScale(10),
    color: colors.neutral500,
    fontFamily: 'Sf-Regular',
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontSize: moderateScale(16),
    fontFamily: 'Sf-Bold',
    marginBottom: verticalScale(2),
  },
  recommendationCount: {
    fontSize: moderateScale(12),
    color: colors.neutral600,
    fontFamily: 'Sf-Regular',
    marginBottom: verticalScale(2),
  },
  viewResultText: {
    fontSize: moderateScale(14),
    color: colors.neutral500,
    fontFamily: 'Sf-Regular',
  },
  deleteButton: {
    padding: scale(5),
  },
  deletingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral100,
    padding: scale(10),
    borderRadius: 8,
    marginBottom: verticalScale(15),
  },
  deletingText: {
    marginLeft: scale(8),
    fontSize: moderateScale(14),
    color: colors.textDarkGrey,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },
  loadingText: {
    marginTop: verticalScale(10),
    fontSize: moderateScale(16),
    color: colors.textDarkGrey,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },
  errorText: {
    fontSize: moderateScale(16),
    color: colors.textDarkGrey,
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  retryButton: {
    backgroundColor: colors.black,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    borderRadius: 8,
  },
  retryText: {
    color: colors.white,
    fontSize: moderateScale(14),
    fontFamily: 'Sf-Medium',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(40),
  },
  emptyTitle: {
    fontSize: moderateScale(18),
    fontFamily: 'Sf-Bold',
    marginBottom: verticalScale(10),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: moderateScale(14),
    color: colors.textDarkGrey,
    fontFamily: 'Sf-Regular',
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },
});

export default HistoryPage;