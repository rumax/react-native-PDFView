/* @flow */
import React from 'react';
import { Button, View } from 'react-native';

import styles from './styles';

const TabButton = ({ title, onPress }: { title: string, onPress: Function }) => (
  <View style={styles.tab}>
    <Button onPress={onPress} title={title} />
  </View>
);

export default TabButton;
