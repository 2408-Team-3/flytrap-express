# Flytrap Express SDK

## Getting Started
To start using Flytrap in your project:

- Go to the Flytrap website.
- Click on New Project.
- You’ll be provided with a Project ID, API Key, and Endpoint specific to your project.
- These values are essential for configuring the SDK.

## Installation
In your project directory, install the Flytrap SDK via npm:

```bash
npm install flytrap_express
```

## Usage
1. Import and Initialize the Flytrap SDK
In your main application file (e.g., app.js or index.js), import the Flytrap SDK and initialize it with your Project ID, API Key, and Endpoint.

```javascript
import Flytrap from 'flytrap_express';

// Initialize Flytrap with your project credentials
const flytrap = new Flytrap({
  projectId: 'YOUR_PROJECT_ID',
  apiEndpoint: 'YOUR_ENDPOINT',
  apiKey: 'YOUR_API_KEY',
});
```

2. Set Up Express Middleware
Use the Flytrap middleware in your Express app to capture unhandled errors automatically:

```javascript
import express from 'express';
const app = express();

// Set up the Flytrap error handling middleware
flytrap.setUpExpressErrorHandler(app);
```

This middleware will intercept any unhandled errors in your Express routes and log them to Flytrap.

Optional: Disabling Automatic Promise Rejection Wrapping
By default, the Flytrap middleware will automatically wrap your asynchronous route handlers, ensuring that any unhandled promise rejections are captured and logged. However, if you prefer not to have your promise rejections automatically passed to the Express middleware, you can disable this behavior by passing false as an option:

```javascript
flytrap.setUpExpressErrorHandler(app, false);
```

3. Manually Capture Exceptions
For capturing specific exceptions in your code, you can use the captureException method provided by Flytrap:

```javascript
try {
  // Your code here
} catch (error) {
  flytrap.captureException(error);
}
```

This method allows you to manually send errors to Flytrap, even if they’re caught outside of the Express middleware.
