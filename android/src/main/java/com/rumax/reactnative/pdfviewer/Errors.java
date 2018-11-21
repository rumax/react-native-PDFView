package com.rumax.reactnative.pdfviewer;

public enum Errors {
    E_NO_RESOURCE("source is not defined"),
    E_NO_RESOURCE_TYPE("resourceType is not defined"),
    E_INVALID_RESOURCE_TYPE("resourceType is Invalid"),
    E_INVALID_BASE64("data is not in valid Base64 scheme"),
    E_DELETE_FILE("Cannot delete downloaded file");

    private final String code;

    Errors(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
