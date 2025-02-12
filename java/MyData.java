package com.macro.mall.tiny.exportPkg;

import com.alibaba.excel.annotation.ExcelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class MyData {
    @ExcelProperty("ID")
    private Long id;

    @ExcelProperty("名称")
    private String name;

    @ExcelProperty("创建时间")
    private LocalDateTime createTime;

}
