import React from 'react';
import renderer from 'react-test-renderer';

import PDFVIew from '../index';

jest.mock('../RNPDFView', () => 'RNPDFView');

describe('PDFView', () => {
  it('renders', () => {
    const tree = renderer.create(<PDFVIew resource="http://site.com/pdf" />);

    expect(tree).toMatchSnapshot();
  });
});
