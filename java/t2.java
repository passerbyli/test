import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;

import java.lang.management.ManagementFactory;
import java.lang.management.OperatingSystemMXBean;

@Service
public class AsyncService {

    @Autowired
    private ThreadPoolTaskExecutor taskExecutor;

    @Async("name")
    public void performAsyncTask() {
        // 获取开始前的内存和 CPU 占用情况
        printSystemUsage("Before Async Task");

        // 执行异步任务逻辑（模拟任务）
        try {
            Thread.sleep(5000); // 模拟执行任务，实际业务逻辑应替换此处
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // 获取结束后的内存和 CPU 占用情况
        printSystemUsage("After Async Task");
    }

    private void printSystemUsage(String stage) {
        // 获取当前操作系统的内存和 CPU 使用情况
        OperatingSystemMXBean osBean = ManagementFactory.getOperatingSystemMXBean();

        // 获取系统总内存和可用内存（JVM层面的内存使用）
        long totalMemory = Runtime.getRuntime().totalMemory(); // JVM 总内存
        long freeMemory = Runtime.getRuntime().freeMemory(); // JVM 空闲内存

        // 获取 CPU 使用信息
        double systemLoad = osBean.getSystemLoadAverage(); // 系统负载

        // 打印日志
        System.out.println(stage + ":");
        System.out.println("Current Thread Name: " + Thread.currentThread().getName());
        System.out.println("Total Memory: " + totalMemory / (1024 * 1024) + " MB");
        System.out.println("Free Memory: " + freeMemory / (1024 * 1024) + " MB");
        System.out.println("System Load Average (CPU Usage): " + systemLoad);
        System.out.println("Core Pool Size: " + taskExecutor.getCorePoolSize());
        System.out.println("Max Pool Size: " + taskExecutor.getMaxPoolSize());
        System.out.println("Queue Size: " + taskExecutor.getQueue().size());
        System.out.println("-----------------------------------------");
    }
}

关键点：
	1.	内存使用情况：
	•	Runtime.getRuntime().totalMemory()：获取 JVM 总内存。
	•	Runtime.getRuntime().freeMemory()：获取 JVM 空闲内存。
	•	将内存量转换为 MB 显示，以便更直观地查看。
	2.	CPU使用情况：
	•	OperatingSystemMXBean.getSystemLoadAverage()：获取系统的 CPU 平均负载。
	•	SystemLoadAverage 返回一个表示系统负载的浮动值，通常值越大表示 CPU 占用率越高。
	3.	日志输出：
	•	在异步任务开始前和结束后分别打印内存和 CPU 使用情况。
	•	输出线程池的核心线程数、最大线程数和队列大小，帮助更全面地了解线程池的状态。

结果：
	•	在任务开始时，你会看到任务执行前的内存使用情况、CPU负载以及线程池的配置。
	•	在任务结束时，会打印结束后的内存、CPU 使用情况，以便你可以比较任务执行前后的变化。

注意：
	•	SystemLoadAverage 返回的是一个浮动的值，表示过去的平均 CPU 负载。如果你的机器上有多个 CPU 核心，它的值通常会接近核心数量。例如，在有 4 个 CPU 核心的机器上，systemLoad 的值可能会接近 4。
	•	此方法是通过 JVM 的管理接口获取的 CPU 使用情况，并不会直接显示每个线程的具体 CPU 占用。