/* @flow */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  Alert,
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import PDFView from 'react-native-view-pdf';

import base64Data from './base64.json';

const cWhite = '#f9f9f9';
const cLightBlue = '#5bc0de';
const cGreen = '#5cb85c';
const cBlue = '#428bca';

const resources = {
  file: Platform.OS === 'ios' ? 'test-pdf.pdf' : '/sdcard/Download/test-pdf.pdf',
  url: 'https://www.ets.org/Media/Tests/TOEFL/pdf/SampleQuestions.pdf',
  base64: base64Data.document,
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    flex: 1,
    backgroundColor: cWhite,
  },
  tabs: { flexDirection: 'row' },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cLightBlue,
    borderColor: cBlue,
    borderWidth: 2,
  },
  content: { flex: 1, backgroundColor: cGreen },
  pdfView: { flex: 1 },
  noContent: { flex: 1, alignItems: 'center' },
  noContentText: {
    fontSize: 22,
    lineHeight: 36,
    fontWeight: 'bold',
    marginTop: 60,
    textAlign: 'center',
  },
  noContentSubText: {
    fontSize: 16,
    color: cBlue,
    marginTop: 20,
    textAlign: 'center',
  },
});

const PdfContent = ({
  resource,
  resourceType,
  onLoad,
  onError,
}) => {
  const content = resourceType && resource ?
    (
      <PDFView
        fadeInDuration={250.0}
        style={styles.pdfView}
        resource={resource}
        resourceType={resourceType}
        onLoad={onLoad}
        onError={onError}
      />
    ) : (
      <View style={styles.noContent}>
        <Text style={styles.noContentText}>
          No resources
          {'\n'}
          Press one of the buttons above
        </Text>
        <Text style={styles.noContentSubText}>
          You are running the app in
          {__DEV__ ? 'DEV' : 'RELEASE'}
          mode
        </Text>
      </View>
    );

  return <View style={styles.content}>{content}</View>;
};

const TabButton = ({ title, onPress }) => (
  <View style={styles.tab}>
    <Button onPress={onPress} title={title} />
  </View>
);

export default class App extends React.Component<*, *> {
  // eslint-disable-next-line react/sort-comp
  renderStarted: number;

  constructor(props: *) {
    super(props);
    this.state = { resource: undefined, resourceType: undefined };
    this.renderStarted = 0;
  }

  setUrl = () => {
    this.setState({ resource: resources.url, resourceType: 'url' });
  }

  setBase64 = () => {
    this.setState({ resource: resources.base64, resourceType: 'base64' });
  }

  setFile = () => {
    this.setState({ resource: resources.file, resourceType: 'file' });
  }

  dataWithError = () => {
    this.setState({ resource: '**invalid base 64**', resourceType: 'base64' });
  }

  resetData = () => {
    this.setState({ resource: undefined, resourceType: undefined });
  }

  handleLoad = () => {
    Alert.alert(
      'Document loaded',
      `Time: ${((new Date()).getTime() - this.renderStarted)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK' },
      ],
    );
  }

  handleError = (error: Error) => {
    Alert.alert(
      'Document loading failed',
      error.message,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK' },
      ],
    );
  }

  render() {
    const { resource, resourceType } = this.state;
    this.renderStarted = (new Date()).getTime();

    return (
      <View style={styles.container}>
        <View style={styles.tabs}>
          <TabButton onPress={this.setUrl} title="Url" />
          <TabButton onPress={this.setBase64} title="Base64" />
          <TabButton onPress={this.setFile} title="File" />
          <TabButton onPress={this.dataWithError} title="Error" />
          <TabButton onPress={this.resetData} title="Reset" />
        </View>
        <PdfContent
          resource={resource}
          resourceType={resourceType}
          onLoad={this.handleLoad}
          onError={this.handleError}
        />
      </View>
    );
  }
}
