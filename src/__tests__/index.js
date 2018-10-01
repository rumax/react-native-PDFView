/* @flow */
import React from 'react';
import renderer from 'react-test-renderer';

import PDFVIew from '../index';

jest.mock('../RNPDFView', () => 'RNPDFView');

describe('PDFView', () => {
  it('renders with default url source type', () => {
    const tree = renderer.create(<PDFVIew resource="http://site.com/pdf" />);

    expect(tree).toMatchSnapshot();
  });

  it('renders base64', () => {
    const tree = renderer.create(<PDFVIew resource="base64" resourceType="base64" />);

    expect(tree).toMatchSnapshot();
  });

  it('invokes onLoad callback', () => {
    const onLoad = jest.fn();
    const tree = renderer.create(<PDFVIew
      onLoad={onLoad}
      resource="base64"
      resourceType="base64"
    />);

    (tree.toJSON(): any).props.onLoad();

    expect(onLoad).toHaveBeenCalledTimes(1);
  });

  it('invokes onError callback', () => {
    const onError = jest.fn();
    const tree = renderer.create(<PDFVIew
      onError={onError}
      resource="base64"
      resourceType="base64"
    />);

    (tree.toJSON(): any).props.onError();

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls).toMatchSnapshot();
  });

  it('invokes onError callback and provides native error', () => {
    const onError = jest.fn();
    const tree = renderer.create(<PDFVIew
      onError={onError}
      resource="base64"
      resourceType="base64"
    />);

    (tree.toJSON(): any).props.onError({ nativeEvent: { message: 'native error' } });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls).toMatchSnapshot();
  });

  it('invokes onPageChanged callback', () => {
    const onPageChanged = jest.fn();
    const tree = renderer.create(<PDFVIew
      onPageChanged={onPageChanged}
      resource="base64"
      resourceType="base64"
    />);

    (tree.toJSON(): any).props.onPageChanged({ nativeEvent: { page: 2, pageCount: 10 } });

    expect(onPageChanged).toHaveBeenCalledTimes(1);
    expect(onPageChanged.mock.calls).toMatchSnapshot();
  });

  it('uses default callbacks', () => {
    const tree = renderer.create(<PDFVIew
      resource="base64"
      resourceType="base64"
    />);

    (tree.toJSON(): any).props.onError();
    (tree.toJSON(): any).props.onLoad();
    (tree.toJSON(): any).props.onPageChanged();
  });
});
