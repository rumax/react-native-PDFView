/* @flow */
/* eslint-disable react/prop-types, no-console */
import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import PDFView from 'react-native-view-pdf';
import Spinner from 'react-native-loading-spinner-overlay';
import DropdownAlert from 'react-native-dropdownalert';

import styles from './styles';
import resources from './resources';
import type { Resource } from './resources';
import Button from './Button';
import pkg from '../package.json';

type StateType = {
  resource?: Resource,
  spinner: boolean,
  canReload?: boolean,
};

const PdfContent = (props) => {
  if (props.resource) {
    return (
      <PDFView
        fadeInDuration={250.0}
        style={styles.pdfView}
        ref={props.onRef}
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

export default class App extends React.Component<*, StateType> {
  _dropdownRef: ?DropdownAlert;

  _pdfRef: ?PDFView;

  _renderStarted: number;


  constructor(props: *) {
    super(props);
    this.state = { resource: undefined, spinner: false };
    this._renderStarted = 0;
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
    this.setState({ resource: undefined, canReload: false });
  }


  handleLoad = () => {
    this.setState({ spinner: false, canReload: true });
    if (this._dropdownRef) {
      this._dropdownRef.alertWithType(
        'success',
        'Document loaded',
        `Loading time: ${((new Date()).getTime() - this._renderStarted)}`,
      );
    }
  }


  handleError = (error: Error) => {
    this.setState({ spinner: false, canReload: true });
    if (this._dropdownRef) {
      this._dropdownRef.alertWithType(
        'error',
        'Document loading failed',
        `error message: ${error.message}`,
      );
    }
  }


  handlePageChanged = (page: number, pageCount: number) => {
    console.log(`page ${page + 1} out of ${pageCount}`);
  }


  reloadPDF = async () => {
    const pdfRef = this._pdfRef;

    if (!pdfRef) {
      return;
    }

    this.setState({ spinner: true });
    try {
      await pdfRef.reload();
    } catch (err) {
      this.setState({ spinner: false });
      if (this._dropdownRef) {
        this._dropdownRef.alertWithType(
          'error',
          'Document reload failed',
          `error message: ${err.message}`,
        );
      }
    }
  }


  onRef = (ref: ?PDFView) => {
    this._pdfRef = ref;
  }


  render() {
    const { state } = this;
    this._renderStarted = (new Date()).getTime();

    return (
      <View style={styles.container}>
        <View style={styles.tabs}>
          <Button style={styles.tabButton} onPress={this.setUrl} title="Url" />
          <Button style={styles.tabButton} onPress={this.setBase64} title="Base64" />
          <Button style={styles.tabButton} onPress={this.setFile} title="File" />
          <Button style={styles.tabButton} onPress={this.dataWithError} title="Error" />
          <Button style={styles.tabButton} onPress={this.resetData} title="Reset" />
        </View>
        <PdfContent
          resource={state.resource}
          onLoad={this.handleLoad}
          onError={this.handleError}
          onRef={this.onRef}
          onPageChanged={this.handlePageChanged}
        />
        <View style={styles.tabs}>
          <Button style={styles.tabButton} onPress={this.setUrlPost} title="Url Post" />
          <Button style={styles.tabButton} onPress={this.setFileAssets} title="Assets" />
          <Button style={styles.tabButton} onPress={this.resetData} title="Reset" />
        </View>
        {state.canReload && (
          <View style={styles.floatButtons}>
            <Button
              onPress={this.reloadPDF}
              title="Reload PDF"
              style={styles.reloadButton}
            />
          </View>
        )}
        <Spinner
          visible={this.state.spinner}
          textContent="Loading..."
          textStyle={styles.spinnerTextStyle}
        />
        <DropdownAlert ref={(ref) => {
          this._dropdownRef = ref;
        }}
        />
      </View>
    );
  }
}
