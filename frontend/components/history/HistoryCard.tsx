import { X } from 'phosphor-react-native';
import React from 'react';
import { Alert, Image, TouchableOpacity, View } from 'react-native';
import Typo from '../../components/typography';
import { colors } from '../../constants/theme';
import { HistoryItem } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { moderateScale } from '../../utils/styling';

interface HistoryCardProps {
  item: HistoryItem;
  onPress: () => void;
  onDelete: () => void;
  styles: any;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ item, onPress, onDelete, styles }) => {
  const { fullDate } = formatDate(item.analyzed_at);
  const handleDelete = () => {
    Alert.alert(
      'Delete History',
      'Are you sure you want to delete this analysis history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };
  return (
    <TouchableOpacity style={styles.historyCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={styles.historyImage} resizeMode="cover" />
          ) : (
            <View style={styles.placeholderImage}>
              <Typo style={styles.placeholderText}>No Image</Typo>
            </View>
          )}
        </View>
        <View style={styles.historyInfo}>
          <Typo style={styles.historyDate}>{fullDate}</Typo>
          <Typo style={styles.recommendationCount}>
            {item.recommendations.length} recommendation{item.recommendations.length !== 1 ? 's' : ''}
          </Typo>
          <Typo style={styles.viewResultText}>View Result</Typo>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <X weight="bold" size={moderateScale(20)} color={colors.neutral500} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default HistoryCard;