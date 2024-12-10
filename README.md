![Organization Logo](https://raw.githubusercontent.com/getflytrap/.github/main/profile/flytrap_logo.png)

# Flytrap Express SDK

The Flytrap Express SDK is a lightweight tool designed for Express applications. It enables seamless error monitoring and reporting to the Flytrap system, capturing both global and manually handled errors with minimal setup.

This guide will walk you through setting up the Flytrap Express SDK in your project and exploring its features. If you want to use Flytrap in a production environment, refer to the [Flytrap Installation Guide](https://github.com/getflytrap/flytrap_terraform) for complete setup instructions.

To learn more about Flytrap, check out our [case study](https://getflytrap.github.io/).

## 🚀 Getting Started

To start using Flytrap in your project:

1. Visit the Flytrap Dashboard and log in.
2. Click on **New Project** to create a project.
3. You’ll be provided with a **Project ID**, **API Key**, and **API Endpoint** specific to your project. These values are essential for configuring the SDK.

## 📦 Installation

Install the Flytrap Express SDK via npm:

```bash
npm install flytrap_express
```

For more details about the package, visit the [Flytrap Express SDK on npm](https://www.npmjs.com/package/flytrap_express).

## 🛠️ Usage

1. **Initialize Flytrap**: In your main application file (e.g., app.js or index.js), import the Flytrap module and initialize it with your project credentials:

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
    });
    ```
2. **Automatically Capture Global Errors:** The Flytrap SDK automatically sets up global error and unhandled promise rejection handlers. These handlers ensure any uncaught exceptions or rejections are captured and logged.

3. **Set Up Express Middleware:** Add the Flytrap middleware to your Express app to automatically capture unhandled errors:

    ```javascript
    const express = require("express");
    const app = express();

    // Set up the Flytrap error handling middleware
    // Add this after all routes,
    // but before any other error-handling middlewares defined
    flytrap.setUpExpressErrorHandler(app);
    ```

    This middleware intercepts any unhandled errors in your Express routes and logs them to Flytrap, along with request metadata (e.g., HTTP method and path).

    **Optional:** By default, the Flytrap middleware will automatically wrap your asynchronous route handlers. This ensures any unhandled promise rejections are captured and logged. To disable this behavior, pass `{ wrapAsync: false }` as an argument:

    ```javascript
    flytrap.setUpExpressErrorHandler(app, { wrapAsync: false });
    ```

    When `wrapAsync` is set to `true` (default), Flytrap will wrap asynchronous route handlers to ensure that unhandled promise rejections are properly captured. If you disable this feature, you’ll need to handle promise rejections manually by ensuring all async route handlers are properly wrapped with `try/catch` or `.catch()` logic.

3. **Manually Capture Exceptions:** For specific exceptions that you want to capture (e.g., inside a `try/catch` block), use the `captureException` method:

    ```javascript
    try {
      // Your code here
      throw new Error("Something went wrong!");
    } catch (error) {
      flytrap.captureException(error, req); // Optionally pass the `req` object for additional context
    }
    ```

## 🛠️ Example App Setup

Here’s a complete example using Flytrap in an Express application:

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

## 🖥️ Local End-to-End Testing with Flytrap Architecture

For full **local** integration with the Flytrap architecture:

1. **Install the Flytrap API:** Follow the [Flytrap API Repository setup guide](https://github.com/getflytrap/flytrap_api).
2. **Install the Flytrap Processor:** Refer to the [Flytrap Processor Repository](https://github.com/getflytrap/flytrap_processor) for instructions.
3. **View Errors in the Dashboard:** Set up the [Flytrap Dashboard](https://github.com/getflytrap/flytrap_ui) to view and manage reported errors.
4. **Integrate the Flytrap SDK in your project.**

### Testing the Complete Setup
1. Trigger errors or promise rejections in your application integrated with a Flytrap SDK.
2. Confirm that errors are logged by checking:
  - Flytrap Processor Logs: Ensure errors are processed correctly.
  - Flytrap Dashboard: View processed errors, including stack traces and context.

## 🚀 Production Setup
If you’re looking for detailed instructions to deploy Flytrap in a production environment, refer to:

- [Flytrap Installation Guide](https://github.com/getflytrap/flytrap_terraform)
- [How-To-Use Page](https://getflytrap.github.io/)

For questions or issues, feel free to open an issue in this repository or contact the Flytrap team. 🚀

---

<div align="center">
  🪰🪤🪲🌱🚦🛠️🪴
</div>