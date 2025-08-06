import { CaretDown, CaretUp } from 'phosphor-react-native';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Typo from '../../components/typography';
import { colors } from '../../constants/theme';
import { RecommendationItem } from '../../types';
import { moderateScale } from '../../utils/styling';
import { truncateText } from '../../utils/textUtils';

interface ProductCardProps {
  product: RecommendationItem;
  styles: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, styles }) => {
  const [expanded, setExpanded] = useState(false);
  const nameLimit = 28;
  const descLimit = 65;
  const needNameTruncation = product.skincare_name.length > nameLimit;
  const needDescTruncation = product.description.length > descLimit;
  const displayName = expanded || !needNameTruncation ? product.skincare_name : truncateText(product.skincare_name, nameLimit);
  const displayDesc = expanded || !needDescTruncation ? product.description : truncateText(product.description, descLimit);
  return (
    <View style={styles.productCard}>
      <View style={styles.productContent}>
        <View style={styles.productNameSection}>
          <View style={styles.productHeader}>
            <Typo style={styles.productName}>{displayName}</Typo>
          </View>
          <Typo style={styles.productBrand}>{product.skincare_type}</Typo>
          <Typo style={styles.productDescription}>{displayDesc}</Typo>
        </View>
        {(needNameTruncation || needDescTruncation) && (
          <TouchableOpacity style={styles.expandButton} onPress={() => setExpanded(!expanded)} activeOpacity={0.7}>
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

export default ProductCard;