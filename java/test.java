package com.macro.mall.tiny.service.impl;

import org.junit.Before;
import org.junit.Test;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.HttpURLConnection;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

public class SendServiceTest {

    private SendService sendService;

    @Before
    public void setUp() {
        sendService = new SendService();
    }

    // === readAndWrite 方法测试 ===

    @Test
    public void testReadAndWrite_normal() throws Exception {
        String input = "Hello\nWorld";
        InputStream inputStream = new ByteArrayInputStream(input.getBytes("UTF-8"));
        StringWriter stringWriter = new StringWriter();
        PrintWriter writer = new PrintWriter(stringWriter);

        sendService.readAndWrite(inputStream, writer);

        assertEquals("HelloWorld", stringWriter.toString());
    }

    @Test
    public void testReadAndWrite_emptyInput() throws Exception {
        InputStream inputStream = new ByteArrayInputStream("".getBytes("UTF-8"));
        StringWriter stringWriter = new StringWriter();
        PrintWriter writer = new PrintWriter(stringWriter);

        sendService.readAndWrite(inputStream, writer);

        assertEquals("", stringWriter.toString());
    }

    @Test
    public void testReadAndWrite_writeThrows() throws Exception {
        String input = "test";
        InputStream inputStream = new ByteArrayInputStream(input.getBytes("UTF-8"));
        PrintWriter mockWriter = mock(PrintWriter.class);

        doThrow(new RuntimeException("write error")).when(mockWriter).write(anyString());

        try {
            sendService.readAndWrite(inputStream, mockWriter);
            fail("应当抛出 RuntimeException");
        } catch (Exception e) {
            assertTrue(e instanceof RuntimeException);
            assertEquals("write error", e.getMessage());
        }
    }

    @Test
    public void testReadAndWrite_flushThrows() throws Exception {
        String input = "flush";
        InputStream inputStream = new ByteArrayInputStream(input.getBytes("UTF-8"));
        PrintWriter mockWriter = spy(new PrintWriter(new StringWriter()));

        doThrow(new RuntimeException("flush error")).when(mockWriter).flush();

        try {
            sendService.readAndWrite(inputStream, mockWriter);
            fail("应当抛出 RuntimeException");
        } catch (Exception e) {
            assertTrue(e instanceof RuntimeException);
            assertEquals("flush error", e.getMessage());
        }
    }

    @Test
    public void testReadAndWrite_readLineThrows() throws Exception {
        InputStream brokenStream = new InputStream() {
            @Override
            public int read() {
                throw new RuntimeException("broken input");
            }
        };
        PrintWriter writer = new PrintWriter(new StringWriter());

        try {
            sendService.readAndWrite(brokenStream, writer);
            fail("应当抛出 RuntimeException");
        } catch (Exception e) {
            assertTrue(e instanceof RuntimeException);
            assertEquals("broken input", e.getMessage());
        }
    }

    // === responseHandler 方法测试 ===

    @Test
    public void testResponseHandler_normal() throws Exception {
        HttpURLConnection mockConn = mock(HttpURLConnection.class);
        HttpServletResponse mockResp = mock(HttpServletResponse.class);

        String input = "A\nB";
        InputStream inputStream = new ByteArrayInputStream(input.getBytes("UTF-8"));
        when(mockConn.getInputStream()).thenReturn(inputStream);

        StringWriter out = new StringWriter();
        PrintWriter writer = new PrintWriter(out);
        when(mockResp.getWriter()).thenReturn(writer);

        sendService.responseHandler(mockConn, mockResp);

        assertEquals("AB", out.toString());
    }

    @Test
    public void testResponseHandler_inputStreamThrows() throws Exception {
        HttpURLConnection mockConn = mock(HttpURLConnection.class);
        HttpServletResponse mockResp = mock(HttpServletResponse.class);

        when(mockConn.getInputStream()).thenThrow(new IOException("stream fail"));

        try {
            sendService.responseHandler(mockConn, mockResp);
            fail("应当抛出 IOException");
        } catch (Exception e) {
            assertTrue(e instanceof IOException);
            assertEquals("stream fail", e.getMessage());
        }
    }

    @Test
    public void testResponseHandler_getWriterThrows() throws Exception {
        HttpURLConnection mockConn = mock(HttpURLConnection.class);
        HttpServletResponse mockResp = mock(HttpServletResponse.class);

        InputStream inputStream = new ByteArrayInputStream("data".getBytes("UTF-8"));
        when(mockConn.getInputStream()).thenReturn(inputStream);
        when(mockResp.getWriter()).thenThrow(new IOException("writer fail"));

        try {
            sendService.responseHandler(mockConn, mockResp);
            fail("应当抛出 IOException");
        } catch (Exception e) {
            assertTrue(e instanceof IOException);
            assertEquals("writer fail", e.getMessage());
        }
    }

    @Test
    public void testResponseHandler_inputStreamCloseThrows() throws Exception {
        HttpURLConnection mockConn = mock(HttpURLConnection.class);
        HttpServletResponse mockResp = mock(HttpServletResponse.class);

        InputStream mockInput = mock(InputStream.class);
        when(mockConn.getInputStream()).thenReturn(mockInput);
        PrintWriter writer = new PrintWriter(new StringWriter());
        when(mockResp.getWriter()).thenReturn(writer);
        doThrow(new IOException("close error")).when(mockInput).close();

        try {
            sendService.responseHandler(mockConn, mockResp);
            fail("应当抛出 IOException");
        } catch (Exception e) {
            assertTrue(e instanceof IOException);
            assertEquals("close error", e.getMessage());
        }
    }

    @Test
    public void testResponseHandler_writerCloseThrows() throws Exception {
        HttpURLConnection mockConn = mock(HttpURLConnection.class);
        HttpServletResponse mockResp = mock(HttpServletResponse.class);

        InputStream input = new ByteArrayInputStream("x".getBytes("UTF-8"));
        when(mockConn.getInputStream()).thenReturn(input);

        PrintWriter mockWriter = mock(PrintWriter.class);
        when(mockResp.getWriter()).thenReturn(mockWriter);
        doThrow(new IOException("writer close error")).when(mockWriter).close();

        try {
            sendService.responseHandler(mockConn, mockResp);
            fail("应当抛出 IOException");
        } catch (Exception e) {
            assertTrue(e instanceof IOException);
            assertEquals("writer close error", e.getMessage());
        }
    }
}