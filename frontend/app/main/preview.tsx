import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/button';
import Modal from '../../components/modal';
import Typo from '../../components/typography';
import { colors } from '../../constants/theme';
import { uploadImageForAnalysis } from '../../services/imageService';
import { moderateScale, scale, verticalScale } from '../../utils/styling';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PreviewModalProps {
  isVisible: boolean;
  initialImageUri: string | null;
  onClose: () => void;
  onAnalyze: () => void; 
}

const PreviewModal: React.FC<PreviewModalProps> = ({ 
  isVisible, 
  initialImageUri, 
  onClose, 
  onAnalyze 
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImageUri);
  const [imageAspect, setImageAspect] = useState<number>(4/3);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setSelectedImage(initialImageUri);
    
    if (initialImageUri) {
      Image.getSize(initialImageUri, (width, height) => {
        setImageAspect(width / height);
      }, error => {
        console.log('Error getting image dimensions:', error);
      });
    }
  }, [initialImageUri]);

  const uploadAndAnalyze = async () => {
    if (!selectedImage) {
      alert('No image to analyze!');
      return;
    }

    setLoading(true);

    try {
      const data = await uploadImageForAnalysis(selectedImage);
      onClose();

      router.push({
        pathname: '/main/recommendations',
        params: { recommendation: JSON.stringify(data.recommendation) }
      });

    } catch (error: any) {
      alert('Upload and analyze failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isVisible} 
      position="bottom"
      onClose={onClose}
    >
      <View style={styles.previewModalContent}>
        {/* Header dan image preview sama seperti kamu */}
        <View style={styles.previewModalHeader}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color={colors.black} />
          </TouchableOpacity>
          <Typo style={styles.previewModalTitle}>Preview</Typo>
          <View style={styles.headerRightPlaceholder} />
        </View>

        <View style={styles.imagePreviewContainer}>
          {selectedImage ? (
            <Image 
              source={{ uri: selectedImage }} 
              style={[styles.selectedImage, { aspectRatio: imageAspect }]}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.imagePreview}>
              <Typo style={styles.imagePlaceholder}>Image Photo</Typo>
            </View>
          )}
        </View>

        <View style={styles.actionButtonsContainer}>
          <Button 
            style={styles.analyzeButton}
            onPress={uploadAndAnalyze}
            disabled={loading}
          >
            <Typo style={styles.analyzeButtonText}>
              {loading ? 'Analyzing...' : 'Analyze'}
            </Typo>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  previewModalContent: {
    width: '100%',
    paddingHorizontal: scale(20),
  },
  previewModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
    paddingVertical: verticalScale(10),
  },
  previewModalTitle: {
    fontSize: moderateScale(20),
    fontFamily: 'Sf-Medium',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    width: 40,
    alignItems: 'flex-start',
  },
  headerRightPlaceholder: {
    width: 40,
  },
  imagePreviewContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
    minHeight: verticalScale(120),
    maxHeight: verticalScale(300),
  },
  imagePreview: {
    width: '100%',
    height: verticalScale(160),
    borderRadius: 12,
    backgroundColor: colors.neutral50 || '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    borderRadius: 12,
    maxHeight: verticalScale(280),
  },
  imagePlaceholder: {
    color: colors.textLightGrey || '#9E9E9E',
    fontSize: moderateScale(16),
  },
  actionButtonsContainer: {
    width: '100%',
    marginBottom: verticalScale(10),
  },
  analyzeButton: {
    width: '100%',
    height: verticalScale(55),
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  analyzeButtonText: {
    color: colors.white,
    fontSize: moderateScale(16),
    fontFamily: 'Sf-Medium',
  }
});

export default PreviewModal;