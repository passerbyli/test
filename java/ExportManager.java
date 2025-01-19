import org.springframework.stereotype.Service;

import java.util.concurrent.*;

@Service
public class ExportManager {

    // 创建一个最大线程数为 3 的线程池，多个导出接口共享这个线程池
    private static final ExecutorService executorService = Executors.newFixedThreadPool(3);

    /**
     * 执行导出任务，最多 3 个线程同时执行，超过 3 个线程时需要等待。
     * 如果任务在规定的时间内没有获得执行，则会抛出 TimeoutException。
     *
     * @param exportTask 具体的导出任务
     * @param timeout 超时时间（秒）
     * @throws TimeoutException 如果超时
     * @throws InterruptedException 如果线程被中断
     */
    public ByteArrayOutputStream executeExportTask(ExportTask exportTask, long timeout) throws TimeoutException, InterruptedException {
        // 提交任务并获取 Future 对象
        Future<ByteArrayOutputStream> future = executorService.submit(exportTask::executeExport);

        try {
            // 等待任务完成，如果任务没有在超时时间内完成，则抛出超时异常
            return future.get(timeout, TimeUnit.SECONDS); // 等待直到超时或任务完成
        } catch (TimeoutException e) {
            System.err.println("任务排队超时");
            future.cancel(true); // 超时取消任务
            throw e;
        } catch (ExecutionException e) {
            System.err.println("任务执行异常");
            throw new RuntimeException("任务执行失败", e);
        }
    }
}