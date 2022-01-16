# react-native-view-pdf

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c1c746575c124138936e9418865136ab)](https://app.codacy.com/app/rumax/react-native-PDFView?utm_source=github.com&utm_medium=referral&utm_content=rumax/react-native-PDFView&utm_campaign=Badge_Grade_Dashboard)
[![npm](https://img.shields.io/npm/l/express.svg)](https://github.com/rumax/react-native-PDFView)
[![npm version](https://badge.fury.io/js/react-native-view-pdf.svg)](https://badge.fury.io/js/react-native-view-pdf)
[![CircleCI](https://circleci.com/gh/rumax/react-native-PDFView.svg?style=shield)](https://circleci.com/gh/rumax/react-native-PDFView)
[![codecov](https://codecov.io/gh/rumax/react-native-PDFView/branch/master/graph/badge.svg)](https://codecov.io/gh/rumax/react-native-PDFView)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Library for displaying [PDF documents](https://acrobat.adobe.com/us/en/acrobat/about-adobe-pdf.html) in [react-native](http://facebook.github.io/react-native/)

- android - uses [Android PdfViewer](https://github.com/barteksc/AndroidPdfViewer). Targets minSdkVersion 21 (required by [setClipToOutline](https://developer.android.com/reference/android/view/View.html#setClipToOutline%28boolean%29)) and above. By default stable version `2.8.2` is used. It's also possible to override it and use `3.1.0-beta.1` (this version allows to handle links, etc. and will be used when Android PdfViewer stable version is released). To change the version, define it in your build file:

```
buildscript {
  ext {
    ...
    pdfViewerVersion = "3.1.0-beta.1"
  }
  ...
}
```

Barteksc PdfViewer uses JCenter, which should be [read-only indefinitely](https://jfrog.com/blog/into-the-sunset-bintray-jcenter-gocenter-and-chartcenter/), but in case the host project does not use it, there is a possibility to use [mhiew/AndroidPdfViewer](https://github.com/mhiew/AndroidPdfViewer)
 which is a fork published on mavenCentral. To use it, define the following configuration in your gradle script:

 ```
buildscript {
  ext {
    ...
    pdfViewerVersion = "3.2.0-beta.1"
    pdfViewerRepo = "com.github.mhiew"
  }
  ...
}
```

- ios - uses [WKWebView](https://developer.apple.com/documentation/webkit/wkwebview).
Targets iOS9.0 and above

- zero NPM dependencies

## Getting started

`$ npm install react-native-view-pdf --save`

## Linking

From [RN 0.60](https://github.com/facebook/react-native/releases/tag/v0.60.0) there is no need to link - [Native Modules are now Autolinked](https://facebook.github.io/react-native/blog/2019/07/03/version-60)

### Mostly automatic installation

`$ react-native link`

If it doesn't work follow the [official react native documentation](https://facebook.github.io/react-native/docs/linking-libraries-ios)

##### Using CocoaPods

In your Xcode project directory open Podfile and add the following line:

```
pod 'RNPDF', :path => '../node_modules/react-native-view-pdf'
```

And install:

```
pod install
```

#### Android

1. Open up `android/app/src/main/java/[...]/MainApplication.java`
  - Add `import com.rumax.reactnative.pdfviewer.PDFViewPackage;` to the imports at the top of the file
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

##### Note for Android
  The Android project tries to retrieve the following properties:
   - compileSdkVersion
   - buildToolsVersion
   - minSdkVersion
   - targetSdkVersion

  from the `ext` object if you have one defined in your Android's project root (you can read more about it [here](https://docs.gradle.org/current/userguide/writing_build_scripts.html#example_using_extra_properties)). If not, it falls back to its current versions (check [the gradle file](./android/build.gradle) for additional information).

#### Windows
[ReactWindows](https://github.com/ReactWindows/react-native)

N/A

## Demo

Android | iOS
------- | ---
![Android](https://github.com/rumax/react-native-PDFView/raw/master/demo/res/android_pdf.gif) | ![iOS](https://github.com/rumax/react-native-PDFView/raw/master/demo/res/ios_pdf.gif)


### Quick Start

```
// With Flow type annotations (https://flow.org/)
import PDFView from 'react-native-view-pdf';
// Without Flow type annotations
// import PDFView from 'react-native-view-pdf/lib/index';

const resources = {
  file: Platform.OS === 'ios' ? 'downloadedDocument.pdf' : '/sdcard/Download/downloadedDocument.pdf',
  url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  base64: 'JVBERi0xLjMKJcfs...',
};

export default class App extends React.Component {
  render() {
    const resourceType = 'url';

    return (
      <View style={{ flex: 1 }}>
        {/* Some Controls to change PDF resource */}
        <PDFView
          fadeInDuration={250.0}
          style={{ flex: 1 }}
          resource={resources[resourceType]}
          resourceType={resourceType}
          onLoad={() => console.log(`PDF rendered from ${resourceType}`)}
          onError={(error) => console.log('Cannot render PDF', error)}
        />
      </View>
    );
  }
}
```

Use the [demo](https://github.com/rumax/react-native-PDFView/tree/master/demo) project to:

- Test the component on both android and iOS
- Render PDF using URL, BASE64 data or local file
- Handle error state

### Props

Name | Android | iOS | Description
---- | ------- | --- | -----------
resource | ✓ | ✓ | A resource to render. It's possible to render PDF from `file`, `url` (should be [encoded](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)) or `base64`
resourceType | ✓ | ✓ | Should correspond to resource and can be: `file`, `url` or `base64`
fileFrom | ✗ | ✓ | *iOS ONLY:* In case if `resourceType` is set to `file`, there are different way to search for it on [iOS file system](https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/FileSystemOverview/FileSystemOverview.html). Currently `documentsDirectory`, `libraryDirectory`, `tempDirectory` and `bundle` are supported.
onLoad | ✓ | ✓ | Callback that is triggered when loading is completed
onError | ✓ | ✓ | Callback that is triggered when loading has failed. And error is provided as a function parameter
style | ✓ | ✓ | A [style](https://facebook.github.io/react-native/docs/style)
fadeInDuration | ✓ | ✓ | Fade in duration (in ms, defaults to 0.0) to smoothly fade the webview into view when pdf loading is completed
enableAnnotations | ✓ | ✗ | *Android ONLY:* Boolean to enable Android view annotations (default is false).
urlProps | ✓ | ✓ | Extended properties for `url` type that allows to specify HTTP Method, HTTP headers and HTTP body
onPageChanged | ✓ | ✗ | Callback that is invoked when page is changed. Provides `active page` and `total pages` information
onScrolled | ✓ | ✓ | Callback that is invoked when PDF is scrolled. Provides `offset` value in a range between 0 and 1. *Currently only 0 and 1 are supported*.

### Methods

#### `reload`

Allows to reload the PDF document. This can be useful in such cases as network issues, document is expired, etc. To reload the document you will need a `ref` to the component:

```js
...

render() {
  return (
    <PDFView
      ...
      ref={(ref) => this._pdfRed = ref} />
  );
}
```

And trigger it by calling `reloadPDF`:

```js
reloadPDF = async () => {
  const pdfRef = this._pdfRef;

  if (!pdfRef) {
    return;
  }

  try {
    await pdfRef.reload();
  } catch (err) {
    console.err(err.message);
  }
}
```

Or check the [demo project](https://github.com/rumax/react-native-PDFView/tree/master/demo) which also includes this functionality.


### Development tips

On android for the `file` type it is required to request permissions to
read/write. You can get more information in [PermissionsAndroid](https://facebook.github.io/react-native/docs/permissionsandroid)
section from react native or [Request App Permissions ](https://developer.android.com/training/permissions/requesting) from android
documentation. [Demo](https://github.com/rumax/react-native-PDFView/tree/master/demo)
project provides an example how to implement it using Java, check the [MainActivity.java](https://github.com/rumax/react-native-PDFView/blob/b84913df174d3b638d2d820a66ed4e6605d56860/demo/android/app/src/main/java/com/demo/MainActivity.java#L12) and [AndroidManifest.xml](https://github.com/rumax/react-native-PDFView/blob/b84913df174d3b638d2d820a66ed4e6605d56860/demo/android/app/src/main/AndroidManifest.xml#L6) files.

Before trying `file` type in [demo project](https://github.com/rumax/react-native-PDFView/tree/master/demo), open `sdcard/Download` folder in `Device File Explorer` and store some `downloadedDocument.pdf` document that you want to render.

On iOS, when using resource `file` you can specify where to look for the file with `fileFrom`. If you do not pass any value, the component will lookup in two places. First, it will attempt to locate the file in the Bundle. If it cannot locate it there, it will search the Documents directory. For more information on the iOS filesystem access at runtime of an application please refer [the official documentation](https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/FileSystemOverview/FileSystemOverview.html).
Note here that the resource will always need to be a relative path from the Documents directory for example and also do NOT put the scheme in the path (so no `file://.....`).

You can find an example of both usage of the Bundle and Documents directory for rendering a pdf from `file` on iOS in the demo project.

In [demo](https://github.com/rumax/react-native-PDFView/tree/master/demo) project you can also run the simple server to serve PDF file. To do this navigate to `demo/utils/` and start the server
`node server.js`. (*Do not forget to set proper IP adress of the server
in `demo/App.js`*)

## License

[MIT](https://opensource.org/licenses/MIT)

## Authors
- [sanderfrenken](https://github.com/sanderfrenken)
- [rumax](https://github.com/rumax)

### Other information

- Generated with [react-native-create-library](https://github.com/frostney/react-native-create-library)
- Zero JavaScript dependency. Which means that you do not bring other dependencies to your project
- If you think that something is missing or would like to propose new feature, please, discuss it with authors
- Please, feel free to ⭐️ the project. This gives us a confidence that you like it and we did a great job by publishing and supporting it 🤩
- [If you are using ProGuard, add following rule to proguard config file:](https://github.com/barteksc/AndroidPdfViewer#proguard)

```
    -keep class com.shockwave.**
```
