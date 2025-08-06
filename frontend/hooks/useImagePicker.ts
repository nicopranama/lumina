import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';

export const useImagePicker = () => {
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const handleAddPhoto = async (): Promise<string | undefined> => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setSelectedImageUri(imageUri);
        await AsyncStorage.setItem('selectedImageUri', imageUri);
        return imageUri;
      }
      return undefined;
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to select image. Please try again.');
      return undefined;
    }
  };

  return {
    selectedImageUri,
    setSelectedImageUri,
    handleAddPhoto,
  };
}; 