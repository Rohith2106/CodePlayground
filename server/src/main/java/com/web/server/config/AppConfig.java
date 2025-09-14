package com.web.server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    
    @Value("${app.base-dir:jobs}")
    private String baseDir;
    
    @Value("${app.exec-timeout:10000}")
    private long execTimeoutMs;
    
    @Value("${app.compile-timeout:10000}")
    private long compileTimeoutMs;
    
    @Value("${app.max-code-size:10000}")
    private int maxCodeSize;
    
    @Value("${app.max-inputs:20}")
    private int maxInputs;
    
    @Value("${app.secret-key}")
    private String secretKey;
    
    // Get executable extension based on OS
    public String getExecExt() {
        return System.getProperty("os.name").toLowerCase().contains("windows") ? ".exe" : "";
    }
    
    // Get Python command based on OS
    public String getPythonCmd() {
        return System.getProperty("os.name").toLowerCase().contains("windows") ? "python" : "python3";
    }
    
    // Getters
    public String getBaseDir() {
        return baseDir;
    }
    
    public long getExecTimeoutMs() {
        return execTimeoutMs;
    }
    
    public long getCompileTimeoutMs() {
        return compileTimeoutMs;
    }
    
    public int getMaxCodeSize() {
        return maxCodeSize;
    }
    
    public int getMaxInputs() {
        return maxInputs;
    }
    
    public String getSecretKey() {
        return secretKey;
    }
}
