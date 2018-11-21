/* @flow */
import React from 'react';
import renderer from 'react-test-renderer';

import {
  findNodeHandle,
  NativeModules,
} from 'react-native';

import PDFVIew from '../index';

jest.mock('../RNPDFView', () => 'RNPDFView');
jest.mock('react-native', () => ({
  findNodeHandle: jest.fn(),
  Platform: { select: jest.fn(platforms => platforms.ios) },
  NativeModules: { PDFViewManager: { reload: jest.fn(), share: jest.fn() } },
}));

describe('PDFView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  it('trigger reload', (done) => {
    let pdfRef: any;

    findNodeHandle.mockImplementationOnce(() => 'handle for ref');
    const tree = renderer.create(<PDFVIew
      resource="base64"
      resourceType="base64"
      ref={(ref) => {
        pdfRef = ref;
      }}
    />);

    const component = tree.getInstance();
    const ref = { _name: 'ref_to_the_viewer' };

    // $FlowFixMe: ignore null
    component._setViewRef(ref);

    setTimeout(() => {
      expect(pdfRef.reload).toBeTruthy();
      pdfRef.reload();

      expect(findNodeHandle).toHaveBeenCalledTimes(1);
      expect(NativeModules.PDFViewManager.reload).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('trigger reload throws exception if findNodeHandle fails to find handle', (done) => {
    let pdfRef: any;

    const tree = renderer.create(<PDFVIew
      resource="base64"
      resourceType="base64"
      ref={(ref) => {
        pdfRef = ref;
      }}
    />);

    const component = tree.getInstance();
    const ref = { _name: 'ref_to_the_viewer' };

    // $FlowFixMe: ignore null
    component._setViewRef(ref);

    setTimeout(async () => {
      expect(pdfRef.reload).toBeTruthy();
      let error;

      try {
        await pdfRef.reload();
      } catch (err) {
        error = err;
      }

      expect(error).toMatchSnapshot();
      done();
    });
  });

  it('trigger share', (done) => {
    let pdfRef: any;

    findNodeHandle.mockImplementationOnce(() => 'handle for ref');
    const tree = renderer.create(<PDFVIew
      resource="base64"
      resourceType="base64"
      ref={(ref) => {
        pdfRef = ref;
      }}
    />);

    const component = tree.getInstance();
    const ref = { _name: 'ref_to_the_viewer' };

    // $FlowFixMe: ignore null
    component._setViewRef(ref);

    setTimeout(() => {
      expect(pdfRef.share).toBeTruthy();
      pdfRef.share();

      expect(findNodeHandle).toHaveBeenCalledTimes(1);
      expect(NativeModules.PDFViewManager.share).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('trigger share throws exception if findNodeHandle fails to find handle', (done) => {
    let pdfRef: any;

    const tree = renderer.create(<PDFVIew
      resource="base64"
      resourceType="base64"
      ref={(ref) => {
        pdfRef = ref;
      }}
    />);

    const component = tree.getInstance();
    const ref = { _name: 'ref_to_the_viewer' };

    // $FlowFixMe: ignore null
    component._setViewRef(ref);

    setTimeout(async () => {
      expect(pdfRef.share).toBeTruthy();
      let error;

      try {
        await pdfRef.share();
      } catch (err) {
        error = err;
      }

      expect(error).toMatchSnapshot();
      done();
    });
  });
});
