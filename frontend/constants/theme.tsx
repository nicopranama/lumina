import { moderateScale, scale, verticalScale } from "../utils/styling";

export const colors = {
  primary: "#a3e635",
  primaryLight: "#f4f4f4",
  primaryDark: "#000000",
  textBlack: "#000000",
  textLightGrey: "#8E8E93",
  textDarkGrey: "#747474",
  white: "#ffffff",
  black: "#000000",
  neutral25: '#fafafa',
  neutral50: '#f5f5f5',
  neutral75: '#f4f4f4',   
  neutral100: '#e5e5e5',
  neutral150: '#d9d9d9',  
  neutral200: '#d4d4d4',
  neutral300: '#bfbfbf',  
  neutral400: '#a3a3a3',
  neutral500: '#737373',
  neutral600: '#525252',
  neutral700: '#404040',
  neutral800: '#262626',
  neutral900: '#171717',
};

export const spacingX = {
  _3: scale(3),
  _5: scale(5),
  _7: scale(7),
  _10: scale(10),
  _12: scale(12),
  _15: scale(15),
  _20: scale(20),
  _25: scale(25),
  _30: scale(30),
  _35: scale(35),
  _40: scale(40),
};

export const spacingY = {
  _5: verticalScale(5),
  _7: verticalScale(7),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _25: verticalScale(25),
  _30: verticalScale(30),
  _35: verticalScale(35),
  _40: verticalScale(40),
  _50: verticalScale(50),
  _60: verticalScale(60),
};

export const radius = {
  _3: moderateScale(3),
  _6: moderateScale(6),
  _10: moderateScale(10),
  _12: moderateScale(12),
  _15: moderateScale(15),
  _17: moderateScale(17),
  _20: moderateScale(20),
  _30: moderateScale(30),
};
