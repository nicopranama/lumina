import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';
import { moderateScale } from '../utils/styling';
import ProductCard, { ProductData } from './ProductCard';
import Typo from './typography';

export interface CategoryData {
  title: string;
  products: ProductData[];
}

interface CategorySectionProps {
  category: CategoryData;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category }) => {
  return (
    <View style={styles.categorySection}>
      <Typo style={styles.categoryTitle}>{category.title}</Typo>
      {category.products.map((product) => (
        <ProductCard key={product.recommendation_id} product={product} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  categorySection: {
    marginBottom: moderateScale(24),
  },
  categoryTitle: {
    fontSize: moderateScale(18),
    fontFamily: 'Sf-Bold',
    color: colors.black,
    marginBottom: moderateScale(16),
    paddingHorizontal: moderateScale(20),
  },
});

export default CategorySection; 