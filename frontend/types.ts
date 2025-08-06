import React, { ReactNode } from "react";
import {
    ModalProps as RNModalProps,
    StyleProp,
    TextInput,
    TextInputProps,
    TextProps,
    TextStyle,
    TouchableOpacityProps,
    ViewStyle
} from "react-native";

export type ScreenWrapperProps = {
    style?: ViewStyle;
    children: React.ReactNode;
};

export type ModalWrapperProps = {
    style?: ViewStyle;
    children: React.ReactNode;
    bg?: string;
};

export type PROPS = RNModalProps & ModalWrapperProps & {
    isOpen: boolean;
    withInput?: boolean;
    title?: string;
    onClose?: () => void;
};

export type AuthModalsProps = {
    isVisible: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

export type LoginFormProps = {
    error?: string;
    onLogin: (email: string, password: string) => void;
    onSwitchMode: () => void;
    initialValues?: {
        email: string;
        password: string;
    }
};

export type LoginFormData = {
    email: string;
    password: string;
};

export type RegisterFormProps = {
    error?: string;
    onRegister: (name: string, email: string, password: string) => void;
    onSwitchMode: () => void;
    initialValues?: {
        name: string;
        email: string;
        password: string;
    };
};

export type RegisterFormData = {
    name: string;
    email: string;
    password: string;
};

export type TypoProps = {
    size?: number;
    color?: string;
    fontWeight?: TextStyle["fontWeight"];
    fontFamily?: string;
    children: React.ReactNode;
    style?: StyleProp<TextStyle>;
    textProps?: TextProps;
};

export type IconComponent = React.ComponentType<{
    height?: number;
    width?: number;
    strokeWidth?: number;
    color?: string;
    fill?: string;
}>;

export type IconProps = {
    name: string;
    color?: string;
    size?: number;
    strokeWidth?: number;
    fill?: string;
};
  
export type HeaderProps = {
    title?: string;
    style?: ViewStyle;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
};
  
export type CloseButtonProps = {
    style?: ViewStyle;
    iconSize?: number;
};

export type InputProps = TextInputProps & {
    icon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    inputRef?: React.RefObject<TextInput>;
};

export type CustomButtonProps = TouchableOpacityProps & {
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    loading?: boolean;
    children: React.ReactNode;
};

export type GlassmorphismCardProps = {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: number;
    tintColor?: string;
    tintOpacity?: number;
};

export type GlassmorphismButtonProps = TouchableOpacityProps & {
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  text?: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  intensity?: number;
  tintColor?: string;
  tintOpacity?: number;
  glassPadding?: number;
};

export type ImageUploadProps = {
    file?: any;
    onSelect: (file: any) => void;
    onClear: () => void;
    containerStyle?: ViewStyle;
    imageStyle?: ViewStyle;
    placeholder?: string;
};

export type UserType = {
    uid?: string;             
    email?: string | null;
    name: string | null;
    backendUserId?: string;           
} | null;

export type UserDataType = {
    name: string;
};

export type ResponseType = {
    success: boolean;
    data?: any;
    message?: string;
};

export interface AuthContextType {
  user: UserType;
  setUser: (user: UserType) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; msg?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; msg?: string }>;
  logout: () => Promise<{ success: boolean; msg?: string }>;
  loading?: boolean;
};

export type AuthInputProps = TextInputProps & {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    secureTextEntry?: boolean;
};

export type ErrorMessageProps = {
    message?: string;
};

export type ProductData = {
  recommendation_id: number;
  analysis_id: number;
  skincare_name: string;
  skincare_type: string;
  description: string;
};

export type CategoryData = {
  title: string;
  products: ProductData[];
};

export type RecommendationItem = {
  recommendation_id: number;
  skincare_name: string;
  skincare_type: string;
  brand?: string;
  description: string;
};

export type HistoryItem = {
  analysis_id: number;
  image_id: number;
  image_url?: string | any; // Can be URL string or require() for local images
  analyzed_at: string; // ISO date string
  recommendations: RecommendationItem[];
};

export type GroupedHistory = {
  monthYear: string;
  items: HistoryItem[];
};

export type HistoryCardProps = {
  item: HistoryItem;
  onPress: () => void;
  onDelete: () => void;
};

export type MonthSectionProps = {
  group: GroupedHistory;
  onItemPress: (item: HistoryItem) => void;
  onItemDelete: (analysisId: number) => void;
};

export type ProductCardProps = {
  product: RecommendationItem;
};

export type CategorySectionProps = {
  categoryTitle: string;
  products: RecommendationItem[];
};

// types/index.ts - Updated types for history integration

export interface User {
  user_id: number;
  username: string;
  email: string;
  // Add other user fields as needed
}

export interface Image {
  image_id: number;
  user_id: number;
  image_path: string;
  uploaded_at: string;
  user?: User;
}

export interface Analysis {
  analysis_id: number;
  image_id: number;
  analysis_result: string;
  analyzed_at: string;
  image?: Image;
}

export interface SkincareRecommendation {
  recommendation_id: number;
  analysis_id: number;
  skincare_name: string;
  skincare_type: string;
  description: string;
  analysis?: Analysis;
}

export interface History {
  history_id: number;
  user_id: number;
  image_id: number;
  analysis_id: number;
  recommendation_id: number;
  user?: User;
  image?: Image;
  analysis?: Analysis;
  skincare_recommendation?: SkincareRecommendation;
}

export interface Recommendation {
  skincare_name: string;
  skincare_type: string;
  description: string;
}

export interface HistoryItemFromAPI {
  id: string;
  analysis_id: string;
  image: {
    image_url: string;
    uploaded_at: string;
  };
  recommendations: Recommendation[];
}