package com.rumax.reactnative.pdfviewer;

/*
 * Created by Maksym Rusynyk on 06/03/2018.
 *
 * This source code is licensed under the MIT license
 */

import android.content.res.AssetManager;
import android.util.Base64;
import android.view.animation.AlphaAnimation;
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
import com.github.barteksc.pdfviewer.listener.OnPageScrollListener;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

public class PDFView extends com.github.barteksc.pdfviewer.PDFView implements
        OnErrorListener,
        OnPageChangeListener,
        OnPageScrollListener,
        OnLoadCompleteListener {
    public final static String EVENT_ON_LOAD = "onLoad";
    public final static String EVENT_ON_ERROR = "onError";
    public final static String EVENT_ON_PAGE_CHANGED = "onPageChanged";
    public final static String EVENT_ON_SCROLLED = "onScrolled";
    private ThemedReactContext context;
    private String resource;
    private File downloadedFile;
    private AsyncDownload downloadTask = null;
    private String resourceType = null;
    private Configurator configurator = null;
    private boolean sourceChanged = true;
    private ReadableMap urlProps;
    private int fadeInDuration = 0;
    private boolean enableAnnotations = false;
    private float lastPositionOffset = 0;

    public PDFView(ThemedReactContext context) {
        super(context, null);
        this.context = context;
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
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);
        this.setClipToOutline(true);
    }

    @Override
    public void onError(Throwable t) {
        reactNativeMessageEvent(EVENT_ON_ERROR, "error: " + t.getMessage());
    }

    @Override
    public void onPageChanged(int page, int pageCount) {
        WritableMap event = Arguments.createMap();
        event.putInt("page", page);
        event.putInt("pageCount", pageCount);
        reactNativeEvent(EVENT_ON_PAGE_CHANGED, event);
    }

    @Override
    public void onPageScrolled(int page, float positionOffset) {
        if (lastPositionOffset != positionOffset && (positionOffset == 0 || positionOffset == 1)) {
            // Only 0 and 1 are currently supported
            lastPositionOffset = positionOffset;
            WritableMap event = Arguments.createMap();
            event.putDouble("offset", positionOffset);
            reactNativeEvent(EVENT_ON_SCROLLED, event);
        }
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

    private void setupAndLoad() {
        lastPositionOffset = 0;
        this.setAlpha(0);
        configurator
                .defaultPage(0)
                .swipeHorizontal(false)
                .onLoad(this)
                .onError(this)
                .onPageChange(this)
                .onPageScroll(this)
                .spacing(10)
                .enableAnnotationRendering(enableAnnotations)
                .load();
        sourceChanged = false;
    }

    private void renderFromFile(String filePath) {
        InputStream input;

        try {
            if (filePath.startsWith("/")) { // absolute path, using FS
                input = new FileInputStream(new File(filePath));
            } else { // from assets
                AssetManager assetManager = context.getAssets();
                input = assetManager.open(filePath, AssetManager.ACCESS_BUFFER);
            }

            configurator = this.fromStream(input);
            setupAndLoad();
        } catch (IOException e) {
            onError(e);
        }
    }

    private void renderFromBase64() {
        try {
            byte[] bytes = Base64.decode(resource, 0);
            configurator = this.fromBytes(bytes);
            setupAndLoad();
        } catch (IllegalArgumentException e) {
            onError(new IOException(Errors.E_INVALID_BASE64.getCode()));
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

        downloadTask = new AsyncDownload(context, resource, downloadedFile, urlProps, new AsyncDownload.TaskCompleted() {
            @Override
            public void onComplete(Exception ex) {
                if (ex == null) {
                    renderFromFile(downloadedFile.getAbsolutePath());
                } else {
                    cleanDownloadedFile();
                    onError(ex);
                }
            }
        });
        downloadTask.execute();
    }

    public void render() {
        cleanup();

        if (resource == null) {
            onError(new IOException(Errors.E_NO_RESOURCE.getCode()));
            return;
        }

        if (resourceType == null) {
            onError(new IOException(Errors.E_NO_RESOURCE_TYPE.getCode()));
            return;
        }

        if (!sourceChanged) {
            return;
        }

        switch (resourceType) {
            case "url":
                renderFromUrl();
                break;
            case "base64":
                renderFromBase64();
                break;
            case "file":
                renderFromFile(resource);
                break;
            default:
                onError(new IOException(Errors.E_INVALID_RESOURCE_TYPE.getCode() + resourceType));
                break;
        }
    }

    private void cleanup() {
        if (downloadTask != null) {
            downloadTask.cancel(true);
        }
        cleanDownloadedFile();
    }

    private void cleanDownloadedFile() {
        if (downloadedFile != null) {
            if (!downloadedFile.delete()) {
                onError(new IOException(Errors.E_DELETE_FILE.getCode()));
            }
            downloadedFile = null;
        }
    }

    private static boolean isDifferent(String str1, String str2) {
        if (str1 == null || str2 == null) {
            return true;
        }

        return !str1.equals(str2);
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

    public void onDrop() {
        cleanup();
        sourceChanged = true;
    }

    public void setUrlProps(ReadableMap props) {
        this.urlProps = props;
    }

    public void setFadeInDuration(int duration) {
        this.fadeInDuration = duration;
    }

    public void setEnableAnnotations(boolean enableAnnotations) {
        this.enableAnnotations = enableAnnotations;
    }

    public void reload() {
        sourceChanged = true;
        render();
    }
}
