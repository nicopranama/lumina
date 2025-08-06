import React from 'react';
import { View } from 'react-native';
import Typo from '../../components/typography';
import { GroupedHistory, HistoryItem } from '../../types';
import HistoryCard from './HistoryCard';

interface MonthSectionProps {
  group: GroupedHistory;
  onItemPress: (item: HistoryItem) => void;
  onItemDelete: (analysisId: number) => void;
  styles: any;
}

const MonthSection: React.FC<MonthSectionProps> = ({ group, onItemPress, onItemDelete, styles }) => (
  <View style={styles.monthSection}>
    <Typo style={styles.monthTitle}>{group.monthYear}</Typo>
    {group.items.map((item) => (
      <HistoryCard
        key={item.analysis_id}
        item={item}
        onPress={() => onItemPress(item)}
        onDelete={() => onItemDelete(item.analysis_id)}
        styles={styles}
      />
    ))}
  </View>
);

export default MonthSection;