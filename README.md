# DocuSense AI

DocuSense AI is a web application that allows users to upload documents (TXT or PDF) and interact with their content using generative AI. Users can get an automated summary, ask questions about the document, and test their comprehension with AI-generated challenges.

## Features

-   **Document Upload**: Supports `.txt` and `.pdf` file uploads.
-   **AI-Powered Summary**: Automatically generates a concise summary (≤150 words) of the uploaded document.
-   **Interactive Q&A**: An "Ask Anything" mode for free-form questions about the document's content, with conversational memory.
-   **Comprehension Challenges**: A "Challenge Me" mode that generates logic-based questions from the document and evaluates user answers.
-   **Contextual Referencing**: The AI provides references to the document to justify its answers and evaluations.

## Architecture Overview

The application is built with a modern web stack, leveraging server-side rendering and generative AI to create a seamless user experience.

### Tech Stack

-   **Frontend**: [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
-   **UI**: [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
-   **AI**: [Genkit](https://firebase.google.com/docs/genkit) (with Google's Gemini models)
-   **File Parsing**: [pdf-js-dist](https://www.npmjs.com/package/pdfjs-dist) for extracting text from PDF files.

### Reasoning & Data Flow

1.  **File Upload & Parsing**:
    -   The user uploads a document via the `UploadView` component (`src/components/docu-sense/upload-view.tsx`).
    -   The main page component (`src/app/page.tsx`) handles the file logic. It reads text files directly and uses `pdfjs-dist` to extract text from PDF files page by page.
    -   The extracted text content is stored in the component's state.

2.  **AI Interaction Core**:
    -   All AI logic is managed by **Genkit flows** located in `src/ai/flows/`. These flows define the prompts, expected input/output schemas (using Zod), and interaction with the Gemini LLM.
    -   **Server Actions** (`src/app/actions.ts`) act as a bridge, allowing frontend components to securely call these server-side Genkit flows without exposing API endpoints.

3.  **Core Features Flow**:
    -   **Summary Generation**:
        -   `DocumentInfo` component calls `generateSummaryAction`.
        -   This action invokes the `generateDocumentSummary` flow, which prompts the AI to create a summary of the document content.
    -   **Ask Anything (Q&A)**:
        -   `AskAnything` component sends the user's question and conversation history to the `askQuestionAction`.
        -   This action calls the `answerQuestionsFromContext` flow. The flow is designed to answer questions based on the provided document text and maintain context from previous turns.
    -   **Challenge Me (Quiz)**:
        -   **Question Generation**: The `ChallengeMe` component first calls `generateChallengeQuestionsAction`, which uses the `answerQuestionsFromContext` flow with a specific instruction to generate three comprehension questions.
        -   **Answer Evaluation**: When the user submits an answer, `evaluateAnswerAction` is called. This triggers the `evaluateAnswer` flow, which prompts the AI to assess if the user's answer is correct based on the document, providing feedback and a reference.

### Directory Structure

```
.
├── src
│   ├── ai
│   │   ├── flows/         # Genkit flows for AI logic
│   │   └── genkit.ts      # Genkit configuration
│   ├── app
│   │   ├── actions.ts     # Server Actions to connect frontend and AI
│   │   ├── globals.css    # Global styles and Tailwind directives
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Main application page
│   ├── components
│   │   ├── docu-sense/    # Application-specific components
│   │   └── ui/            # Reusable UI components (ShadCN)
│   └── lib
│       └── utils.ts       # Utility functions
└── tailwind.config.ts     # Tailwind CSS configuration
```

## Local Setup

Follow these steps to run the project on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/en) (v20 or later)
-   [npm](https://www.npmjs.com/) or a compatible package manager
-   A Google AI API Key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    -   Create a `.env` file in the root of the project.
    -   Add your Google AI API key to the `.env` file:
        ```
        GOOGLE_API_KEY=your_api_key_here
        ```

### Running the Application

This project requires two processes to be run concurrently: the Next.js frontend server and the Genkit development server.

1.  **Start the Genkit Dev Server**:
    Open a terminal and run:
    ```bash
    npm run genkit:dev
    ```
    This will start the Genkit development UI, typically on `http://localhost:4000`, where you can inspect and test your AI flows.

2.  **Start the Next.js Dev Server**:
    Open a second terminal and run:
    ```bash
    npm run dev
    ```
    This will start the Next.js application, typically on `http://localhost:9002`.

3.  **Open the app**:
    Navigate to `http://localhost:9002` in your browser to use DocuSense AI.
