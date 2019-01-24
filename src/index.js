/* @flow */
import React from 'react';
import {
  findNodeHandle,
  UIManager,
  Platform,
  NativeModules,
} from 'react-native';

import RNPDFView from './RNPDFView';

export type UrlProps = {
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

type Props = {
  /**
   * A Function. Invoked on load error with {nativeEvent: {error}}.
   */
  onError: (Error) => void,

  /**
   * A Function. Invoked when load completes successfully.
   */
  onLoad: () => void,

  /**
   * A Function. Invoked when page is changed.
   * @param {Number} page - The active page.
   * @param {Number} pageCount - Total pages.
   */
  onPageChanged: (page: number, pageCount: number) => void,

  /**
   * A Function. Invoked when page is sscrolled.
   * @param {Number} offset - Offet. Currrently only 1 and 0 are supported.
   *                          where:
   *                            0 - begining of the document
   *                            1 - end of the document
   */
  onScrolled: (offset: number) => void,

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
  resourceType: 'url' | 'base64' | 'file',

  /**
   * iOS file location. Can be one of:
   *   - "bundle"
   *   - "documentsDirectory"
   */
  fileFrom?: 'bundle' | 'documentsDirectory',

  urlProps?: UrlProps,

  /**
   * A String value. Defines encoding type. Can be one of:
   *   - "utf-8", default
   *   - "utf-16"
   */
  textEncoding: 'utf-8' | 'utf-16',

  /**
   * A Number value. Fades in effect (in ms) on load successfully:
   *   - 0.0, default
   */
  fadeInDuration: number,
};

class PDFView extends React.Component<Props, *> {
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


  constructor(props: Props) {
    super(props);
    this.onError = this.onError.bind(this);
    this.onPageChanged = this.onPageChanged.bind(this);
    this.onScrolled = this.onScrolled.bind(this);
  }


  onError: (event: any) => void;
  onError(event: any) {
    const { nativeEvent } = event || {};
    this.props.onError(nativeEvent || new Error('unknown error'));
  }


  onPageChanged: (event: any) => void;
  onPageChanged(event: any) {
    const { nativeEvent = {} } = event || {};
    const { page = -1, pageCount = -1 } = nativeEvent;
    this.props.onPageChanged(page, pageCount);
  }


  onScrolled: (event: any) => void;
  onScrolled(event: any) {
    const { nativeEvent = {} } = event || {};
    const { offset = -1 } = nativeEvent;
    this.props.onScrolled(offset);
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
          UIManager.PDFView.Commands.reload,
          [],
        ),
        ios: async () => NativeModules.PDFViewManager.reload(handle),
      })();
    } else {
      throw new Error('No ref to PDFView component, check that component is mounted');
    }
  }


  _setViewRef = (ref: any) => {
    this._viewerRef = ref;
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
