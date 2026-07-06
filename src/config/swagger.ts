/**
 * OpenAPI 3 specification served through Swagger UI at `/api/docs`.
 *
 * Authentication uses HTTP-only cookies, so once you call `POST /auth/login`
 * from the "Try it out" panel the `accessToken` cookie is set automatically
 * and sent on subsequent same-origin requests.
 */
export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Production & Stock Management API",
    version: "1.0.0",
    description:
      "REST API for production and inventory management (Express 5 + TypeScript + TypeORM + PostgreSQL).",
    license: { name: "MIT", url: "https://opensource.org/licenses/MIT" },
  },
  servers: [{ url: "/api", description: "API base path" }],
  tags: [
    { name: "Auth", description: "Login, logout, token refresh and password change" },
    { name: "Users", description: "User management (admin only)" },
    { name: "Products", description: "Product catalog" },
    { name: "Stock Movements", description: "IN/OUT stock movements" },
    { name: "Stock Adjustments", description: "Absolute stock adjustments (admin only)" },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "accessToken",
        description: "JWT access token stored as an HTTP-only cookie (set by POST /auth/login).",
      },
    },
    schemas: {
      // ---- Generic envelopes ----
      ApiMessage: {
        type: "object",
        properties: { message: { type: "string" } },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "fail" },
          message: { type: "string", example: "Human-readable error message" },
        },
      },
      // ---- Resources ----
      User: {
        type: "object",
        properties: {
          uuid: { type: "string", format: "uuid" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          isAdmin: { type: "boolean" },
          isActive: { type: "boolean" },
        },
      },
      Product: {
        type: "object",
        properties: {
          uuid: { type: "string", format: "uuid" },
          name: { type: "string" },
          stock: { type: "integer" },
          isActive: { type: "boolean" },
        },
      },
      // ---- Request bodies ----
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "user@admind.com" },
          password: { type: "string", example: "your_admin_password" },
        },
      },
      ChangePasswordRequest: {
        type: "object",
        required: ["currentPassword", "newPassword", "repeatNewPassword"],
        properties: {
          currentPassword: { type: "string", minLength: 6 },
          newPassword: { type: "string", minLength: 6 },
          repeatNewPassword: { type: "string", minLength: 6 },
        },
      },
      CreateUserRequest: {
        type: "object",
        required: ["name", "email", "isAdmin", "password", "repeatPassword"],
        properties: {
          name: { type: "string", minLength: 3, maxLength: 30 },
          email: { type: "string", format: "email", maxLength: 35 },
          isAdmin: { type: "boolean" },
          password: { type: "string", minLength: 6 },
          repeatPassword: { type: "string", minLength: 6 },
        },
      },
      UpdateUserRequest: {
        type: "object",
        description: "All fields optional; only the provided ones are updated.",
        properties: {
          email: { type: "string", format: "email", description: "New email for the user" },
          name: { type: "string" },
          isAdmin: { type: "boolean" },
        },
      },
      CreateProductRequest: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 5, maxLength: 30 },
          stock: { type: "integer", minimum: 1 },
        },
      },
      UpdateProductRequest: {
        type: "object",
        required: ["name"],
        properties: { name: { type: "string", minLength: 5, maxLength: 30 } },
      },
      RegisterMovementRequest: {
        type: "object",
        required: ["quantity", "typeMovement"],
        properties: {
          quantity: { type: "integer", minimum: 1 },
          typeMovement: { type: "string", enum: ["IN", "OUT"] },
          note: { type: "string" },
        },
      },
      RegisterAdjustmentRequest: {
        type: "object",
        required: ["newStock"],
        properties: {
          newStock: { type: "integer", minimum: 0 },
          reason: { type: "string" },
          note: { type: "string" },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: "Missing or invalid authentication",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
      },
      Forbidden: {
        description: "Authenticated but not allowed (e.g. admin required)",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
      },
      NotFound: {
        description: "Resource not found",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
      },
      ValidationError: {
        description: "Invalid request body or parameters",
        content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
      },
    },
    parameters: {
      PageParam: { name: "page", in: "query", schema: { type: "integer", default: 1 } },
      LimitParam: { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
    },
  },
  paths: {
    // ===================== AUTH =====================
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in",
        description: "Validates credentials and sets `accessToken` and `refreshToken` HTTP-only cookies.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } },
        },
        responses: {
          200: { description: "Logged in; auth cookies set", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiMessage" } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          429: { description: "Too many login attempts" },
        },
      },
    },
    "/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Refresh tokens",
        description: "Issues new auth cookies from a valid `refreshToken` cookie.",
        responses: {
          200: { description: "Tokens refreshed", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiMessage" } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Log out",
        security: [{ cookieAuth: [] }],
        responses: {
          200: { description: "Logged out; cookies cleared", content: { "application/json": { schema: { $ref: "#/components/schemas/ApiMessage" } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/auth/change-password": {
      patch: {
        tags: ["Auth"],
        summary: "Change own password",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ChangePasswordRequest" } } },
        },
        responses: {
          200: { description: "Password changed; new auth cookies set" },
          400: { $ref: "#/components/responses/ValidationError" },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    // ===================== USERS =====================
    "/user": {
      get: {
        tags: ["Users"],
        summary: "List users",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "name", in: "query", schema: { type: "string" } },
          { name: "email", in: "query", schema: { type: "string" } },
          { name: "isAdmin", in: "query", schema: { type: "boolean" } },
          { name: "isActive", in: "query", schema: { type: "boolean" } },
          { name: "sortBy", in: "query", schema: { type: "string", enum: ["name", "email", "code"] } },
          { name: "order", in: "query", schema: { type: "string", enum: ["ASC", "DESC"] } },
          { $ref: "#/components/parameters/PageParam" },
          { $ref: "#/components/parameters/LimitParam" },
        ],
        responses: {
          200: { description: "Paginated list of users" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Create a user",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateUserRequest" } } },
        },
        responses: {
          201: { description: "User created", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          400: { $ref: "#/components/responses/ValidationError" },
          409: { description: "Email already in use" },
        },
      },
    },
    "/user/{uuid}": {
      get: {
        tags: ["Users"],
        summary: "Get a user by UUID",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "uuid", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          200: { description: "User found", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      patch: {
        tags: ["Users"],
        summary: "Update a user",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "uuid", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateUserRequest" } } },
        },
        responses: {
          200: { description: "User updated" },
          400: { $ref: "#/components/responses/ValidationError" },
          404: { $ref: "#/components/responses/NotFound" },
          409: { description: "Email already in use" },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Deactivate a user (soft delete)",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "uuid", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          200: { description: "User deactivated" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/user/{uuid}/reactivate": {
      patch: {
        tags: ["Users"],
        summary: "Reactivate a deactivated user",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "uuid", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          200: { description: "User reactivated" },
          404: { $ref: "#/components/responses/NotFound" },
          409: { description: "User is already active" },
        },
      },
    },
    // ===================== PRODUCTS =====================
    "/product": {
      get: {
        tags: ["Products"],
        summary: "List products",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "name", in: "query", schema: { type: "string" } },
          { name: "isActive", in: "query", schema: { type: "boolean" } },
          { name: "minStock", in: "query", schema: { type: "integer" } },
          { name: "maxStock", in: "query", schema: { type: "integer" } },
          { name: "createdBy", in: "query", schema: { type: "string" } },
          { name: "sortBy", in: "query", schema: { type: "string" } },
          { $ref: "#/components/parameters/PageParam" },
          { $ref: "#/components/parameters/LimitParam" },
        ],
        responses: {
          200: { description: "Paginated list of products" },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Create a product",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateProductRequest" } } },
        },
        responses: {
          201: { description: "Product created" },
          400: { $ref: "#/components/responses/ValidationError" },
          409: { description: "Product already exists" },
        },
      },
    },
    "/product/{uuid}": {
      get: {
        tags: ["Products"],
        summary: "Get a product by UUID",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "uuid", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          200: { description: "Product found", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } },
          400: { $ref: "#/components/responses/ValidationError" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
      patch: {
        tags: ["Products"],
        summary: "Update a product",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "uuid", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateProductRequest" } } },
        },
        responses: {
          200: { description: "Product updated", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } },
          400: { $ref: "#/components/responses/ValidationError" },
          404: { $ref: "#/components/responses/NotFound" },
          409: { description: "Product name already in use" },
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Soft-delete a product",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "uuid", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          200: { description: "Product deactivated" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    // ===================== STOCK MOVEMENTS =====================
    "/movements": {
      get: {
        tags: ["Stock Movements"],
        summary: "List stock movements",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "productUuid", in: "query", schema: { type: "string" } },
          { name: "userUuid", in: "query", schema: { type: "string" } },
          { name: "movementType", in: "query", schema: { type: "string", enum: ["IN", "OUT"] } },
          { name: "note", in: "query", schema: { type: "string" } },
          { name: "startDate", in: "query", schema: { type: "string", format: "date" } },
          { name: "endDate", in: "query", schema: { type: "string", format: "date" } },
          { name: "minQuantity", in: "query", schema: { type: "integer" } },
          { name: "maxQuantity", in: "query", schema: { type: "integer" } },
          { $ref: "#/components/parameters/PageParam" },
          { $ref: "#/components/parameters/LimitParam" },
        ],
        responses: {
          200: { description: "Paginated list of movements" },
          401: { $ref: "#/components/responses/Unauthorized" },
        },
      },
    },
    "/movements/{productUuid}": {
      post: {
        tags: ["Stock Movements"],
        summary: "Register an IN/OUT movement",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "productUuid", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterMovementRequest" } } },
        },
        responses: {
          201: { description: "Movement registered" },
          400: { $ref: "#/components/responses/ValidationError" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    // ===================== STOCK ADJUSTMENTS =====================
    "/adjustment": {
      get: {
        tags: ["Stock Adjustments"],
        summary: "List stock adjustments",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "productUuid", in: "query", schema: { type: "string" } },
          { name: "adjustedByUuid", in: "query", schema: { type: "string" } },
          { name: "difference", in: "query", schema: { type: "integer" } },
          { name: "expectedStock", in: "query", schema: { type: "integer" } },
          { name: "note", in: "query", schema: { type: "string" } },
          { name: "startDate", in: "query", schema: { type: "string", format: "date" } },
          { name: "endDate", in: "query", schema: { type: "string", format: "date" } },
          { name: "minQuantity", in: "query", schema: { type: "integer" } },
          { name: "maxQuantity", in: "query", schema: { type: "integer" } },
          { $ref: "#/components/parameters/PageParam" },
          { $ref: "#/components/parameters/LimitParam" },
        ],
        responses: {
          200: { description: "Paginated list of adjustments" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
        },
      },
    },
    "/adjustment/{adjustmentUuid}": {
      get: {
        tags: ["Stock Adjustments"],
        summary: "Get an adjustment by UUID",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "adjustmentUuid", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          200: { description: "Adjustment found" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/adjustment/{productUuid}": {
      post: {
        tags: ["Stock Adjustments"],
        summary: "Register a stock adjustment (set absolute stock)",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "productUuid", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterAdjustmentRequest" } } },
        },
        responses: {
          201: { description: "Adjustment registered" },
          400: { $ref: "#/components/responses/ValidationError" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
        },
      },
    },
  },
} as const;
