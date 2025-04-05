import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Service;

@Service
public class AsyncService {

    @Autowired
    private ThreadPoolTaskExecutor taskExecutor;

    @Async("name")  // 使用自定义的线程池
    public void performAsyncTask() {
        // 打印当前线程名称
        String currentThreadName = Thread.currentThread().getName();
        System.out.println("Current Thread Name: " + currentThreadName);
        
        // 打印线程池的核心线程数、最大线程数、队列大小等信息
        int corePoolSize = taskExecutor.getCorePoolSize();
        int maxPoolSize = taskExecutor.getMaxPoolSize();
        int queueSize = taskExecutor.getQueue().size();
        
        System.out.println("Core Pool Size: " + corePoolSize);
        System.out.println("Max Pool Size: " + maxPoolSize);
        System.out.println("Queue Size: " + queueSize);
    }
}