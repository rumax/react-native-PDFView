package com.reactlibrary;

/**
 * Created by Maksym Rusynyk on 06/03/2018.
 *
 * This source code is licensed under the MIT license
 */

import android.content.Context;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import java.util.Map;

public class ViewPdfManager extends SimpleViewManager<ViewPdf> {
    private static final String REACT_CLASS = "ViewPdf";
    private Context context;
    private ViewPdf viewPdf = null;

    public ViewPdfManager(ReactApplicationContext context) {
        this.context = context;
    }

    public Map getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder
                .builder()
                .put(
                        "onLoad",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of("bubbled", "onLoad")
                        )
                )
                .put(
                        "onError",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of("bubbled", "onError")
                        )
                )
                .build();
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public ViewPdf createViewInstance(ThemedReactContext context) {
        if (viewPdf != null) {
          viewPdf.onDrop();
        }
        viewPdf = new ViewPdf(context);
        return viewPdf;
    }

    @Override
    public void onDropViewInstance(ViewPdf viewPdf) {
        viewPdf.onDrop();
    }

    @ReactProp(name = "resource")
    public void setResource(ViewPdf viewPdf, String resource) {
        viewPdf.setResource(resource);
    }

    @Override
    public void onAfterUpdateTransaction(ViewPdf viewPdf) {
        super.onAfterUpdateTransaction(viewPdf);

        viewPdf.renderPdf();
    }
}
