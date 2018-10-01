package com.rumax.reactnative.pdfviewer;

/**
 * Created by Maksym Rusynyk on 06/03/2018.
 *
 * This source code is licensed under the MIT license
 */

import android.util.Base64;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.DecelerateInterpolator;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.github.barteksc.pdfviewer.listener.OnErrorListener;
import com.github.barteksc.pdfviewer.listener.OnLoadCompleteListener;
import com.github.barteksc.pdfviewer.listener.OnPageChangeListener;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

public class PDFView extends com.github.barteksc.pdfviewer.PDFView implements
        OnLoadCompleteListener,
        OnErrorListener,
        OnPageChangeListener,
        AsyncTaskCompleted {
    public final static String EVENT_ON_LOAD = "onLoad";
    public final static String EVENT_ON_ERROR = "onError";
    public final static String EVENT_ON_PAGE_CHANGED = "onPageChanged";
    private ThemedReactContext context;
    private String resource;
    private File downloadedFile;
    private AsyncDownload asyncDownload = null;
    private String textEncoding = null;
    private String resourceType = null;
    private Configurator configurator = null;
    private boolean sourceChanged = true;
    private static final String E_NO_RESOURCE = "source is not defined";
    private static final String E_NO_RESOURCE_TYPE = "resourceType is not defined";
    private static final String E_INVALID_RESOURCE_TYPE = "resourceType is Invalid";
    private static final String E_INVALID_BASE64 = "data is not in valid Base64 scheme";
    private ReadableMap urlProps;
    private int fadeInDuration = 0;

    public PDFView(ThemedReactContext context) {
        super(context, null);
        this.context = context;
    }

    private void reactNativeMessageEvent(String eventName, String message) {
        WritableMap event = Arguments.createMap();
        event.putString("message", message);
        reactNativeEvent(eventName, event);
    }

    private void reactNativeEvent(String eventName, WritableMap event) {
        ReactContext reactContext = (ReactContext) this.getContext();
        reactContext
                .getJSModule(RCTEventEmitter.class)
                .receiveEvent(this.getId(), eventName, event);
    }

    @Override
    public void loadComplete(int numberOfPages) {
        AlphaAnimation fadeIn = new AlphaAnimation(0, 1);
        fadeIn.setInterpolator(new DecelerateInterpolator());
        fadeIn.setDuration(fadeInDuration);
        this.setAlpha(1);
        this.startAnimation(fadeIn);

        reactNativeMessageEvent(EVENT_ON_LOAD, null);
    }

    @Override
    public void onError(Throwable t) {
        reactNativeMessageEvent(EVENT_ON_ERROR, "error: " + t.getMessage());
    }

    @Override
    public void downloadTaskFailed(IOException e) {
        cleanDownloadedFile();
        onError(e);
    }

    private void setupAndLoad() {
        this.setAlpha(0);
        configurator
                .defaultPage(0)
                .swipeHorizontal(false)
                .onLoad(this)
                .onError(this)
                .onPageChange(this)
                .spacing(10)
                .load();
        sourceChanged = false;
    }

    @Override
    public void downloadTaskCompleted() {
        renderFromFile(downloadedFile);
    }

    private void renderFromFile(File file) {
        InputStream input;
        try {
            input = new FileInputStream(file);
            configurator = this.fromStream(input);
            setupAndLoad();
        } catch (FileNotFoundException e) {
            onError(e);
        }
    }

    private void renderFromBase64() {
        try {
            byte[] bytes = Base64.decode(resource, 0);
            configurator = this.fromBytes(bytes);
            setupAndLoad();
        } catch (IllegalArgumentException e) {
            onError(new IOException(E_INVALID_BASE64));
            return;
        }
    }

    private void renderFromUrl() {
        File dir = context.getCacheDir();
        try {
            downloadedFile = File.createTempFile("pdfDocument", "pdf", dir);
        } catch (IOException e) {
            onError(e);
            return;
        }

        asyncDownload = new AsyncDownload(resource, downloadedFile, this, urlProps);
        asyncDownload.execute();
    }

    public void render() {
        cleanup();

        if (resource == null) {
            onError(new IOException(E_NO_RESOURCE));
            return;
        }

        if (resourceType == null) {
            onError(new IOException(E_NO_RESOURCE_TYPE));
            return;
        }

        if (!sourceChanged) {
            return;
        }

        if (resourceType.equals("url")) {
            renderFromUrl();
        } else if (resourceType.equals("base64")) {
            renderFromBase64();
        } else if (resourceType.equals("file")) {
            renderFromFile(new File(resource));
        } else {
            onError(new IOException(E_INVALID_RESOURCE_TYPE + resourceType));
        }
    }

    private void cleanup() {
        if (asyncDownload != null) {
            asyncDownload.cancel(true);
        }
        cleanDownloadedFile();
    }

    private void cleanDownloadedFile() {
        if (downloadedFile != null) {
            downloadedFile.delete();
            downloadedFile = null;
        }
    }

    public void setResource(String resource) {
        if (isDifferent(resource, this.resource)) {
            sourceChanged = true;
        }
        this.resource = resource;
    }

    public void setResourceType(String resourceType) {
        if (isDifferent(resourceType, this.resourceType)) {
            sourceChanged = true;
        }
        this.resourceType = resourceType;
    }

    public void setTextEncoding(String textEncoding) {
        if (isDifferent(resourceType, this.resourceType)) {
            sourceChanged = true;
        }
        this.textEncoding = textEncoding;
    }

    public void onDrop() {
        cleanup();
        sourceChanged = true;
    }

    private static boolean isDifferent(String str1, String str2) {
        if (str1 == null || str2 == null) {
            return true;
        }

        return !str1.equals(str2);
    }

    public void setUrlProps(ReadableMap props) {
        this.urlProps = props == null ? new EmptyReadableMap() : props;
    }

    @Override
    public void onPageChanged(int page, int pageCount) {
        WritableMap event = Arguments.createMap();
        event.putInt("page", page);
        event.putInt("pageCount", pageCount);
        reactNativeEvent(EVENT_ON_PAGE_CHANGED, event);
    }

    public void setFadeInDuration(int duration) {
        this.fadeInDuration = duration;
    }
}
