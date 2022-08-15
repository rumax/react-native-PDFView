import React from 'react';
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import styles from './styles';

type PropsType = {
  active?: boolean;
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export default (props: PropsType) => {
  if (props.active) {
    return (
      <View style={[styles.tabButton, styles.tabButtonActive, props.style]}>
        <Text>{props.title}</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.tabButton, props.style]}
      onPress={props.onPress}>
      <Text>{props.title}</Text>
    </TouchableOpacity>
  );
};
