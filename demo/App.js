/* eslint-disable react/prop-types */
import React from 'react';
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// const cError = '##d9534f';
const cWhite = '#f9f9f9';
const cLightBlue = '#5bc0de';
const cGreen = '#5cb85c';
const cBlue = '#428bca';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    flex: 1,
    backgroundColor: cWhite,
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cLightBlue,
    borderColor: cBlue,
    borderWidth: 2,
  },
  content: {
    flex: 1,
    backgroundColor: cGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const base64Data = [
  'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog',
  'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv',
  'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K',
  'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg',
  'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+',
  'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u',
  'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq',
  'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU',
  'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu',
  'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g',
  'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw',
  'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v',
  'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G',
].join('');

const PdfContent = ({ resource, resourceType }) => {
  const content = resourceType ?
    <Text>TODO: render type {resourceType} data: {resource}</Text> :
    <Text>No resource, tap one of buttons above</Text>;

  return (
    <View style={styles.content}>
      {content}
    </View>
  );
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: undefined,
      resourceType: undefined,
    };
  }

  setUrl = () => {
    this.setState({
      resource: 'http://www.pdf995.com/samples/pdf.pdf',
      resourceType: 'url',
    });
  }

  setBase64 = () => {
    this.setState({
      resource: base64Data,
      resourceType: 'base64',
    });
  }

  resetData = () => {
    this.setState({
      resource: undefined,
      resourceType: undefined,
    });
  }

  render() {
    const { resource, resourceType } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.tabs}>
          <View style={styles.tab}>
            <Button onPress={this.setUrl} title="Url" accessibilityLabel="Url" />
          </View>
          <View style={styles.tab}>
            <Button onPress={this.setBase64} title="Base64" accessibilityLabel="Base64" />
          </View>
          <View style={styles.tab}>
            <Button onPress={this.resetData} title="Reset" accessibilityLabel="Reset" />
          </View>
        </View>
        <PdfContent resource={resource} resourceType={resourceType} />
      </View>
    );
  }
}
