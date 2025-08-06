import React from 'react';
import { View } from 'react-native';
import Typo from '../../components/typography';
import { RecommendationItem } from '../../types';
import ProductCard from './ProductCard';

interface CategorySectionProps {
  categoryTitle: string;
  products: RecommendationItem[];
  styles: any;
}

const CategorySection: React.FC<CategorySectionProps> = ({ categoryTitle, products, styles }) => (
  <View style={styles.categorySection}>
    <Typo style={styles.categoryTitle}>{categoryTitle}</Typo>
    {products.map((product) => (
      <ProductCard key={product.recommendation_id} product={product} styles={styles} />
    ))}
  </View>
);

export default CategorySection;