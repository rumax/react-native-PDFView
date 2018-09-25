package com.reactlibrary;

import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;

import java.util.HashMap;

public class EmptyReadableMap implements ReadableMap {
    @Override
    public boolean hasKey(String name) {
        return false;
    }

    @Override
    public boolean isNull(String name) {
        return false;
    }

    @Override
    public boolean getBoolean(String name) {
        return false;
    }

    @Override
    public double getDouble(String name) {
        return 0;
    }

    @Override
    public int getInt(String name) {
        return 0;
    }

    @Override
    public String getString(String name) {
        return null;
    }

    @Override
    public ReadableArray getArray(String name) {
        return null;
    }

    @Override
    public ReadableMap getMap(String name) {
        return null;
    }

    @Override
    public Dynamic getDynamic(String name) {
        return null;
    }

    @Override
    public ReadableType getType(String name) {
        return null;
    }

    @Override
    public ReadableMapKeySetIterator keySetIterator() {
        return null;
    }

    @Override
    public HashMap<String, Object> toHashMap() {
        return null;
    }
}
