namespace dotnetCore.Model;

public class CusTask
{
    public string Title { get; set; }
    public string Context { get; set; }
    public string CreateTime { get; set; }
    
    public UserInfo UserInfo { get; set; }
}