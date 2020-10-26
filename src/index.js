/* @flow */
import React from 'react';
import {
  findNodeHandle,
  UIManager,
  Platform,
  NativeModules,
} from 'react-native';

import type { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';

import RNPDFView from './RNPDFView';

export type UrlPropsType = {
  /**
   * `method` is the HTTP Method to use. Defaults to GET if not specified.
   */
  method?: string,

  /**
   * `headers` is an object representing the HTTP headers to send along with the
   * request for a remote image.
   */
  headers?: { [key: string]: string },

  /**
   * `body` is the HTTP body to send with the request. This must be a valid
   * UTF-8 string, and will be sent exactly as specified, with no
   * additional encoding (e.g. URL-escaping or base64) applied.
   */
  body?: string,
};

type PropsType = {|
  ...ViewProps,

  /**
   * A Function. Invoked on load error with {nativeEvent: {error}}.
   */
  onError?: (Error) => void,

  /**
   * A Function. Invoked when load completes successfully.
   */
  onLoad?: () => void,

  /**
   * A Function. Invoked when page is changed.
   * @param {Number} page - The active page.
   * @param {Number} pageCount - Total pages.
   */
  onPageChanged?: (page: number, pageCount: number) => void,

  /**
   * A Function. Invoked when page is sscrolled.
   * @param {Number} offset - Offet. Currrently only 1 and 0 are supported.
   *                          where:
   *                            0 - begining of the document
   *                            1 - end of the document
   */
  onScrolled?: (offset: number) => void,

  /**
   * A String value. Defines the resource to render. Can be one of:
   *   - url. Example: http://www.pdf995.com/samples/pdf.pdf
   *   - base64. Example: 'JVBERi0xLjcKCjEgMCBvYmogICUgZW50...'
   *   - fileName - Example: Platform.OS === 'ios' ?
   *       'test-pdf.pdf' : '/sdcard/Download/test-pdf.pdf'
   */
  resource: string,

  /**
   * A String value. Defines the resource type. Can be one of:
   *   - "url", for url
   *   - "base64", for base64 data
   *   - "file", for local files
   */
  resourceType?: 'url' | 'base64' | 'file',

  /**
   * iOS file location. Can be one of:
   *   - "bundle"
   *   - "documentsDirectory"
   *   - "libraryDirectory"
   *   - "tempDirectory"
   */
  fileFrom?: 'bundle' | 'documentsDirectory' | 'libraryDirectory' | 'tempDirectory',

  urlProps?: UrlPropsType,

  /**
   * A String value. Defines encoding type. Can be one of:
   *   - "utf-8", default
   *   - "utf-16"
   */
  textEncoding?: 'utf-8' | 'utf-16',

  /**
   * A Number value. Fades in effect (in ms) on load successfully:
   *   - 0.0, default
   */
  fadeInDuration?: number,

  /**
   * A Boolean value. Enables annotations view on Android
   *   - false, default
   */
  enableAnnotations?: boolean,
|};

class PDFView extends React.Component<PropsType, *> {
  // eslint-disable-next-line react/sort-comp
  _viewerRef: any;


  static defaultProps = {
    onError: () => {},
    onLoad: () => {},
    onPageChanged: () => {},
    onScrolled: () => {},
    fadeInDuration: 0.0,
    resourceType: 'url',
    textEncoding: 'utf-8',
    urlProps: {},
  };


  onError = (event: any): void => {
    const { nativeEvent } = event || {};
    // $FlowFixMe: defined in defaultProps
    this.props.onError(nativeEvent || new Error('unknown error'));
  }


  onPageChanged = (event: any): void => {
    const { nativeEvent = {} } = event || {};
    const { page = -1, pageCount = -1 } = nativeEvent;
    // $FlowFixMe: defined in defaultProps
    this.props.onPageChanged(page, pageCount);
  }


  onScrolled = (event: any): void => {
    const { nativeEvent = {} } = event || {};
    const { offset = -1 } = nativeEvent;
    // $FlowFixMe: defined in defaultProps
    this.props.onScrolled(offset);
  }


  _getCommands = () => {
    const _PDFView = UIManager.getViewManagerConfig
      ? UIManager.getViewManagerConfig('PDFView') // RN 0.58
      : (UIManager: any).PDFView; // RN 0.57
    return _PDFView.Commands;
  }


  _setViewRef = (ref: any) => {
    this._viewerRef = ref;
  }


  /**
   * A Function. Invoke it when PDF document needs to be reloaded. Use `ref` to
   * access it. Throws an exception in case of errors
   */
  async reload() {
    if (this._viewerRef) {
      const handle = findNodeHandle(this._viewerRef);

      if (!handle) {
        throw new Error('Cannot find node handles');
      }

      await Platform.select({
        android: async () => UIManager.dispatchViewManagerCommand(
          handle,
          this._getCommands().reload,
          [],
        ),
        ios: async () => NativeModules.PDFView.reload(handle),
      })();
    } else {
      throw new Error('No ref to PDFView component, check that component is mounted');
    }
  }


  render() {
    const {
      onError,
      onPageChanged,
      onScrolled,
      ...remainingProps
    } = this.props;
    return (
      <RNPDFView
        ref={this._setViewRef}
        {...remainingProps}
        onError={this.onError}
        onPageChanged={this.onPageChanged}
        onScrolled={this.onScrolled}
      />
    );
  }
}


export default PDFView;
