@Service
public class ExportTaskManager {

    private final ThreadPoolExecutor executorService;

    public ExportTaskManager() {
        this.executorService = new ThreadPoolExecutor(
                3, 3, // 核心 & 最大线程数
                30L, TimeUnit.SECONDS, // 线程空闲时间
                new LinkedBlockingQueue<>(0), // 不使用任务队列
                Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.AbortPolicy() // 任务满时拒绝
        );
    }

    /**
     * 提交任务，等待 `waitTimeInSeconds` 秒，超时则返回 false
     */
    public boolean submitTask(Runnable task, int waitTimeInSeconds) {
        Future<?> future = null;
        try {
            future = executorService.submit(() -> {
                logThreadPoolStatus();
                task.run();
            });
            if (waitTimeInSeconds > 0) {
                future.get(waitTimeInSeconds, TimeUnit.SECONDS);
            }
            return true;
        } catch (TimeoutException e) {
            if (future != null) {
                future.cancel(true);
            }
            return false;
        } catch (RejectedExecutionException | InterruptedException | ExecutionException e) {
            return false;
        }
    }

    /**
     * 记录线程池状态
     */
    private void logThreadPoolStatus() {
        int totalThreads = executorService.getPoolSize();
        int activeThreads = executorService.getActiveCount();
        int idleThreads = totalThreads - activeThreads;

        System.out.printf("🔹 线程池状态: 总线程数=%d, 正在执行=%d, 空闲线程数=%d%n",
                totalThreads, activeThreads, idleThreads);
    }
}