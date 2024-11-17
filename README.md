# Flytrap Express SDK

## Getting Started

To start using Flytrap in your project:

1. Go to the Flytrap website.
2. Click on New Project.
3. You’ll be provided with a Project ID, API Key, and Endpoint specific to your project.
4. These values are essential for configuring the SDK.

## Installation

In your project directory, install the Flytrap SDK via npm:

```bash
npm install flytrap_express
```

## Usage

1. Import and Initialize the Flytrap SDK
   In your main application file (e.g., app.js or index.js), import the Flytrap module and initialize it with your Project ID, API Key, and Endpoint:

```javascript
// CommonJS
const flytrap = require("flytrap_express");

// ES6 Modules
import flytrap from "flytrap_express";

// Initialize Flytrap with your project credentials
flytrap.init({
  projectId: "YOUR_PROJECT_ID",
  apiEndpoint: "YOUR_ENDPOINT",
  apiKey: "YOUR_API_KEY",
  includeContext: true, // Optional: Enable source code context logging (default is true)
});
```

About includeContext:

When includeContext is set to true, Flytrap will attempt to capture snippets of your source code around the location of errors (e.g., the file, line number, and surrounding lines).
This feature can provide more meaningful debugging information but may require source files to be available at runtime.
Default: true.

2. Set Up Express Middleware
   Use the Flytrap middleware in your Express app to automatically capture unhandled errors:

```javascript
const express = require("express");
const app = express();

// Set up the Flytrap error handling middleware
flytrap.setUpExpressErrorHandler(app);
```

This middleware will intercept any unhandled errors in your Express routes and log them to Flytrap.

Optional: Disable Automatic Promise Rejection Wrapping
By default, the Flytrap middleware will automatically wrap your asynchronous route handlers. This ensures any unhandled promise rejections are captured and logged. If you prefer not to have this behavior, pass `{ wrapAsync: false }` as an argument:

```javascript
flytrap.setUpExpressErrorHandler(app, { wrapAsync: false });
```

About wrapAsync:

When wrapAsync is set to true (default), Flytrap will wrap asynchronous route handlers to ensure that unhandled promise rejections are properly captured.
If you disable this feature (wrapAsync: false), you’ll need to handle promise rejections manually by ensuring all async route handlers are properly wrapped with try-catch or .catch() logic.

3. Manually Capture Exceptions
   For specific exceptions that you want to capture outside of middleware, or inside a try/catch block, use the captureException method:

```javascript
try {
  // Your code here
  throw new Error("Something went wrong!");
} catch (error) {
  flytrap.captureException(error, req); // Optionally pass the `req` object for additional context
}
```

This method allows you to manually send errors to Flytrap, even if they’re caught outside of the Express middleware.

### Example App Setup

Here’s a complete example of using Flytrap in an Express application:

```javascript
const express = require("express");
const flytrap = require("flytrap_express");

const app = express();
const port = 3000;

// Initialize Flytrap
flytrap.init({
  projectId: "YOUR_PROJECT_ID",
  apiEndpoint: "YOUR_ENDPOINT",
  apiKey: "YOUR_API_KEY",
});

// Middleware to parse JSON requests
app.use(express.json());

// Sample route with an unhandled error
app.get("/error", (req, res) => {
  throw new Error("Unhandled error in route");
});

// Sample route with a handled error
app.get("/handled-error", (req, res, next) => {
  try {
    throw new Error("Handled error in route");
  } catch (error) {
    flytrap.captureException(error, req); // Log the error
    next(error); // Pass to error-handling middleware
  }
});

// Set up Flytrap middleware
flytrap.setUpExpressErrorHandler(app);

// Start the server
app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
```
