package com.rumax.reactnative.pdfviewer;

/*
 * Copyright (c) <2018> <Maksym Rusynyk>
 *
 * This source code is licensed under the MIT license
 */

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Collections;
import java.util.List;

public class PDFViewPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @SuppressWarnings("rawtypes")
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.<ViewManager>singletonList(new PDFViewManager(reactContext));
    }
}
