# 🧠 Code Runner Web App

A Full-stack code runner web application that allows users to write, execute, and test code in multiple languages through a modern frontend and a Spring Boot-based backend API.

## 🚀 Features

* 🧑‍💻 Code editor with support for multiple languages (Python, C++, C, Go, Java, Javascript)
* 📡 Backend API to compile/run code in a sandboxed environment (written in Spring Boot)
* 🎨 Theme options and responsive design
* 📄 Save your code as a file or load code to the editor from a file
---

## 💪 Getting Started

### 🔧 Prerequisites

* [Java 17+](https://www.oracle.com/java/technologies/downloads/)
* [Maven](https://maven.apache.org/download.cgi)
* [Node.js](https://nodejs.org/en/download/)

---

## 🏃‍♂️ Running the App Locally

### Backend (Spring Boot)

1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Build the project using Maven:
    ```bash
    mvn clean install
    ./mvnw clean compile
    ```
3.  Run the application:
    ```bash
    ./mvn spring-boot:run
    ```
    > The backend will be running on `http://localhost:8080`.

### Frontend (React)

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    > The frontend will be running on `http://localhost:3000`.

---

## ⚙️ Environment Variables

### `frontend/.env`

Make sure the `VITE_API_URL` in the `frontend/.env` file points to your backend server.

```env
VITE_API_URL=http://localhost:5000
```

---

## 👥 Contributing

Contributions are welcome! Follow these steps:

1.  **Fork** this repository
2.  Create a new branch:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3.  Make your changes
4.  Commit and push:
    ```bash
    git commit -m "Add your feature"
    git push origin feature/your-feature-name
    ```
5.  Open a **Pull Request**
