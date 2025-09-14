// src/constants/languages.js
export const languageOptions = [
  { 
    value: "python", 
    label: "Python", 
    mode: "python", 
    apiValue: "Python",
    boilerplate: `# Python Code
print("Hello World")`
  },
  { 
    value: "c", 
    label: "C", 
    mode: "c_cpp", 
    apiValue: "C",
    boilerplate: `#include <stdio.h>

int main() {
    printf("Hello World\\n");
    return 0;
}`
  },
  { 
    value: "cpp", 
    label: "C++", 
    mode: "c_cpp", 
    apiValue: "C++",
    boilerplate: `#include <iostream>

int main() {
    std::cout << "Hello World" << std::endl;
    return 0;
}`
  },
  { 
    value: "go", 
    label: "Go", 
    mode: "golang", 
    apiValue: "Go",
    boilerplate: `package main

import "fmt"

func main() {
    fmt.Println("Hello World")
}`
  },
  { 
    value: "java", 
    label: "Java", 
    mode: "java", 
    apiValue: "Java",
    boilerplate: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}`
  },
  { 
    value: "javascript", 
    label: "JavaScript", 
    mode: "javascript", 
    apiValue: "JavaScript",
    boilerplate: `// JavaScript Code
console.log("Hello World");`
  },
];