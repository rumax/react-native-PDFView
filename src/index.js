/* @flow */
import React from 'react';

import RNPdfView from './RNPdfView';


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
   *   - fileName - Not implemented
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
   * A String value. Defines encoding type. Can be one of:
   *   - "utf-8", default
   *   - "utf-16"
   */
  textEncoding: 'utf-8' | 'utf-16',
};

class PdfView extends React.Component<Props, *> {
  static defaultProps = {
    onError: () => {},
    onLoad: () => {},
    resourceType: 'url',
    textEncoding: 'utf-8',
  };


  constructor(props: Props) {
    super(props);
    this.onError = this.onError.bind(this);
  }


  onError: (error: Error) => void;
  onError(event: any) { // TODO: Proper type for RN event
    this.props.onError(event && event.nativeEvent || new Error());
  }


  render() {
    const { onError, ...otherProps } = this.props;
    return <RNPdfView {...otherProps} onError={onError} />;
  }
}


export default PdfView;
