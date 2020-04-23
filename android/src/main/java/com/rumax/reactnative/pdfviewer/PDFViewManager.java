package com.rumax.reactnative.pdfviewer;

/*
 * Created by Maksym Rusynyk on 06/03/2018.
 *
 * This source code is licensed under the MIT license
 */

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nullable;

public class PDFViewManager extends SimpleViewManager<PDFView> {
    private static final String REACT_CLASS = "PDFView";
    private final static String EVENT_BUBBLED = "bubbled";
    private static final int COMMAND_RELOAD = 1;

    @SuppressWarnings("unused")
    PDFViewManager(ReactApplicationContext context) {}

    @Nullable @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put(
                        PDFView.EVENT_ON_LOAD,
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(EVENT_BUBBLED, PDFView.EVENT_ON_LOAD)
                        )
                )
                .put(
                        PDFView.EVENT_ON_ERROR,
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(EVENT_BUBBLED, PDFView.EVENT_ON_ERROR)
                        )
                )
                .put(
                        PDFView.EVENT_ON_PAGE_CHANGED,
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(EVENT_BUBBLED, PDFView.EVENT_ON_PAGE_CHANGED)
                        )
                )
                .put(
                        PDFView.EVENT_ON_SCROLLED,
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(EVENT_BUBBLED, PDFView.EVENT_ON_SCROLLED)
                        )
                )
                .build();
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public PDFView createViewInstance(ThemedReactContext context) {
        return new PDFView(context);
    }

    @Override
    public void onDropViewInstance(PDFView pdfView) {
        pdfView.onDrop();
    }

    @ReactProp(name = "resource")
    public void setResource(PDFView pdfView, String resource) {
        pdfView.setResource(resource);
    }

    @ReactProp(name = "resourceType")
    public void setResourceType(PDFView pdfView, String resourceType) {
        pdfView.setResourceType(resourceType);
    }

    @ReactProp(name = "fileFrom")
    public void setFileFrom(PDFView pdfView, String fileFrom) {
        // iOS specific, ignoring
    }

    @ReactProp(name = "textEncoding")
    public void setTextEncoding(PDFView pdfView, String textEncoding) {
        // iOS specific, ignoring
    }

    @ReactProp(name = "urlProps")
    public void setUrlProps(PDFView pdfView, final ReadableMap props) {
        pdfView.setUrlProps(props);
    }

    @ReactProp(name = "fadeInDuration")
    public void setFadeInDuration(PDFView pdfView, int duration) {
        pdfView.setFadeInDuration(duration);
    }

    @ReactProp(name = "enableAnnotations")
    public void setEnableAnnotations(PDFView pdfView, boolean enableAnnotations) {
        pdfView.setEnableAnnotations(enableAnnotations);
    }

    @Override
    public void onAfterUpdateTransaction(PDFView pdfView) {
        super.onAfterUpdateTransaction(pdfView);
        pdfView.render();
    }

    @Override
    public Map<String,Integer> getCommandsMap() {
        return MapBuilder.of("reload", COMMAND_RELOAD);
    }

    @Override
    public void receiveCommand(final PDFView view, int command, final ReadableArray args) {
        switch (command) {
            case COMMAND_RELOAD: {
                view.reload();
                break;
            }
            default: {
                break;
            }
        }
    }
}
