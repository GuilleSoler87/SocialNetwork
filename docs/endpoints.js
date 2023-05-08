module.exports = {
  paths: {
    //ENDPOINTS SPACE FOR USERS
    "/users/register": {
      post: {
        tags: {
          Users: "-Register a user",
        },
        description: "Register a user",
        operationId: "register",
        parameters: [],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/UserInput",
              },
            },
          },
        },
        responses: {
          201: {
            description: "User registered successfully",
          },
          400: {
            description: "Invalid data provided or email already exists",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },

    "/users/login": {
      post: {
        tags: {
          Users: "-Login a user",
        },
        description: "Login a user",
        operationId: "login",
        parameters: [],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UserLogin",
              },
            },
          },
        },
        responses: {
          401: {
            description: "It is necessary to confirm your email",
          },
          400: {
            description: "Invalid email or password",
          },
          200: {
            description: "Welcome + user.username",
          },
        },
      },
    },

    "/users/logout": {
      delete: {
        security: [
            {
              ApiKeyAuth: [],
            },
          ],
        tags: {
          Users: "-Logout a user",
        },
        description: "Logout a user",
        operationId: "logout",
        parameters: [],

        responses: {
          200: {
            description: "User logged out successfully",
          },
          401: {
            description: "User not authenticated",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },

    "/users/update/{_id}": {
      put: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Users: "-Update a user",
        },
        description: "Update a user",
        operationId: "update",
        parameters: [
          {
            name: "_id",
            in: "path",
            schema: {
              $ref: "#/components/schemas/_id",
            },
          },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/UserInput",
              },
            },
          },
        },
        responses: {
          404: {
            description: "User not found",
          },
          201: {
            description: "User updated successfully",
          },
          500: {
            description: "There was a problem",
          },
        },
      },
    },

    "/users/getUser": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Users: "-Get User Connected",
        },
        description: "Get User Connected",
        operationId: "getUser",
        parameters: [],
        responses: {
          404: {
            description: "User not found",
          },
          500: {
            description: "There was a problem finding the users",
          },
        },
      },
    },

    "/users/getById/{_id}": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Users: "-Get User By Id",
        },
        description: "Get User By Id",
        operationId: "getById",
        parameters: [
          {
            name: "_id",
            in: "path",
            schema: {
              $ref: "#/components/schemas/_id",
            },
          },
        ],
        responses: {
          404: {
            description: "User not found",
          },
          500: {
            description: "There was a problem finding the user",
          },
        },
      },
    },

    "/users/getByUsername/{username}": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Users: "-Get User By Username",
        },
        description: "Get User By Username",
        operationId: "getByUsername",
        parameters: [
          {
            name: "username",
            in: "path",
            schema: {
              $ref: "#/components/schemas/username",
            },
          },
        ],
        responses: {
          404: {
            description: "User not found",
          },
          500: {
            description: "There was a problem finding the user",
          },
        },
      },
    },

    "/users/getUserFollowers": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Users: "-Get User Followers",
        },
        description: "Get User Followers",
        operationId: "getUserFollowers",
        parameters: [],
        responses: {
          404: {
            description: "Current user not found",
          },
          500: {
            description: "There was a problem finding the users",
          },
        },
      },
    },

    "/users/getUserFollowersInfo": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Users: "-Get User Followers Info",
        },
        description: "Get User Followers Info",
        operationId: "getUserFollowersInfo",
        parameters: [],
        responses: {
          404: {
            description: "Current user not found",
          },
          500: {
            description: "There was a problem finding the users",
          },
        },
      },
    },

    "/users/recoverPassowrd/{email}": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Users: "-Rocovery password",
        },
        description: "Recovery password",
        operationId: "recoverPassowrd",
        parameters: [
          {
            name: "email",
            in: "path",
            schema: {
              $ref: "#/components/schemas/email",
            },
          },
        ],
        responses: {
          401: {
            description: "It is necessary to confirm your password",
          },
          404: {
            description: "Email not found",
          },
          500: {
            description: "There was a problem finding the user",
          },
        },
      },
    },

    "/users/resetPassword/{recoverToken}": {
      put: {
        tags: {
          Users: "-Reset a user password",
        },
        description: "Reset a user password",
        operationId: "resetPassword",
        parameters: [
          {
            name: "recoverToken",
            in: "path",
            description: "Token sent to user's email to reset password",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResetPassword",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password changed successfully",
          },
          400: {
            description: "Invalid token or invalid password provided",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },

    "/users/follow/{_id}": {
      put: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Posts: "-To follow an user",
        },
        description: "To follow an user",
        operationId: "follow",
        parameters: [
          {
            name: "_id",
            in: "path",
            schema: {
              $ref: "#/components/schemas/_id",
            },
          },
        ],
        responses: {
          400: {
            description: "You already follow this user",
          },
          500: {
            description: "There was a problem with your follow",
          },
        },
      },
    },

    "/users/unfollow/{_id}": {
      put: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Posts: "-To unfollow an user",
        },
        description: "To unfollow an user",
        operationId: "unfollow",
        parameters: [
          {
            name: "_id",
            in: "path",
            schema: {
              $ref: "#/components/schemas/_id",
            },
          },
        ],
        responses: {
          400: {
            description: "You haven't follow this post yet",
          },
          500: {
            description: "There was a problem with your unfollow",
          },
        },
      },
    },

    //ENDPOINTS SPACE FOR POSTS
    "/posts/create": {
      post: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Posts: "-Create a post",
        },
        description: "Create a post",
        operationId: "create",
        parameters: [],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/PostInput",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Post created successfully",
          },
          500: {
            description: "There was a problem",
          },
        },
      },
    },

    "/posts/update/{_id}": {
      put: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Posts: "-Update a post",
        },
        description: "Update a post",
        operationId: "update",
        parameters: [
          {
            name: "_id",
            in: "path",
            schema: {
              $ref: "#/components/schemas/_id",
            },
          },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/PostInput",
              },
            },
          },
        },
        responses: {
          404: {
            description: "Post not found",
          },
          201: {
            description: "Post updated successfully",
          },
          500: {
            description: "There was a problem",
          },
        },
      },
    },

    "/posts/delete/{_id}": {
      delete: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Posts: "-Delete Post by Id",
        },
        description: "Delete Post by Id",
        operationId: "delete",
        parameters: [
          {
            name: "_id",
            in: "path",
            schema: {
              $ref: "#/components/schemas/_id",
            },
          },
        ],
        responses: {
          200: {
            description: "Deleted post || ${post.title} ||",
          },
          404: {
            description: "Post not found",
          },
          500: {
            description: "There was a problem finding the posts",
          },
        },
      },
    },

    "/posts/getByTitle/{title}": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Posts: "-Get Post by title",
        },
        description: "Get Post by title",
        operationId: "getByTitle",
        parameters: [
          {
            name: "title",
            in: "path",
            schema: {
              $ref: "#/components/schemas/title",
            },
          },
        ],
        responses: {
          404: {
            description: "Post not found",
          },
          500: {
            description: "There was a problem finding the posts",
          },
        },
      },
    },

    "/posts/getById/{_id}": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Posts: "-Get Post by Id",
        },
        description: "Get Post by Id",
        operationId: "getById",
        parameters: [
          {
            name: "_id",
            in: "path",
            schema: {
              $ref: "#/components/schemas/_id",
            },
          },
        ],
        responses: {
          404: {
            description: "Post not found",
          },
          500: {
            description: "There was a problem finding the posts",
          },
        },
      },
    },

    "/posts/getInfo": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Posts: "-Get Info Post",
        },
        description: "Get Info Post with comments",
        operationId: "getInfo",
        parameters: [],
        responses: {
          500: {
            description: "There was a problem finding the posts",
          },
        },
      },
    },

    "/posts/likes/{_id}": {
      put: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Posts: "-To like a post",
        },
        description: "To like a post",
        operationId: "like",
        parameters: [
          {
            name: "_id",
            in: "path",
            schema: {
              $ref: "#/components/schemas/_id",
            },
          },
        ],
        responses: {
          400: {
            description: "You already liked this post",
          },
          500: {
            description: "There was a problem with your like",
          },
        },
      },
    },

    "/posts/unlike/{_id}": {
      put: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Posts: "-To unlike a post",
        },
        description: "To unlike a post",
        operationId: "unlike",
        parameters: [
          {
            name: "_id",
            in: "path",
            schema: {
              $ref: "#/components/schemas/_id",
            },
          },
        ],
        responses: {
          400: {
            description: "You haven't liked this post yet",
          },
          500: {
            description: "There was a problem with your unlike",
          },
        },
      },
    },
    //ENDPOINTS SPACE FOR COMMENTS
    "/comments/create/{_id}": {
      post: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Comments: "-Create a comment",
        },
        description: "Create a comment",
        operationId: "create",
        parameters: [
          {
            name: "_id",
            in: "path",
            schema: {
              $ref: "#/components/schemas/_id",
            },
          },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/CommentInput",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Comment created successfully",
          },
          500: {
            description: "There was a problem creating the comment",
          },
        },
      },
    },
    "/comments/update/{_id}": {
      put: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Comments: "-Update a comment",
        },
        description: "Update a comment",
        operationId: "update",
        parameters: [
          {
            name: "_id",
            in: "path",
            schema: {
              $ref: "#/components/schemas/_id",
            },
          },
        ],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                $ref: "#/components/schemas/CommentInput",
              },
            },
          },
        },
        responses: {
          404: {
            description: "Comment not found",
          },
          200: {
            description: "Comment updated successfully",
          },
          500: {
            description: "There was a problem updating the comment",
          },
        },
      },
    },
    "/comments/delete/{_id}": {
      delete: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Comments: "-Delete Comment by Id",
        },
        description: "Delete Comment by Id",
        operationId: "delete",
        parameters: [
          {
            name: "_id",
            in: "path",
            schema: {
              $ref: "#/components/schemas/_id",
            },
          },
        ],
        responses: {
          200: {
            description: "Comment deleted",
          },
          404: {
            description: "Comment not found",
          },
          500: {
            description: "There was a problem deleting the comment",
          },
        },
      },
    },
    "/comments/getAll": {
      get: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Comments: "-Get All Comments",
        },
        description: "Get All comments",
        operationId: "getAll",
        parameters: [],
        responses: {
          200: {
            description: "We finded all this comments",
          },
          500: {
            description: "There was a problem getting the comment",
          },
        },
      },
    },
    "/comments/likes/{_id}": {
      put: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Comments: "-To like a comment",
        },
        description: "To like a comment",
        operationId: "like",
        parameters: [
          {
            name: "_id",
            in: "path",
            schema: {
              $ref: "#/components/schemas/_id",
            },
          },
        ],
        responses: {
          400: {
            description: "You already liked this comment",
          },
          500: {
            description: "There was a problem with your like",
          },
        },
      },
    },
    "/comments/unlike/{_id}": {
      put: {
        security: [
          {
            ApiKeyAuth: [],
          },
        ],
        tags: {
          Comments: "-To unlike a comment",
        },
        description: "To unlike a comment",
        operationId: "unlike",
        parameters: [
          {
            name: "_id",
            in: "path",
            schema: {
              $ref: "#/components/schemas/_id",
            },
          },
        ],
        responses: {
          400: {
            description: "You haven't liked this comment yet",
          },
          500: {
            description: "There was a problem with your unlike",
          },
        },
      },
    },
  },
};
