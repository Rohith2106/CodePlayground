package com.web.server.dto;

public class ResponseError {
    
    private String status;
    private String message;
    
    // Default constructor
    public ResponseError() {}
    
    // Constructor with parameters
    public ResponseError(String status, String message) {
        this.status = status;
        this.message = message;
    }
    
    // Getters and setters
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}
