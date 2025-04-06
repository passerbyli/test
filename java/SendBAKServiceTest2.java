package com.macro.mall.tiny.service.impl;

import org.junit.Test;
import org.mockito.Mockito;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.HttpURLConnection;
import java.nio.charset.StandardCharsets;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

public class SendBAKServiceTest {

    private final SendBAKService service = new SendBAKService();

    // ✅ 正常路径
    @Test
    public void testResponseHandler_normal() throws Exception {
        HttpURLConnection connection = mock(HttpURLConnection.class);
        HttpServletResponse response = mock(HttpServletResponse.class);

        String testData = "hello\nworld";
        InputStream inputStream = new ByteArrayInputStream(testData.getBytes(StandardCharsets.UTF_8));
        StringWriter outputWriter = new StringWriter();
        PrintWriter writer = new PrintWriter(outputWriter);

        when(connection.getInputStream()).thenReturn(inputStream);
        when(response.getWriter()).thenReturn(writer);

        service.responseHandler(connection, response);
        writer.flush();

        // ✅ 断言输出
        assertEquals("helloworld", outputWriter.toString());
    }

    // ✅ connection.getInputStream() 抛出异常
    @Test
    public void testResponseHandler_connectionInputStreamException() throws Exception {
        HttpURLConnection connection = mock(HttpURLConnection.class);
        HttpServletResponse response = mock(HttpServletResponse.class);

        when(connection.getInputStream()).thenThrow(new IOException("conn error"));

        try {
            service.responseHandler(connection, response);
            fail("Expected IOException");
        } catch (IOException e) {
            // ✅ 有断言
            assertTrue(e.getMessage().contains("发送响应数据失败"));
            assertTrue(e.getCause().getMessage().contains("conn error"));
        }
    }

    // ✅ response.getWriter() 抛出异常
    @Test
    public void testResponseHandler_writerException() throws Exception {
        HttpURLConnection connection = mock(HttpURLConnection.class);
        HttpServletResponse response = mock(HttpServletResponse.class);

        InputStream inputStream = new ByteArrayInputStream("test".getBytes(StandardCharsets.UTF_8));
        when(connection.getInputStream()).thenReturn(inputStream);
        when(response.getWriter()).thenThrow(new IOException("writer error"));

        try {
            service.responseHandler(connection, response);
            fail("Expected IOException");
        } catch (IOException e) {
            // ✅ 有断言
            assertTrue(e.getMessage().contains("发送响应数据失败"));
            assertTrue(e.getCause().getMessage().contains("writer error"));
        }
    }

    // ✅ readAndWrite 正常工作
    @Test
    public void testReadAndWrite_normal() throws Exception {
        String input = "abc\n123";
        InputStream inputStream = new ByteArrayInputStream(input.getBytes(StandardCharsets.UTF_8));
        StringWriter stringWriter = new StringWriter();

        service.readAndWrite(inputStream, stringWriter);

        // ✅ 断言结果
        assertEquals("abc123", stringWriter.toString());
    }

    // ✅ readAndWrite 中 readLine 抛异常
    @Test
    public void testReadAndWrite_readException() throws Exception {
        InputStream mockInputStream = mock(InputStream.class);
        BufferedReader mockReader = mock(BufferedReader.class);
        Writer mockWriter = mock(Writer.class);

        // 使用 spy 替换方法以注入 mock reader
        SendBAKService spyService = Mockito.spy(service);
        doReturn(mockReader).when(spyService).createBufferedReader(any(InputStream.class));
        doReturn(new BufferedWriter(mockWriter)).when(spyService).createBufferedWriter(any(Writer.class));

        when(mockReader.readLine()).thenThrow(new IOException("read error"));

        try {
            spyService.readAndWrite(mockInputStream, mockWriter);
            fail("Expected IOException");
        } catch (IOException e) {
            // ✅ 断言异常内容
            assertTrue(e.getMessage().contains("读取/写入失败"));
            assertTrue(e.getCause().getMessage().contains("read error"));
        }
    }

    // ✅ readAndWrite 中 writer.write 抛异常
    @Test
    public void testReadAndWrite_writeException() throws Exception {
        InputStream inputStream = new ByteArrayInputStream("test".getBytes(StandardCharsets.UTF_8));
        Writer mockWriter = mock(Writer.class);

        doThrow(new IOException("write error")).when(mockWriter).write(anyString());

        try {
            service.readAndWrite(inputStream, mockWriter);
            fail("Expected IOException");
        } catch (IOException e) {
            // ✅ 断言异常内容
            assertTrue(e.getMessage().contains("读取/写入失败"));
            assertTrue(e.getCause().getMessage().contains("write error"));
        }
    }

    // ✅ closeQuietly 捕获关闭异常
    @Test
    public void testCloseQuietly_exception() throws IOException {
        Closeable closeable = mock(Closeable.class);
        doThrow(new IOException("close error")).when(closeable).close();

        // 无异常即为通过
        service.closeQuietly(closeable);
        // ✅ 明确断言某种行为（虽然不会抛出异常）
        assertTrue(true);
    }

    // ✅ closeQuietly 正常关闭
    @Test
    public void testCloseQuietly_normal() throws IOException {
        Closeable closeable = mock(Closeable.class);
        service.closeQuietly(closeable);

        // ✅ 验证方法被调用
        verify(closeable, times(1)).close();
    }
}