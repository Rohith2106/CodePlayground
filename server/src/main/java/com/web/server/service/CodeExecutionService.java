package com.web.server.service;

import com.web.server.config.AppConfig;
import com.web.server.util.JavaClassExtractor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.*;

@Service
public class CodeExecutionService {
    
    @Autowired
    private AppConfig config;
    
    @Autowired
    private JavaClassExtractor javaClassExtractor;
    
    public List<String> execute(String language, String code, List<String> inputs) throws Exception {
        String jobId = UUID.randomUUID().toString();
        Path jobDir = Paths.get(config.getBaseDir(), jobId);
        
        try {
            // Create job directory
            Files.createDirectories(jobDir);
            
            // Prepare file and compilation
            String filePath = prepareFile(language, code, jobDir);
            String compileMessage = compileCode(language, filePath, jobDir);
            
            // If compilation failed, return the error message
            if (!compileMessage.isEmpty() && !compileMessage.equals("")) {
                return Arrays.asList(compileMessage);
            }
            
            // Execute code with inputs
            return executeWithInputs(language, filePath, inputs, jobDir, compileMessage);
            
        } finally {
            // Cleanup
            cleanup(jobDir);
        }
    }
    
    private String prepareFile(String language, String code, Path jobDir) throws IOException {
        String fileName = getFileName(language, code);
        Path filePath = jobDir.resolve(fileName);
        Files.write(filePath, code.getBytes());
        return filePath.toString();
    }
    
    private String getFileName(String language, String code) {
        return switch (language) {
            case "Python" -> "program.py";
            case "C" -> "program.c";
            case "C++" -> "program.cpp";
            case "Java" -> {
                String className = javaClassExtractor.extractClassName(code);
                if (className.isEmpty()) {
                    throw new IllegalArgumentException("Could not extract Java class name");
                }
                yield className + ".java";
            }
            case "JavaScript" -> "program.js";
            case "Go" -> "program.go";
            default -> throw new IllegalArgumentException("Unsupported language: " + language);
        };
    }
    
    private String compileCode(String language, String filePath, Path jobDir) throws Exception {
        List<String> compileArgs = getCompileArgs(language, filePath, jobDir);
        
        if (compileArgs.isEmpty()) {
            return ""; // No compilation needed
        }
        
        ProcessBuilder pb = new ProcessBuilder(compileArgs);
        pb.directory(jobDir.toFile());
        
        Process process = pb.start();
        
        // Read output and error streams
        StringBuilder output = new StringBuilder();
        StringBuilder error = new StringBuilder();
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
             BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
            
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            while ((line = errorReader.readLine()) != null) {
                error.append(line).append("\n");
            }
        }
        
        // Wait for compilation to complete with timeout
        boolean finished = process.waitFor(config.getCompileTimeoutMs(), TimeUnit.MILLISECONDS);
        
        if (!finished) {
            process.destroyForcibly();
            throw new RuntimeException("Compilation timed out");
        }
        
        String compileOutput = output.toString().trim();
        String compileError = error.toString().trim();
        
        if (process.exitValue() != 0) {
            String errorMessage = compileError.isEmpty() ? compileOutput : compileError;
            if (errorMessage.isEmpty()) {
                errorMessage = "Compilation failed with exit code: " + process.exitValue();
            }
            return errorMessage;
        }
        
        // Check if executable was actually created for compiled languages
        if (language.equals("C") || language.equals("C++") || language.equals("Go")) {
            String fileName = Paths.get(filePath).getFileName().toString();
            String baseName = fileName.substring(0, fileName.lastIndexOf('.'));
            String executableName = baseName + config.getExecExt();
            Path executablePath = jobDir.resolve(executableName);
            
            if (!Files.exists(executablePath)) {
                return "Compilation failed: executable not created. " + compileOutput;
            }
        }
        
        return compileOutput;
    }
    
    private List<String> getCompileArgs(String language, String filePath, Path jobDir) {
        String fileName = Paths.get(filePath).getFileName().toString();
        String baseName = fileName.substring(0, fileName.lastIndexOf('.'));
        
        return switch (language) {
            case "C" -> List.of("gcc", "-Wall", fileName, "-o", baseName + config.getExecExt());
            case "C++" -> List.of("g++", "-Wall", fileName, "-o", baseName + config.getExecExt());
            case "Java" -> List.of("javac", fileName);
            case "Go" -> List.of("go", "build", "-o", baseName + config.getExecExt(), fileName);
            default -> List.of(); // No compilation needed
        };
    }
    
    private List<String> executeWithInputs(String language, String filePath, List<String> inputs, Path jobDir, String compileMessage) throws Exception {
        List<String> outputs = new ArrayList<>();
        ExecutorService executor = Executors.newFixedThreadPool(inputs.size());
        
        try {
            List<Future<String>> futures = new ArrayList<>();
            
            for (String input : inputs) {
                Future<String> future = executor.submit(() -> executeSingleInput(language, filePath, input, jobDir));
                futures.add(future);
            }
            
            for (Future<String> future : futures) {
                try {
                    String result = future.get(config.getExecTimeoutMs(), TimeUnit.MILLISECONDS);
                    outputs.add(result.trim());
                } catch (TimeoutException e) {
                    outputs.add("Error: Code execution timed out");
                } catch (Exception e) {
                    outputs.add("Error: " + e.getMessage());
                }
            }
            
        } finally {
            executor.shutdown();
        }
        
        return outputs;
    }
    
    private String executeSingleInput(String language, String filePath, String input, Path jobDir) throws Exception {
        List<String> execArgs = getExecArgs(language, filePath, jobDir);
        
        ProcessBuilder pb = new ProcessBuilder(execArgs);
        pb.directory(jobDir.toFile());
        
        Process process = pb.start();
        
        // Write input to process
        if (input != null && !input.isEmpty()) {
            try (OutputStreamWriter writer = new OutputStreamWriter(process.getOutputStream())) {
                writer.write(input);
                writer.flush();
            }
        }
        
        // Read output and error streams
        StringBuilder output = new StringBuilder();
        StringBuilder error = new StringBuilder();
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
             BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
            
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            while ((line = errorReader.readLine()) != null) {
                error.append(line).append("\n");
            }
        }
        
        // Wait for execution to complete
        int exitValue = process.waitFor();
        
        String result = output.toString();
        String errorOutput = error.toString();
        
        if (exitValue != 0) {
            if (!errorOutput.isEmpty()) {
                result = errorOutput + "\n" + "Exit code: " + exitValue;
            } else {
                result = "Exit code: " + exitValue;
            }
        }
        
        return result.trim();
    }
    
    private List<String> getExecArgs(String language, String filePath, Path jobDir) {
        String fileName = Paths.get(filePath).getFileName().toString();
        String baseName = fileName.substring(0, fileName.lastIndexOf('.'));
        
        return switch (language) {
            case "Python" -> List.of(config.getPythonCmd(), fileName);
            case "C", "C++", "Go" -> {
                String executableName = baseName + config.getExecExt();
                // Use full path for Windows, relative path for Unix-like systems
                if (System.getProperty("os.name").toLowerCase().contains("windows")) {
                    yield List.of(jobDir.resolve(executableName).toString());
                } else {
                    yield List.of("./" + executableName);
                }
            }
            case "Java" -> List.of("java", "-cp", ".", baseName);
            case "JavaScript" -> List.of("node", fileName);
            default -> throw new IllegalArgumentException("Unsupported language: " + language);
        };
    }
    
    private void cleanup(Path jobDir) {
        try {
            Files.walk(jobDir)
                .sorted((a, b) -> b.compareTo(a)) // Delete files before directories
                .forEach(path -> {
                    try {
                        Files.deleteIfExists(path);
                    } catch (IOException e) {
                        // Log error but don't throw
                        System.err.println("Failed to delete: " + path + " - " + e.getMessage());
                    }
                });
        } catch (IOException e) {
            System.err.println("Failed to cleanup directory: " + jobDir + " - " + e.getMessage());
        }
    }
}
