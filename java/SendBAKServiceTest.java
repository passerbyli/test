package com.macro.mall.tiny.service.impl;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.springframework.test.context.junit4.SpringRunner;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.HttpURLConnection;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

@RunWith(SpringRunner.class)
public class SendBAKServiceTest {

    @InjectMocks
    private SendBAKService sendService;

    @Mock
    private HttpURLConnection mockConnection;

    @Mock
    private HttpServletResponse mockResponse;

    private StringWriter stringWriter;
    private PrintWriter printWriter;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        stringWriter = new StringWriter();
        printWriter = new PrintWriter(stringWriter);
    }

    // 1. 正常路径
    @Test
    public void testResponseHandler_normal() throws Exception {
        String input = "line1\nline2\nline3";
        InputStream inputStream = new ByteArrayInputStream(input.getBytes("UTF-8"));

        when(mockConnection.getInputStream()).thenReturn(inputStream);
        when(mockResponse.getWriter()).thenReturn(printWriter);

        sendService.responseHandler(mockConnection, mockResponse);

        assertEquals("line1line2line3", stringWriter.toString());
    }

    // 2. connection.getInputStream 抛 IOException
    @Test
    public void testResponseHandler_inputStreamThrows() throws Exception {
        when(mockConnection.getInputStream()).thenThrow(new IOException("input error"));

        try {
            sendService.responseHandler(mockConnection, mockResponse);
            fail("Expected IOException not thrown");
        } catch (IOException e) {
            assertEquals("input error", e.getMessage());
        }
    }

    // 3. response.getWriter 抛 IOException
    @Test
    public void testResponseHandler_writerThrows() throws Exception {
        InputStream inputStream = new ByteArrayInputStream("data".getBytes("UTF-8"));
        when(mockConnection.getInputStream()).thenReturn(inputStream);
        when(mockResponse.getWriter()).thenThrow(new IOException("writer error"));

        try {
            sendService.responseHandler(mockConnection, mockResponse);
            fail("Expected IOException not thrown");
        } catch (IOException e) {
            assertEquals("writer error", e.getMessage());
        }
    }

    // 4. readLine 抛异常
    @Test
    public void testReadAndWrite_bufferedReaderThrows() throws Exception {
        InputStream brokenStream = new InputStream() {
            @Override
            public int read() {
                throw new RuntimeException("broken stream");
            }
        };

        try {
            sendService.readAndWrite(brokenStream, printWriter);
            fail("Expected RuntimeException not thrown");
        } catch (RuntimeException e) {
            assertEquals("broken stream", e.getMessage());
        }
    }

    // 5. writer.write 抛异常
    @Test
    public void testReadAndWrite_writeThrows() throws Exception {
        String input = "text";
        InputStream inputStream = new ByteArrayInputStream(input.getBytes("UTF-8"));

        PrintWriter mockWriter = mock(PrintWriter.class);
        doThrow(new RuntimeException("write error")).when(mockWriter).write(anyString());

        try {
            sendService.readAndWrite(inputStream, mockWriter);
            fail("Expected RuntimeException not thrown");
        } catch (RuntimeException e) {
            assertEquals("write error", e.getMessage());
        }
    }

    // 6. writer.flush 抛异常
    @Test
    public void testReadAndWrite_flushThrows() throws Exception {
        String input = "flush";
        InputStream inputStream = new ByteArrayInputStream(input.getBytes("UTF-8"));

        PrintWriter mockWriter = spy(new PrintWriter(new StringWriter()));
        doThrow(new RuntimeException("flush error")).when(mockWriter).flush();

        try {
            sendService.readAndWrite(inputStream, mockWriter);
            fail("Expected RuntimeException not thrown");
        } catch (RuntimeException e) {
            assertEquals("flush error", e.getMessage());
        }
    }

    // 7. 空输入流
    @Test
    public void testReadAndWrite_emptyStream() throws Exception {
        InputStream inputStream = new ByteArrayInputStream("".getBytes("UTF-8"));
        sendService.readAndWrite(inputStream, printWriter);
        assertEquals("", stringWriter.toString());
    }

    // 8. 多行输入
    @Test
    public void testReadAndWrite_multipleLines() throws Exception {
        String input = "A\nB\nC";
        InputStream inputStream = new ByteArrayInputStream(input.getBytes("UTF-8"));
        sendService.readAndWrite(inputStream, printWriter);
        assertEquals("ABC", stringWriter.toString());
    }
}