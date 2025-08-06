import { useLocalSearchParams, useRouter } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import CategorySection from '../../components/historyresult/CategorySection';
import ScreenWrapper from '../../components/myscreenwrapper';
import Typo from '../../components/typography';
import { colors } from '../../constants/theme';
import { HistoryItem, RecommendationItem } from '../../types';
import { moderateScale, scale, verticalScale } from '../../utils/styling';

// --- Utility Functions ---
const groupRecommendationsByType = (recommendations: RecommendationItem[] = []) =>
  recommendations.reduce((acc, rec) => {
    if (!acc[rec.skincare_type]) acc[rec.skincare_type] = [];
    acc[rec.skincare_type].push(rec);
    return acc;
  }, {} as Record<string, RecommendationItem[]>);
// --- End Utility Functions ---

// --- ProductCard Component ---
// (HAPUS seluruh definisi komponen ProductCard lokal)
// --- End ProductCard ---

// --- CategorySection Component ---
// (HAPUS seluruh definisi komponen CategorySection lokal)
// --- End CategorySection ---

const HistoryResultPage: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  let analysisData: HistoryItem | null = null;
  try {
    if (params.analysisData && typeof params.analysisData === 'string') {
      analysisData = JSON.parse(params.analysisData);
    }
  } catch (error) {
    console.error('Error parsing analysis data:', error);
  }
  const date = (params.date as string) || 'Unknown Date';
  const groupedRecommendations = groupRecommendationsByType(analysisData?.recommendations);
  const handleBack = () => router.back();
  if (!analysisData) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <CaretLeft weight="bold" size={moderateScale(25)} color={colors.black} />
            </TouchableOpacity>
            <Typo style={styles.headerTitle}>Error</Typo>
            <View style={styles.headerRightPlaceholder} />
          </View>
          <View style={styles.errorContainer}>
            <Typo style={styles.errorTitle}>Unable to Load History</Typo>
            <Typo style={styles.errorSubtitle}>
              The history data could not be loaded. Please try again.
            </Typo>
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
          <Typo style={styles.headerTitle}>{date}</Typo>
          <View style={styles.headerRightPlaceholder} />
        </View>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Analysis Info Banner */}
          <View style={styles.analysisBanner}>
            <Typo style={styles.analysisBannerText}>
              Analysis from {date} • {analysisData.recommendations.length} recommendations
            </Typo>
          </View>
          {Object.entries(groupedRecommendations).map(([categoryTitle, products]) => (
            <CategorySection
              key={categoryTitle}
              categoryTitle={categoryTitle}
              products={products}
              styles={styles}
            />
          ))}
          {Object.keys(groupedRecommendations).length === 0 && (
            <View style={styles.emptyContainer}>
              <Typo style={styles.emptyTitle}>No Recommendations Found</Typo>
              <Typo style={styles.emptySubtitle}>
                This analysis doesn't contain any product recommendations.
              </Typo>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

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
  categorySection: {
    marginTop: verticalScale(20),
  },
  categoryTitle: {
    fontSize: moderateScale(22),
    fontFamily: 'Sf-Bold',
    marginBottom: verticalScale(10),
  },
  productCard: {
    backgroundColor: colors.neutral50,
    borderRadius: 12,
    marginBottom: verticalScale(10),
    padding: scale(15),
  },
  productContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productNameSection: {
    flex: 1,
    paddingRight: scale(10),
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(2),
  },
  productName: {
    fontSize: moderateScale(16),
    fontFamily: 'Sf-Bold',
    flex: 1,
    marginRight: scale(10),
  },
  productPrice: {
    fontSize: moderateScale(16),
    fontFamily: 'Sf-Bold',
    color: colors.black,
  },
  productBrand: {
    fontSize: moderateScale(14),
    fontFamily: 'Sf-Medium',
    color: colors.neutral500,
    marginBottom: verticalScale(5),
  },
  productDescription: {
    fontSize: moderateScale(14),
    fontFamily: 'Sf-Regular',
    color: colors.textDarkGrey,
  },
  expandButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(30),
    height: verticalScale(30),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(40),
  },
  errorTitle: {
    fontSize: moderateScale(18),
    fontFamily: 'Sf-Bold',
    marginBottom: verticalScale(10),
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: moderateScale(14),
    color: colors.textDarkGrey,
    fontFamily: 'Sf-Regular',
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(40),
    paddingVertical: verticalScale(50),
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
   analysisBanner: {
    backgroundColor: colors.neutral100,
    padding: scale(12),
    borderRadius: 8,
    marginBottom: verticalScale(20),
  },
  analysisBannerText: {
    fontSize: moderateScale(14),
    fontFamily: 'Sf-Medium',
    color: colors.neutral600,
    textAlign: 'center',
  },
});

export default HistoryResultPage;