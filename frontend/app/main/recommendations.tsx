import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import CategorySection from '../../components/CategorySection';
import ScreenWrapper from '../../components/myscreenwrapper';
import Typo from '../../components/typography';
import { colors } from '../../constants/theme';
import { useRecommendations } from '../../hooks/useRecommendations';
import { moderateScale, scale, verticalScale } from '../../utils/styling';



const RecommendationsPage: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { 
    recommendations, 
    loading, 
    refreshing, 
    error, 
    isFromHistory, 
    onRefresh 
  } = useRecommendations();

  const handleBack = () => {
    router.back(); 
  };



  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBack}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <CaretLeft weight="bold" size={moderateScale(25)} color={colors.black} />
            </TouchableOpacity>
            <Typo style={styles.headerTitle}>
              {isFromHistory ? 'History Results' : 'Recommendations'}
            </Typo>
            <View style={styles.headerRightPlaceholder} />
          </View>
          
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.black} />
            <Typo style={styles.loadingText}>Loading recommendations...</Typo>
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
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBack}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <CaretLeft weight="bold" size={moderateScale(25)} color={colors.black} />
            </TouchableOpacity>
            <Typo style={styles.headerTitle}>
              {isFromHistory ? 'History Results' : 'Recommendations'}
            </Typo>
            <View style={styles.headerRightPlaceholder} />
          </View>
          
          <View style={styles.errorContainer}>
            <Typo style={styles.errorText}>{error}</Typo>
            <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
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
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <CaretLeft weight="bold" size={moderateScale(25)} color={colors.black} />
          </TouchableOpacity>
          <Typo style={styles.headerTitle}>
            {isFromHistory ? 'History Results' : 'Recommendations'}
          </Typo>
          <View style={styles.headerRightPlaceholder} />
        </View>

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
          {recommendations.length > 0 ? (
            <>
              {isFromHistory && (
                <View style={styles.historyBanner}>
                  <Typo style={styles.historyBannerText}>
                    Previous Analysis Results
                  </Typo>
                </View>
              )}
              {recommendations.map((category, index) => (
                <CategorySection key={index} category={category} />
              ))}
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Typo style={styles.emptyText}>No recommendations available</Typo>
              <Typo style={styles.emptySubtext}>
                {isFromHistory 
                  ? 'This analysis has no recommendations available'
                  : 'Upload a photo to get personalized skincare recommendations'
                }
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
    marginLeft: scale(-50), 
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
  historyBanner: {
    backgroundColor: colors.neutral100,
    padding: scale(12),
    borderRadius: 8,
    marginBottom: verticalScale(15),
  },
  historyBannerText: {
    fontSize: moderateScale(14),
    fontFamily: 'Sf-Medium',
    color: colors.neutral600,
    textAlign: 'center',
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
    paddingHorizontal: scale(20),
    marginTop: verticalScale(100),
  },
  emptyText: {
    fontSize: moderateScale(18),
    fontFamily: 'Sf-Bold',
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  emptySubtext: {
    fontSize: moderateScale(14),
    color: colors.textDarkGrey,
    textAlign: 'center',
  },
});

export default RecommendationsPage;