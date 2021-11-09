// Type definitions for react-native-view-pdf 0.8.1
// Project: https://github.com/rumax/react-native-PDFView
// Definitions by: Uilque Messias <https://github.com/uqmessias>
// TypeScript Version: 3.2.1

import { Component } from "react";
import { StyleProp, ViewStyle } from "react-native";

export interface PDFViewUrlProps {
  /**
   * `method` is the HTTP Method to use. Defaults to GET if not specified.
   */
  method?: string;

  /**
   * `headers` is an object representing the HTTP headers to send along with the
   * request for a remote image.
   */
  headers?: { [key: string]: string };

  /**
   * `body` is the HTTP body to send with the request. This must be a valid
   * UTF-8 string, and will be sent exactly as specified, with no
   * additional encoding (e.g. URL-escaping or base64) applied.
   */
  body?: string;
}

interface PDFViewProps {
  /**
   * A Function. Invoked on load error with {nativeEvent: {error}}.
   */
  onError?: (error: { message: string }) => void;

  /**
   * A Function. Invoked when load completes successfully.
   */
  onLoad?: () => void;

  /**
   * A Function. Invoked when page is changed.
   * @param {Number} page - The active page.
   * @param {Number} pageCount - Total pages.
   */
  onPageChanged?: (page: number, pageCount: number) => void;

  /**
   * A Function. Invoked when page is sscrolled.
   * @param {Number} offset - Offet. Currrently only 1 and 0 are supported.
   *                          where:
   *                            0 - begining of the document
   *                            1 - end of the document
   */
  onScrolled?: (offset: number) => void;

  /**
   * A String value. Defines the resource to render. Can be one of:
   *   - url. Example: http://www.pdf995.com/samples/pdf.pdf
   *   - base64. Example: 'JVBERi0xLjcKCjEgMCBvYmogICUgZW50...'
   *   - fileName - Example: Platform.OS === 'ios' ?
   *       'test-pdf.pdf' : '/sdcard/Download/test-pdf.pdf'
   */
  resource: string;

  /**
   * A String value. Defines the resource type. Can be one of:
   *   - "url", for url
   *   - "base64", for base64 data
   *   - "file", for local files
   */
  resourceType?: "url" | "base64" | "file";

  /**
   * iOS file location. Can be one of:
   *   - "bundle"
   *   - "documentsDirectory"
   *   - "libraryDirectory"
   *   - "tempDirectory"
   */
  fileFrom?:
    | "bundle"
    | "documentsDirectory"
    | "libraryDirectory"
    | "tempDirectory";

  urlProps?: PDFViewUrlProps;

  /**
   * A String value. Defines encoding type. Can be one of:
   *   - "utf-8", default
   *   - "utf-16"
   */
  textEncoding?: "utf-8" | "utf-16";

  /**
   * A Number value. Fades in effect (in ms) on load successfully:
   *   - 0.0, default
   */
  fadeInDuration?: number;

  /**
   * A style for the PDFView
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Used to locate in end-to-end tests
   */
  testID?: string;
}

export default class PDFView extends Component<PDFViewProps, {}> {
  reload: () => void;
}
