// services/backendService.ts
const BACKEND_URL = 'http://172.16.116.200:8080'; // Ganti dengan URL backend Anda

export interface BackendAuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    firebase_uid: string;
  };
  error?: string;
}

class BackendService {
  
  async registerUser(firebaseUid: string, name: string, email: string, password: string): Promise<BackendAuthResponse> {
    try {
      const response = await fetch(`http://192.168.102.47:8080/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebase_uid: firebaseUid,
          name: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Registration failed',
          error: data.error
        };
      }

      return {
        success: true,
        message: data.message || 'Registration successful',
        user: data.user
      };
    } catch (error) {
      console.error('Backend registration error:', error);
      return {
        success: false,
        message: 'Network error during registration',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async loginUser(idToken: string): Promise<BackendAuthResponse> {
    try {
      const response = await fetch(`http://192.168.102.47:8080/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: idToken,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Login failed',
          error: data.error
        };
      }

      return {
        success: true,
        message: data.message || 'Login successful',
        user: data.user
      };
    } catch (error) {
      console.error('Backend login error:', error);
      return {
        success: false,
        message: 'Network error during login',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const backendService = new BackendService();