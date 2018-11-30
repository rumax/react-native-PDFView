/* @flow */
import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { ViewStyleProp } from 'StyleSheet';

import styles from './styles';

type PropsType = {
  active?: boolean,
  title: string,
  onPress: Function,
  style?: ViewStyleProp,
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
    <TouchableOpacity style={[styles.tabButton, props.style]} onPress={props.onPress}>
      <Text>{props.title}</Text>
    </TouchableOpacity>
  );
};
