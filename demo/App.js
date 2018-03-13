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

const PDF_URL = 'https://www.ets.org/Media/Tests/TOEFL/pdf/SampleQuestions.pdf';

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
  },
  pdfView: {
    flex: 1,
  },
});

const PdfContent = ({
  resource,
  resourceType,
  onLoad,
  onError,
}) => {
  const content = resourceType ?
    (
      <PDFView
        fadeInDuration={250.0}
        style={styles.pdfView}
        resource={resource}
        resourceType={resourceType}
        onLoad={onLoad}
        onError={onError}
      />
    ) : <Text>No resource, tap one of buttons above</Text>;

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
    this.renderStarted = 0;
  }

  setUrl = () => {
    this.setState({
      resource: PDF_URL,
      resourceType: 'url',
    });
  }

  setBase64 = () => {
    this.setState({
      resource: base64Data.document,
      resourceType: 'base64',
    });
  }

  dataWithError = () => {
    this.setState({
      resource: '**invalid base 64**',
      resourceType: 'base64',
    });
  }

  resetData = () => {
    this.setState({
      resource: undefined,
      resourceType: undefined,
    });
  }

  handleLoad = () => {
    Alert.alert(
      'Document loaded',
      `Time: ${((new Date()).getTime() - this.renderStarted)}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
        },
      ],
    );
  }

  handleError = (error) => {
    Alert.alert(
      'Document loading failed',
      error.message,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
        },
      ],
    );
  }

  render() {
    const { resource, resourceType } = this.state;
    if (resource) {
      this.renderStarted = (new Date()).getTime();
    }
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
            <Button onPress={this.dataWithError} title="Error" accessibilityLabel="Error" />
          </View>
          <View style={styles.tab}>
            <Button onPress={this.resetData} title="Reset" accessibilityLabel="Reset" />
          </View>
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
