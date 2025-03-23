// Netlify function to handle API routes
const { createRequestHandler } = require("@netlify/next");

// Create a Next.js request handler
const handler = createRequestHandler({
  // The build output directory
  dir: ".next",
});

// Export the handler for Netlify Functions
exports.handler = async (event, context) => {
  // For health checks
  if (event.httpMethod === "HEAD") {
    return {
      statusCode: 200,
      body: "",
    };
  }

  return handler(event, context);
}; 