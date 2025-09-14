package com.web.server.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public class RequestData {
    
    @NotBlank(message = "Code cannot be blank")
    @Size(max = 10000, message = "Code size cannot exceed 10000 characters")
    private String code;
    
    @NotBlank(message = "Language cannot be blank")
    private String language;
    
    @NotEmpty(message = "Inputs cannot be empty")
    @Size(max = 20, message = "Cannot have more than 20 inputs")
    private List<String> inputs;
    
    @NotBlank(message = "Key cannot be blank")
    private String key;
    
    // Default constructor
    public RequestData() {}
    
    // Constructor with parameters
    public RequestData(String code, String language, List<String> inputs, String key) {
        this.code = code;
        this.language = language;
        this.inputs = inputs;
        this.key = key;
    }
    
    // Getters and setters
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
    
    public String getLanguage() {
        return language;
    }
    
    public void setLanguage(String language) {
        this.language = language;
    }
    
    public List<String> getInputs() {
        return inputs;
    }
    
    public void setInputs(List<String> inputs) {
        this.inputs = inputs;
    }
    
    public String getKey() {
        return key;
    }
    
    public void setKey(String key) {
        this.key = key;
    }
}
