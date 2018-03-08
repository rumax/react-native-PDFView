ViewPdf
# react-native-view-pdf

[![CircleCI](https://circleci.com/gh/rumax/react-native-view-pdf.svg?style=shield)](https://circleci.com/gh/rumax/react-native-view-pdf)
[![codecov](https://codecov.io/gh/rumax/react-native-view-pdf/branch/master/graph/badge.svg)](https://codecov.io/gh/rumax/react-native-view-pdf)
[![npm version](https://badge.fury.io/js/react-native-view-pdf.svg)](https://badge.fury.io/js/react-native-view-pdf)

Library for displaying [PDF documents](https://acrobat.adobe.com/us/en/acrobat/about-adobe-pdf.html) in [react-native](http://facebook.github.io/react-native/)

- android - uses implementation of [Android PdfViewer](https://github.com/barteksc/AndroidPdfViewer)
- ios - To be implemented

## Example

```js
import ViewPdf from 'react-native-view-pdf';

<View>
  <ViewPdf
    style={{
      height: 360,
      width: Dimensions.get('window').width,
    }}
    onError={(error) => {
      console.log('onError', error);
    }}
    onLoad={() => {
      console.log('onLoad');
    }}
    resource="http://www.pdf995.com/samples/pdf.pdf"
  />
</View>
```

## Getting started

`$ npm install react-native-view-pdf --save`

### Mostly automatic installation

`$ react-native link react-native-view-pdf`

### Manual installation


#### iOS

TBI

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.PdfViewPackage;` to the imports at the top of the file
  - Add `new RNReactNativePdfViewPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-pdf-view'
  	project(':react-native-pdf-view').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-pdf-view/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-pdf-view')
  	```

#### Windows
[ReactWindows](https://github.com/ReactWindows/react-native)

N/A

## License

[MIT](https://opensource.org/licenses/MIT)

### Other information

- Generated with [react-native-create-library](https://github.com/frostney/react-native-create-library)
- Alternatives: [react-native-pdf](https://www.npmjs.com/package/react-native-pdf) has full implementation of [PDFView](https://github.com/barteksc/AndroidPdfViewer) but requires other dependencies and some functionality that is superfluous if you only need to display pdf (using url or base64). Or any other [npm](www.npmjs.com) package
