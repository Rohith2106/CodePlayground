package com.web.server.util;

import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

@Component
public class CodeValidator {
    
    public String validateCode(String language, String code) {
        List<String> restrictedImports = getRestrictedImports(language);
        
        for (String restrictedImport : restrictedImports) {
            Pattern pattern = Pattern.compile("(?m)" + Pattern.quote(restrictedImport));
            if (pattern.matcher(code).find()) {
                return "import of '" + restrictedImport + "' is not allowed";
            }
        }
        
        return null; // No validation errors
    }
    
    private List<String> getRestrictedImports(String language) {
        return switch (language) {
            case "Python" -> Arrays.asList(
                "os", "sys", "subprocess", "socket", "shutil", "ctypes", 
                "multiprocessing", "threading"
            );
            case "JavaScript" -> Arrays.asList(
                "fs", "child_process", "os", "net", "http", "https", 
                "dgram", "dns", "tls", "repl", "vm", "worker_threads"
            );
            case "Go" -> Arrays.asList(
                "os", "os/exec", "syscall", "net", "net/http", "unsafe"
            );
            case "Java" -> Arrays.asList(
                "java.io", "java.net", "java.lang.reflect", "java.lang.Runtime", 
                "java.lang.System", "java.lang.ProcessBuilder", "java.lang.Thread"
            );
            case "C", "C++" -> Arrays.asList(
                "<sys/types.h>", "<sys/socket.h>", "<netdb.h>", "<arpa/inet.h>", 
                "<netinet/in.h>", "<unistd.h>", "<process.h>", "<windows.h>", 
                "<winsock2.h>", "<ws2tcpip.h>", "<pthread.h>", "<signal.h>",
                "<fcntl.h>", "<sys/stat.h>", "<sys/wait.h>", "<sys/mman.h>"
            );
            default -> Arrays.asList();
        };
    }
}
