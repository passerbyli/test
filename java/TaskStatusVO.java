package com.macro.mall.tiny.exportPkg;

import lombok.Data;

@Data
public class TaskStatusVO {
    private Boolean status;
    private String statusCode;
    private String message;

    public TaskStatusVO(Boolean status, String statusCode, String message) {
        this.status = status;
        this.statusCode = statusCode;
        this.message = message;
    }

    public static TaskStatusVO success() {
        return new TaskStatusVO(true, "ok", "");
    }

    public static TaskStatusVO error(String type, String message) {
        return new TaskStatusVO(false, type, message);
    }
}
