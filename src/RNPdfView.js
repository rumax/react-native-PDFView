import { requireNativeComponent, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';


const componentInterface = {
  name: 'PdfView',
  propTypes: {
    /**
     * A Function. Invoked on load error with {nativeEvent: {error}}.
     */
    onError: PropTypes.func,

    /**
     * A Function. Invoked when load completes successfully.
     */
    onLoad: PropTypes.func,

    /**
     * A String value. Defines the resource to render. Can be one of:
     *   - url. Example: http://www.pdf995.com/samples/pdf.pdf
     *   - base64. Example: 'JVBERi0xLjcKCjEgMCBvYmogICUgZW50...'
     *   - fileName - Not implemented
     */
    resource: PropTypes.string,

    /**
     * A String value. Defines the resource type. Can be one of:
     *   - "url", for url
     *   - "base64", for base64 data
     *   - "file", for local files
     */
    resourceType: PropTypes.string,

    /**
     * A String value. Defines encoding type. Can be one of:
     *   - "utf-8", default
     *   - "utf-16"
     */
    textEncoding: PropTypes.string,
    ...ViewPropTypes,
  },
};


export default requireNativeComponent('PdfView', componentInterface);
