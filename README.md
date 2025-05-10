# reXer - A Full-Stack Note-Taking Web Application

**reXer** is a full-stack web application that allows users to create, organize, and manage notes with features like tagging, color-coding, and pinning. Built with React for the frontend and Node.js for the backend, this app makes it easy to keep track of your thoughts, tasks, and ideas.
---

## Features

### Core Functionality
- **Create & Edit Notes**: Allows users to write rich text notes with titles and content.
- **Tag System**: Add multiple tags to categorize and organize your notes.
- **Color Coding**: Choose from 5 background colors for visual organization.
- **Pin Notes**: Keep important notes at the top for quick access.
- **Search**: Quickly find notes by title or content.
- **Responsive Design**: Works across mobile, tablet, and desktop devices.

---

## Tech Stack

### Frontend:
- **React**: For building the user interface.
- **React Router**: For navigation within the app.
- **Axios**: For making API requests to the backend.
- **Framer Motion**: For smooth animations.
- **React Icons**: For adding icons to the UI.
- **React Modal**: For pop-up dialog boxes.
- **Moment.js**: For date formatting and manipulation.

### Backend:
- **Node.js** with **Express.js**: For creating the backend server.
- **JWT**: For secure user authentication.
- **MongoDB**: For storing user data and notes.

---

## Installation

### Backend Installation

1. **Install dependencies**:
    ```bash
    npm install
    ```

2. **Create a `.env` file** in the root directory and add the following variables:
    ```env
    ACCESS_TOKEN_SECRET=your_jwt_secret_key_here
    CONNECTION_STRING=your_mongodb_url
    PORT=8000
    ```

3. **Start the backend server**:
    ```bash
    npm start
    ```

   Your backend server will now be running at `http://localhost:8000`.

### Frontend Installation

1. **Install dependencies**:
    ```bash
    npm install
    ```

2. **Create a `.env` file** inside the `src` directory and add:
    ```env
    VITE_BASE_URL=http://localhost:8000
    ```

3. **Start the frontend development server**:
    ```bash
    npm start
    ```

   Your frontend will now be available at `http://localhost:8000`.

---

## Usage

1. **User Authentication**:
   - Users can sign up or log in to the app.
   - JWT tokens are used for authentication and authorization.

2. **Creating & Managing Notes**:
   - After logging in, users can create new notes, edit existing notes, and delete notes.
   - Notes can be tagged, color-coded, and pinned for easier organization.

3. **Search Functionality**:
   - Users can quickly search for notes by title or content using the search bar.

4. **Responsive Design**:
   - The app is fully responsive and works on mobile, tablet, and desktop devices.

---
