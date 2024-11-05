using NLog;

public static class OperationalLogger
{
    // 使用 NLog 获取操作日志记录器
    private static readonly Logger logger = LogManager.GetLogger("OperationalLogger");

    /// <summary>
    /// 记录操作日志
    /// </summary>
    /// <param name="message">日志消息</param>
    /// <param name="level">日志级别，默认为 Info</param>
    public static void Log(string message, LogLevel level = LogLevel.Info)
    {
        switch (level)
        {
            case LogLevel.Trace:
                logger.Trace(message);
                break;
            case LogLevel.Debug:
                logger.Debug(message);
                break;
            case LogLevel.Information:
                logger.Info(message);
                break;
            case LogLevel.Warning:
                logger.Warn(message);
                break;
            case LogLevel.Error:
                logger.Error(message);
                break;
            case LogLevel.Critical:
                logger.Fatal(message);
                break;
            default:
                logger.Info(message);
                break;
        }
    }
}