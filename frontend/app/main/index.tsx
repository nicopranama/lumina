import { useAuth } from '@/context/authcontext';
import { useRouter } from 'expo-router';
import { Clock, User } from 'phosphor-react-native';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Button from '../../components/button';
import ScreenWrapper from '../../components/myscreenwrapper';
import Typo from '../../components/typography';
import { colors } from '../../constants/theme';
import { useImagePicker } from '../../hooks/useImagePicker';
import { moderateScale, scale, verticalScale } from '../../utils/styling';
import PreviewModal from './preview';
import ProfileDropdown from './profile';

const HomePage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const { selectedImageUri, setSelectedImageUri, handleAddPhoto } = useImagePicker();

  const handlePhotoSelection = async () => {
    const imageUri = await handleAddPhoto();
    if (imageUri) {
      setShowPreviewModal(true);
    }
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleAnalyze = (): void => {
    setShowPreviewModal(false);
    setTimeout(() => {
      alert('Analysis would start here in a real implementation');
    }, 300);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={() => router.push('/main/history')}>
            <Clock weight="bold" size={moderateScale(27)} color={colors.black} />
          </TouchableOpacity>
          
          <Typo style={styles.headerTitle}>Lumina</Typo>
          
          <View style={styles.profileContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={toggleProfileDropdown} activeOpacity={0.7}>
              <User weight="bold" size={moderateScale(27)} color={colors.black} />
            </TouchableOpacity>
            
            {showProfileDropdown && (
              <ProfileDropdown 
                visible={showProfileDropdown} 
                onClose={() => setShowProfileDropdown(false)} 
              />
            )}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.greetingContainer}>
            <Typo style={styles.greetingTitle}>Hi, {user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : 'Username'}</Typo>
            <Typo style={styles.greetingSubtitle}>Let's explore your skin's story</Typo>
          </View>

          <View style={styles.skinVisualContainer}>
            <Image 
              source={require('../../assets/images/HomeLumina.jpg')} 
              style={styles.skinVisual}
              resizeMode="contain" 
            />
          </View>

          <View style={styles.buttonContainer}>
                      <Button 
            style={styles.addPhotoButton}
            onPress={handlePhotoSelection}
          >
              <Typo style={styles.addPhotoText}>Add Photo</Typo>
            </Button>
          </View>
        </View>
        
        <PreviewModal
          isVisible={showPreviewModal}
          initialImageUri={selectedImageUri}
          onClose={() => setShowPreviewModal(false)}
          onAnalyze={handleAnalyze} 
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: scale(25), 
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: verticalScale(30),
    marginBottom: verticalScale(30),
    position: 'relative',
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontFamily: 'Sf-Bold',
    paddingHorizontal: scale(15),
  },
  iconButton: {
    padding: scale(5),
  },
  profileContainer: {
    position: 'relative',
    alignItems: 'flex-end',
    zIndex: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between', 
  },
  greetingContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: verticalScale(20), 
  },
  greetingTitle: {
    fontSize: moderateScale(33),
    fontFamily: 'Sf-Bold',
    marginBottom: verticalScale(2),
  },
  greetingSubtitle: {
    fontSize: moderateScale(17),
    color: colors.textDarkGrey,
    marginBottom: verticalScale(20),
  },
  skinVisualContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  skinVisual: {
    width: '90%',
    height: verticalScale(430),
    aspectRatio: 360/430,
    maxWidth: scale(360),
    maxHeight: verticalScale(430),
  },
  buttonContainer: {
    marginBottom: verticalScale(50), 
  },
  addPhotoButton: {
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontFamily: 'Sf-Medium',
  },
});

export default HomePage;