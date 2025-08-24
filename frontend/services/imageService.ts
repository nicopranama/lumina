import { getAuth } from "firebase/auth";

export interface UploadResponse {
  message: string;
  recommendation: any[];
}

export const uploadImageForAnalysis = async (imageUri: string): Promise<UploadResponse> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const token = await user.getIdToken();
  
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);

    const response = await fetch('http://192.168.102.47:8080/images/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data: UploadResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw error;
  }
}; .
