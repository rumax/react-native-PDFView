/* @flow */
import React from 'react';

import RNPDFView from './RNPDFView';


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

  urlProps?: {
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
  },

  /**
   * A String value. Defines encoding type. Can be one of:
   *   - "utf-8", default
   *   - "utf-16"
   */
  textEncoding: 'utf-8' | 'utf-16',

  /**
   * A Number value. Fades in the webview (in ms) on load successfully (iOS Only):
   *   - 0.0, default
   */
  fadeInDuration: number,
};

class PDFView extends React.Component<Props, *> {
  static defaultProps = {
    onError: () => {},
    onLoad: () => {},
    fadeInDuration: 0.0,
    resourceType: 'url',
    textEncoding: 'utf-8',
    urlProps: {},
  };


  constructor(props: Props) {
    super(props);
    this.onError = this.onError.bind(this);
  }


  onError: (error: Error) => void;
  onError(event: any) { // TODO: Proper type for RN event
    this.props.onError(event && event.nativeEvent || new Error('unknown error'));
  }

  render() {
    const {
      onError,
      ...remainingProps
    } = this.props;
    return <RNPDFView {...remainingProps} onError={this.onError} />;
  }
}


export default PDFView;
