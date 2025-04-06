package com.macro.mall.tiny.service.impl;

import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.HttpURLConnection;
import java.nio.charset.StandardCharsets;

@Service
public class SendBAKService {

    public void responseHandler(HttpURLConnection connection, HttpServletResponse response) throws IOException {
        InputStream inputStream = null;
        PrintWriter writer = null;
        try {
            inputStream = connection.getInputStream();
            writer = response.getWriter();
            readAndWrite(inputStream, writer);
            writer.flush();
        } catch (IOException e) {
            // 明确记录或抛出异常以满足 CI 要求
            throw new IOException("发送响应数据失败", e);
        } finally {
            closeQuietly(inputStream);
            if (writer != null) {
                writer.close(); // PrintWriter.close() 不会抛异常
            }
        }
    }

    public void readAndWrite(InputStream inputStream, Writer writer) throws IOException {
        BufferedReader bufferedReader = null;
        BufferedWriter bufferedWriter = null;
        try {
            bufferedReader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
            bufferedWriter = new BufferedWriter(writer);
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                bufferedWriter.write(line);
            }
            bufferedWriter.flush();
        } catch (IOException e) {
            throw new IOException("读取/写入失败", e);
        } finally {
            closeQuietly(bufferedReader);
            closeQuietly(bufferedWriter);
        }
    }

    private void closeQuietly(Closeable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException ignored) {
                // 忽略关闭异常
            }
        }
    }
}