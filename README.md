# react-native-view-pdf

[![CircleCI](https://circleci.com/gh/rumax/react-native-PDFView.svg?style=shield)](https://circleci.com/gh/rumax/react-native-PDFView)
[![codecov](https://codecov.io/gh/rumax/react-native-PDFView/branch/master/graph/badge.svg)](https://codecov.io/gh/rumax/react-native-PDFView)
[![npm version](https://badge.fury.io/js/react-native-view-pdf.svg)](https://badge.fury.io/js/react-native-view-pdf)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Library for displaying [PDF documents](https://acrobat.adobe.com/us/en/acrobat/about-adobe-pdf.html) in [react-native](http://facebook.github.io/react-native/)

- android - uses [Android PdfViewer](https://github.com/barteksc/AndroidPdfViewer). Stable version `com.github.barteksc:android-pdf-viewer:2.8.2` is used.

- ios - uses [WKWebView](https://developer.apple.com/documentation/webkit/wkwebview).
Targets iOS9.0 and above

## Examples

### PDF from url

```js
import PDFView from 'react-native-view-pdf';

<View style={{ flex: 1 }}>
  <PDFView
    style={{ flex: 1 }}
    onError={(error) => console.log('onError', error)}
    onLoad={() => console.log('PDF rendered from url')}
    resource="http://www.pdf995.com/samples/pdf.pdf"
    resourceType="url"
  />
</View>
```

### PDF from base64

```js
import PDFView from 'react-native-view-pdf';

<View style={{ flex: 1 }}>
  <PDFView
    style={{ flex: 1 }}
    onError={(error) => console.log('onError', error)}
    onLoad={() => console.log('PDF rendered from base 64 data')}
    resource="JVBERi0xLjMKJcfs..."
    resourceType: 'base64'
  />
</View>
```

### PDF from file

```js
import PDFView from 'react-native-view-pdf';

<View style={{ flex: 1 }}>
  <PDFView
    style={{ flex: 1 }}
    onError={(error) => console.log('onError', error)}
    onLoad={() => console.log('PDF rendered from file')}
    resource="/sdcard/Download/test-pdf.pdf"
    resourceType="file"
  />
</View>
```
#### iOS only
You can set the additional property 'fadeInDuration' (in ms, defaults to 0.0) to smoothly fade the webview into view when pdf loading is completed.

#### local file support (Android todo)
You can load local PDF files by using resourceType `file`.

Currently, this is supported only for iOS. The implementation will first look in the MainBundle for the file.
If this fails, the DocumentDirectory will be queried for the document.

## Getting started

`$ npm install react-native-view-pdf --save`

### Mostly automatic installation

`$ react-native link react-native-view-pdf`

### Manual installation


#### iOS

1. Add ReactNativeViewPDF project to your project
2. Under your build target general settings, add the library to your Linked Frameworks and Libraries
3. If you run into any issues, confirm that under Build Phases -> Link Binary With Libraries the library is present

#### Android

1. Open up `android/app/src/main/java/[...]/MainApplication.java`
  - Add `import com.reactlibrary.PDFViewPackage;` to the imports at the top of the file
  - Add `new PDFViewPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
    ```
    include ':react-native-view-pdf'
    project(':react-native-view-pdf').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-view-pdf/android')
    ```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
    ```
    compile project(':react-native-view-pdf')
    ```

#### Windows
[ReactWindows](https://github.com/ReactWindows/react-native)

N/A

## Demo

Check the  [demo](https://github.com/rumax/react-native-PDFView/tree/master/demo) to:

- test the component on android and ios
- render PDF using URL
- render PDF using BASE64 data
- handle error state

### Android

![Demo](https://github.com/rumax/react-native-PDFView/raw/master/demo/res/android_pdf.gif)

### iOS

![Demo](https://github.com/rumax/react-native-PDFView/raw/master/demo/res/ios_pdf.gif)

## License

[MIT](https://opensource.org/licenses/MIT)

### Other information

- Generated with [react-native-create-library](https://github.com/frostney/react-native-create-library)
- Zero JavaScript dependency. Which means that you do not bring other dependencies to your project
- You can try other [NPM packages](https://www.npmjs.com/search?q=pdf+react+native) if you think that something is missing or, please, discuss it with the authors.
