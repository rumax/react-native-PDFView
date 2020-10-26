/* @flow */
import { Platform } from 'react-native';
import type { UrlPropsType } from 'react-native-view-pdf';

import base64Data from './base64.json';

export type Resource = {|
  resource: string,
  resourceType: 'url' | 'base64' | 'file',
  urlProps?: UrlPropsType,
|};

const resources: {[key: string]: Resource } = {
  fileAssets: {
    resource: Platform.OS === 'ios' ? 'test-pdf.pdf' : 'assets-pdf.pdf',
    resourceType: 'file',
  },
  file: {
    resource: `${Platform.OS === 'ios' ? '' : '/sdcard/Download/'}downloadedDocument.pdf`,
    resourceType: 'file',
  },
  url: {
    resource: 'http://www.africau.edu/images/default/sample.pdf',
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
        'Referer': 'http://localhost/',
      },
      body: 'Request PDF body',
    },
  },
  base64: {
    resource: base64Data.document,
    resourceType: 'base64',
  },
  invalidData: {
    resource: '**invalid base 64**',
    resourceType: 'base64',
  },
  invalidProtocol: {
    resource: 'file:/test-pdf.pdf',
    resourceType: 'url',
  },
};

export default resources;
