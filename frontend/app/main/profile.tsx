import { useRouter } from 'expo-router';
import { Lock } from 'phosphor-react-native';
import React from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import GlassmorphismCard from '../../components/glassmorphismcard';
import Typo from '../../components/typography';
import { colors } from '../../constants/theme';
import { useAuth } from '../../context/authcontext';
import { moderateScale, scale, verticalScale } from '../../utils/styling';

type ProfileDropdownProps = {
  visible: boolean;
  onClose: () => void;
};

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ visible, onClose }) => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const result = await logout();
      onClose();
      if (result.success) {
        router.replace('/auth/welcome');
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!visible) return null;

  return (
    <>
      <Pressable style={styles.backdrop} onPress={onClose} />
      
      <View style={styles.container}>
        <GlassmorphismCard style={styles.card}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <Lock size={moderateScale(16)} color={colors.black} weight="bold" />
            <Typo style={styles.menuItemText}>Sign out</Typo>
          </TouchableOpacity>
        </GlassmorphismCard>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  container: {
    position: 'absolute',
    top: verticalScale(43), 
    right: 0,
    alignItems: 'flex-end',
    zIndex: 2,
  },
  card: {
    width: scale(117),
    height: verticalScale(56),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(10),
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  menuItemText: {
    marginLeft: scale(8),
    fontSize: moderateScale(14),
    fontFamily: 'Sf-Medium',
  },
});

export default ProfileDropdown;