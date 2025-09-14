package com.web.server.controller;

import com.web.server.config.AppConfig;
import com.web.server.dto.RequestData;
import com.web.server.dto.ResponseError;
import com.web.server.dto.ResponseSuccess;
import com.web.server.service.CodeExecutionService;
import com.web.server.util.CodeValidator;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class CodeExecutionController {
    
    @Autowired
    private AppConfig config;
    
    @Autowired
    private CodeExecutionService codeExecutionService;
    
    @Autowired
    private CodeValidator codeValidator;
    
    private static final List<String> SUPPORTED_LANGUAGES = Arrays.asList(
        "Python", "C", "C++", "Java", "JavaScript", "Go"
    );
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Server is running");
    }
    
    @PostMapping("/")
    public ResponseEntity<?> executeCode(@Valid @RequestBody RequestData requestData) {
        try {
            System.out.println("Received request: " + requestData.getLanguage() + " with " + requestData.getInputs().size() + " inputs");
            
            // Validate secret key
            if (!config.getSecretKey().equals(requestData.getKey())) {
                System.out.println("Invalid secret key provided");
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ResponseError("error", "Invalid secret key"));
            }
            
            // Validate language support
            if (!SUPPORTED_LANGUAGES.contains(requestData.getLanguage())) {
                System.out.println("Unsupported language: " + requestData.getLanguage());
                return ResponseEntity.badRequest()
                    .body(new ResponseError("error", "Unsupported language"));
            }
            
            // Validate code for restricted imports
            String validationError = codeValidator.validateCode(requestData.getLanguage(), requestData.getCode());
            if (validationError != null) {
                System.out.println("Code validation failed: " + validationError);
                return ResponseEntity.ok()
                    .body(new ResponseSuccess("success", Arrays.asList(validationError)));
            }
            
            // Execute code
            System.out.println("Executing code for language: " + requestData.getLanguage());
            List<String> outputs = codeExecutionService.execute(
                requestData.getLanguage(), 
                requestData.getCode(), 
                requestData.getInputs()
            );
            
            System.out.println("Code execution completed successfully");
            return ResponseEntity.ok()
                .body(new ResponseSuccess("success", outputs));
                
        } catch (Exception e) {
            System.err.println("Error executing code: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseError("error", "Internal server error: " + e.getMessage()));
        }
    }
}
