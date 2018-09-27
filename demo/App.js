/* @flow */
/* eslint-disable react/prop-types */
import React from 'react';
import {
  Alert,
  Button,
  Platform,
  Text,
  View,
} from 'react-native';

import PDFView from 'react-native-view-pdf';
import type { UrlProps } from 'react-native-view-pdf';

import base64Data from './base64.json';
import styles from './app.style';

type Resource = {
  resource: string,
  resourceType: 'url' | 'base64' | 'file',
  urlProps?: UrlProps,
};
type State = { resource?: Resource };

const resources: {[key: string]: Resource } = {
  file: {
    resource: Platform.OS === 'ios' ? 'test-pdf.pdf' : '/sdcard/Download/test-pdf.pdf',
    resourceType: 'file',
  },
  url: {
    resource: 'https://www.ets.org/Media/Tests/TOEFL/pdf/SampleQuestions.pdf',
    resourceType: 'url',
  },
  urlPost: {
    // Run "node demo/utils/server.js" to start the local server. Put correct IP
    resource: 'http://__SERVER__:8080',
    resourceType: 'url',
    urlProps: {
      method: 'POST',
      headers: {
        'Accept-Language': 'en-us,en;q=0.5',
        'Accept-encoding': 'application/pdf',
        Referer: 'http://localhost/',
      },
      body: 'Request PDF body',
    },
  },
  base64: {
    resource: base64Data.document,
    resourceType: 'base64',
  },
  invalid: {
    resource: '**invalid base 64**',
    resourceType: 'base64',
  },
};

const PdfContent = (props) => {
  if (props.resource) {
    return (
      <PDFView
        fadeInDuration={250.0}
        style={styles.pdfView}
        {...props.resource}
        onLoad={props.onLoad}
        onError={props.onError}
      />
    );
  }

  return (
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
};

const TabButton = ({ title, onPress }) => (
  <View style={styles.tab}>
    <Button onPress={onPress} title={title} />
  </View>
);

export default class App extends React.Component<*, State> {
  // eslint-disable-next-line react/sort-comp
  renderStarted: number;

  constructor(props: *) {
    super(props);
    this.state = { resource: undefined };
    this.renderStarted = 0;
  }

  setUrl = () => {
    this.setState({ resource: resources.url });
  }

  setUrlPost = () => {
    this.setState({ resource: resources.urlPost });
  }

  setBase64 = () => {
    this.setState({ resource: resources.base64 });
  }

  setFile = () => {
    this.setState({ resource: resources.file });
  }

  dataWithError = () => {
    this.setState({ resource: resources.invalid });
  }

  resetData = () => {
    this.setState({ resource: undefined });
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
    const { state } = this;
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
        <View style={styles.content}>
          <PdfContent
            resource={state.resource}
            onLoad={this.handleLoad}
            onError={this.handleError}
          />
        </View>
        <View style={styles.tabs}>
          <TabButton onPress={this.setUrlPost} title="Url Post" />
          <TabButton onPress={this.resetData} title="Reset" />
        </View>
      </View>
    );
  }
}
