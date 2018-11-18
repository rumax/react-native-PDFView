/* @flow */
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import type { ViewStyleProp } from 'StyleSheet';

type PropsType = {
  title: string,
  onPress: Function,
  style: ViewStyleProp,
};

export default (props: PropsType) => (
  <TouchableOpacity style={props.style} onPress={props.onPress}>
    <Text>{props.title}</Text>
  </TouchableOpacity>
);
