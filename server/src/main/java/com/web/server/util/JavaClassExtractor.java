package com.web.server.util;

import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class JavaClassExtractor {
    
    private static final Pattern CLASS_PATTERN = Pattern.compile("(?m)public\\s+class\\s+(\\w+)");
    
    public String extractClassName(String code) {
        Matcher matcher = CLASS_PATTERN.matcher(code);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return "";
    }
}
