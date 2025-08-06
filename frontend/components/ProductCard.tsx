import { CaretDown, CaretUp } from 'phosphor-react-native';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/theme';
import { moderateScale } from '../utils/styling';
import { truncateText } from '../utils/textUtils';
import Typo from './typography';

export interface ProductData {
  recommendation_id: number;
  analysis_id: number;
  skincare_name: string;
  skincare_type: string;
  description: string;
}

interface ProductCardProps {
  product: ProductData;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [expanded, setExpanded] = useState(false);
  
  const nameLimit = 28;
  const descLimit = 65;
  
  const needNameTruncation = product.skincare_name.length > nameLimit;
  const needDescTruncation = product.description.length > descLimit;
  
  const displayName = expanded || !needNameTruncation 
    ? product.skincare_name 
    : truncateText(product.skincare_name, nameLimit);
    
  const displayDesc = expanded || !needDescTruncation 
    ? product.description 
    : truncateText(product.description, descLimit);

  return (
    <View style={styles.productCard}>
      <View style={styles.productContent}>
        <View style={styles.productNameSection}>
          <Typo style={styles.productName}>{displayName}</Typo>
          <Typo style={styles.productBrand}>{product.skincare_type}</Typo>
          <Typo style={styles.productDescription}>{displayDesc}</Typo>
        </View>
        
        {(needNameTruncation || needDescTruncation) && (
          <TouchableOpacity 
            style={styles.expandButton} 
            onPress={() => setExpanded(!expanded)}
            activeOpacity={0.7}
          >
            {expanded ? (
              <CaretUp weight="bold" size={moderateScale(22)} color={colors.neutral500} />
            ) : (
              <CaretDown weight="bold" size={moderateScale(22)} color={colors.neutral500} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: moderateScale(16),
    marginBottom: moderateScale(12),
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productNameSection: {
    flex: 1,
    marginRight: moderateScale(12),
  },
  productName: {
    fontSize: moderateScale(16),
    fontFamily: 'Sf-Bold',
    color: colors.black,
    marginBottom: moderateScale(4),
  },
  productBrand: {
    fontSize: moderateScale(14),
    fontFamily: 'Sf-Medium',
    color: colors.neutral500,
    marginBottom: moderateScale(8),
  },
  productDescription: {
    fontSize: moderateScale(14),
    fontFamily: 'Sf-Regular',
    color: colors.neutral600,
    lineHeight: moderateScale(20),
  },
  expandButton: {
    padding: moderateScale(4),
  },
});

export default ProductCard; 