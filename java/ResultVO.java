package com.macro.mall.tiny.exportPkg;

public class ResultVO {
    private String msg;
    private String taskId;

    public static ResultVO success(String msg, String taskId) {
        return new ResultVO();
    }

}
