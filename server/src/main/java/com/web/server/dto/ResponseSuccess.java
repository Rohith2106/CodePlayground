package com.web.server.dto;

import java.util.List;

public class ResponseSuccess {
    
    private String status;
    private List<String> outputs;
    
    // Default constructor
    public ResponseSuccess() {}
    
    // Constructor with parameters
    public ResponseSuccess(String status, List<String> outputs) {
        this.status = status;
        this.outputs = outputs;
    }
    
    // Getters and setters
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public List<String> getOutputs() {
        return outputs;
    }
    
    public void setOutputs(List<String> outputs) {
        this.outputs = outputs;
    }
}
