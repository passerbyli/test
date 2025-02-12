package com.macro.mall.tiny.exportPkg;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.concurrent.*;

@Service
public class ExportTaskManager {
    private static final Logger log = LoggerFactory.getLogger(ExportTaskManager.class);
    private final ThreadPoolExecutor executorService;

    /**
     * 线程池配置
     */
    public ExportTaskManager() {
        this.executorService = new ThreadPoolExecutor(3, // 核心线程数 = 3
                3, // 最大线程数 = 3
                30L, TimeUnit.SECONDS, // 线程空闲时间 = 30 秒
                new LinkedBlockingQueue<>(10), // 阻塞队列 = 0，直接拒绝超出任务
                Executors.defaultThreadFactory(), new ThreadPoolExecutor.AbortPolicy() // 超出任务数直接拒绝
        );
    }

    /**
     * **提交任务到线程池**
     * - `waitTimeInSeconds > 0`：等待指定时间
     * - 任务超时后，`future.cancel(true)` 取消任务
     * - `false` 表示任务未能提交（线程池满）
     */
    public TaskStatusVO submitTask(Runnable task, int waitTimeInSeconds) {
        Future<?> future = null;
        try {
            future = executorService.submit(() -> {
                logThreadPoolStatus();
                task.run();
            });

            if (waitTimeInSeconds > 0) {
                future.get(waitTimeInSeconds, TimeUnit.SECONDS); // **等待任务执行**
            }
            return TaskStatusVO.success();
        } catch (TimeoutException e) {
            future.cancel(true); // **超时取消任务**
            log.error("任务执行超时");
            return TaskStatusVO.error("timeOut", "任务执行超时");
        } catch (RejectedExecutionException e) {
            log.error("任务被拒绝：线程池已满");
            return TaskStatusVO.error("full", "任务被拒绝：线程池已满");
        } catch (InterruptedException | ExecutionException e) {
            log.error("任务执行失败：{}", e.getMessage());
            return TaskStatusVO.error("error", "任务执行失败" + e.getMessage());
        }
    }


    /**
     * 打印线程池状态
     */
    private void logThreadPoolStatus() {
        log.info("线程池状态 -> 总线程数: {}, 活跃线程数: {}, 空闲线程数: {}", executorService.getPoolSize(),
                executorService.getActiveCount(), executorService.getPoolSize() - executorService.getActiveCount());
    }


}