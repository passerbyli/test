package com.macro.mall.tiny.service.impl;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.context.junit4.SpringRunner;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.HttpURLConnection;

import static org.mockito.Mockito.*;

@RunWith(SpringRunner.class)
public class SendServiceTest {

    @InjectMocks
    private SendService sendService;

    @Mock
    private HttpURLConnection connection;

    @Mock
    private HttpServletResponse response;

    private StringWriter stringWriter;
    private PrintWriter printWriter;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        stringWriter = new StringWriter();
        printWriter = new PrintWriter(stringWriter);
    }

    // 1. 正常读取并写入
    @Test
    public void testResponseHandler_normal() throws Exception {
        String input = "line1\nline2\nline3";
        InputStream inputStream = new ByteArrayInputStream(input.getBytes("UTF-8"));

        when(connection.getInputStream()).thenReturn(inputStream);
        when(response.getWriter()).thenReturn(printWriter);

        sendService.responseHandler(connection, response);

        Assert.assertEquals("line1line2line3", stringWriter.toString());
    }

    // 2. connection.getInputStream 抛异常
    @Test
    public void testResponseHandler_inputStreamThrows() throws Exception {
        when(connection.getInputStream()).thenThrow(new IOException("input error"));

        try {
            sendService.responseHandler(connection, response);
            Assert.fail("Expected IOException not thrown");
        } catch (IOException e) {
            Assert.assertEquals("input error", e.getMessage());
        }
    }

    // 3. response.getWriter 抛异常
    @Test
    public void testResponseHandler_getWriterThrows() throws Exception {
        InputStream inputStream = new ByteArrayInputStream("test".getBytes("UTF-8"));
        when(connection.getInputStream()).thenReturn(inputStream);
        when(response.getWriter()).thenThrow(new IOException("writer error"));

        try {
            sendService.responseHandler(connection, response);
            Assert.fail("Expected IOException not thrown");
        } catch (IOException e) {
            Assert.assertEquals("writer error", e.getMessage());
        }
    }

    // 4. bufferedReader.readLine 抛出 RuntimeException
    @Test
    public void testResponseHandler_readLineThrows() throws Exception {
        InputStream brokenStream = new InputStream() {
            @Override
            public int read() {
                throw new RuntimeException("broken stream");
            }
        };
        when(connection.getInputStream()).thenReturn(brokenStream);
        when(response.getWriter()).thenReturn(printWriter);

        try {
            sendService.responseHandler(connection, response);
            Assert.fail("Expected RuntimeException not thrown");
        } catch (RuntimeException e) {
            Assert.assertEquals("broken stream", e.getMessage());
        }
    }

    // 5. writer.write 抛出异常
    @Test
    public void testResponseHandler_writerWriteThrows() throws Exception {
        String input = "X";
        InputStream inputStream = new ByteArrayInputStream(input.getBytes("UTF-8"));
        PrintWriter mockWriter = mock(PrintWriter.class);
        doThrow(new RuntimeException("write error")).when(mockWriter).write(anyString());

        when(connection.getInputStream()).thenReturn(inputStream);
        when(response.getWriter()).thenReturn(mockWriter);

        try {
            sendService.responseHandler(connection, response);
            Assert.fail("Expected RuntimeException not thrown");
        } catch (RuntimeException e) {
            Assert.assertEquals("write error", e.getMessage());
        }
    }

    // 6. writer.flush 抛出异常
    @Test
    public void testResponseHandler_writerFlushThrows() throws Exception {
        String input = "Y";
        InputStream inputStream = new ByteArrayInputStream(input.getBytes("UTF-8"));
        PrintWriter mockWriter = spy(new PrintWriter(new StringWriter()));
        doThrow(new RuntimeException("flush error")).when(mockWriter).flush();

        when(connection.getInputStream()).thenReturn(inputStream);
        when(response.getWriter()).thenReturn(mockWriter);

        try {
            sendService.responseHandler(connection, response);
            Assert.fail("Expected RuntimeException not thrown");
        } catch (RuntimeException e) {
            Assert.assertEquals("flush error", e.getMessage());
        }
    }

    // 7. 空输入流处理
    @Test
    public void testResponseHandler_emptyInputStream() throws Exception {
        InputStream inputStream = new ByteArrayInputStream("".getBytes("UTF-8"));
        when(connection.getInputStream()).thenReturn(inputStream);
        when(response.getWriter()).thenReturn(printWriter);

        sendService.responseHandler(connection, response);

        Assert.assertEquals("", stringWriter.toString());
    }
}