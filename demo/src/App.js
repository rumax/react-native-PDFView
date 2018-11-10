/* @flow */
/* eslint-disable react/prop-types, no-console */
import React from 'react';
import {
  Alert,
  Text,
  View,
} from 'react-native';
import PDFView from 'react-native-view-pdf';
import Spinner from 'react-native-loading-spinner-overlay';
import DropdownAlert from 'react-native-dropdownalert';

import styles from './styles';
import resources from './resources';
import type { Resource } from './resources';
import TabButton from './TabButton';
import pkg from '../package.json';

const PdfContent = (props) => {
  if (props.resource) {
    return (
      <PDFView
        fadeInDuration={250.0}
        style={styles.pdfView}
        {...props.resource}
        onLoad={props.onLoad}
        onError={props.onError}
        onPageChanged={props.onPageChanged}
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
        You are running the app in {__DEV__ ? 'DEV' : 'RELEASE'} mode{'\n'}
        RN version is {pkg.dependencies['react-native']}
      </Text>
    </View>
  );
};

export default class App extends React.Component<*, { resource?: Resource }> {
  // eslint-disable-next-line react/sort-comp
  renderStarted: number;

  constructor(props: *) {
    super(props);
    this.state = { resource: undefined, spinner: false };
    this.renderStarted = 0;
  }

  setUrl = () => {
    this.setState({ resource: resources.url, spinner: true });
  }

  setUrlPost = () => {
    this.setState({ resource: resources.urlPost, spinner: true });
  }

  setBase64 = () => {
    this.setState({ resource: resources.base64, spinner: true });
  }

  setFile = () => {
    this.setState({ resource: resources.file, spinner: true });
  }

  setFileAssets = () => {
    this.setState({ resource: resources.fileAssets, spinner: true });
  }

  dataWithError = () => {
    this.setState({ resource: resources.invalid, spinner: true });
  }

  resetData = () => {
    this.setState({ resource: undefined });
  }

  handleLoad = () => {
    this.setState({ spinner: false });
    this.dropdown.alertWithType(
      'success',
      'Document loaded',
      `Loading time: ${((new Date()).getTime() - this.renderStarted)}`,
    );
  }

  handleError = (error: Error) => {
    this.setState({ spinner: false });
    this.dropdown.alertWithType(
      'error',
      'Document loading failed',
      `error message: ${error.message}`,
    );
  }

  handlePageChanged = (page: number, pageCount: number) => {
    console.log(`page ${page + 1} out of ${pageCount}`);
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
        <PdfContent
          resource={state.resource}
          onLoad={this.handleLoad}
          onError={this.handleError}
          onPageChanged={this.handlePageChanged}
        />
        <View style={styles.tabs}>
          <TabButton onPress={this.setUrlPost} title="Url Post" />
          <TabButton onPress={this.setFileAssets} title="Assets" />
          <TabButton onPress={this.resetData} title="Reset" />
        </View>
        <Spinner
          visible={this.state.spinner}
          textContent="Loading..."
          textStyle={styles.spinnerTextStyle}
        />
        <DropdownAlert ref={ref => this.dropdown = ref} />
      </View>
    );
  }
}
