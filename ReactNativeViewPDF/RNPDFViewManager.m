#import "RNPDFViewManager.h"
#import <React/RCTUIManager.h>

@implementation RNPDFViewManager

RCT_EXPORT_MODULE(PDFView)

RCT_CUSTOM_VIEW_PROPERTY(resource, NSString, RNPDFView) {
    [view setResource: json ? [RCTConvert NSString: json] : nil];
}

RCT_CUSTOM_VIEW_PROPERTY(resourceType, NSString, RNPDFView) {
    [view setResourceType: json ? [RCTConvert NSString: json] : nil];
}

RCT_CUSTOM_VIEW_PROPERTY(fileFrom, NSString, RNPDFView) {
    [view setFileFrom: json ? [RCTConvert NSString: json] : nil];
}

RCT_CUSTOM_VIEW_PROPERTY(textEncoding, NSString, RNPDFView) {
    [view setTextEncoding: json ? [RCTConvert NSString: json] : UTF_8];
}

RCT_CUSTOM_VIEW_PROPERTY(urlProps, NSDictionary, RNPDFView) {
    [view setUrlProps: json ? [RCTConvert NSDictionary: json] : nil];
}

RCT_CUSTOM_VIEW_PROPERTY(fadeInDuration, NSTimeInterval, RNPDFView) {
    [view setFadeInDuration: json ? [RCTConvert NSTimeInterval: json] : 0.0];
}

RCT_EXPORT_VIEW_PROPERTY(onLoad, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onError, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onScrolled, RCTDirectEventBlock)

RCT_EXPORT_METHOD(reload: (nonnull NSNumber *)reactTag resolver: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject) {
    dispatch_async(dispatch_get_main_queue(), ^{
        RNPDFView *pdfView = (RNPDFView *)[self.bridge.uiManager viewForReactTag: reactTag];
        if (!pdfView) {
            reject(ERROR_INVALID_REACT_TAG, [NSString stringWithFormat: @"ReactTag passed: %@", reactTag], nil);
            return;
        }
        [pdfView reload];
        resolve(nil);
    });
}

- (instancetype)init {
    self = [super init];
    return self;
}

- (UIView *)view {
    self.pdfView = [[RNPDFView alloc] init];
    return self.pdfView;
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

@end
