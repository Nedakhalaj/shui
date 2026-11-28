# Shui

Shui is a REST API for a digital bulletin board where users can register, log in, publish posts and leave comments. Guests can also publish posts, but they can't edit or delete them. The application is built as a serverless backend using AWS Lambda, API Gateway, and DynamoDB. The API is deployed and accessible via a public URL.

## Live API

https://90w51am3b6.execute-api.eu-north-1.amazonaws.com

## Tech

Node.js, AWS Lambda, API Gateway, DynamoDB, Serverless Framework, Middy, Zod, bcrypt, JWT

## Endpoints

| Method | Path | Login | What it does |
|---|---|---|---|
| POST | /auth/register | No | Create a new user |
| POST | /auth/login | No | Log in and get a token |
| GET | /posts | No | Get all posts, newest first (filter: ?username=) |
| GET | /posts/{postId} | No | Get one post |
| POST | /posts | Optional | Create a post (no token = guest post) |
| PUT | /posts/{postId} | Yes | Edit your own post |
| DELETE | /posts/{postId} | Yes | Delete your own post and its comments |
| POST | /posts/{postId}/comments | Yes | Comment on a post |
| GET | /posts/{postId}/comments | No | Get a post's comments, oldest first |

## Project structure

```text
functions/     One folder per endpoint, each with an index.mjs handler
services/      Database access (users, posts, comments) and responses
middlewares/   authenticate, optionalAuthenticate, validate (Zod) and errorHandler
models/        Zod schemas for auth, posts and comments
utils/         bcrypt and JWT helpers
```

## Status codes

| Status | Case | Message |
|---|---|---|
| 200 | Get posts, a post or comments | The data |
| 200 | Login OK | `Login successful` + token |
| 200 | Post edited | `Post updated successfully` |
| 201 | User registered | `User registered successfully` |
| 201 | Post created | `Post created successfully` |
| 201 | Comment created | `Comment created successfully` |
| 204 | Post and its comments deleted | (no body) |
| 400 | Body breaks a Zod rule | Zod's message, e.g. which field is wrong |
| 401 | No token on a protected endpoint | `Missing token` |
| 401 | Fake or expired token | `Invalid or expired token` |
| 401 | Wrong username or password | `Wrong username or password` |
| 403 | Edit someone else's post or a guest post | `You can only edit your own posts` |
| 403 | Delete someone else's post or a guest post | `You can only delete your own posts` |
| 404 | Post doesn't exist | `Post not found` |
| 409 | Username already taken | `Username already exists` |
| 415 | Body sent without `Content-Type: application/json` | `Unsupported Media Type` |
| 500 | Unexpected server error | `Internal server error` |

## How to run it

```bash
git clone https://github.com/Nedakhalaj/shui.git
cd shui
npm install
aws login
serverless deploy
```

Before you deploy, create a `config.yml` (it's not in Git) with these keys:

```yaml
org: <your Serverless org>
role: <your AWS IAM role ARN>
jwtSecret: <a long random secret>
```

## Security

- **bcrypt:** When a user registers, bcrypt turns the password into a hash, like a smoothie that can't be turned back into fruit. Only the hash is saved. At login, bcrypt hashes the entered password the same way and compares it with the saved hash. If they match, the user can log in.
- **JWT:** The jsonwebtoken package creates a token at login and verifies it on protected endpoints. The token has an expiry time (1 hour).
- **403:** Users can only edit or delete their own posts. Anyone else gets 403.
- **Guest posts:** Guests can create posts without logging in. Nobody can edit or delete a guest post, not even the guest, because a guest has no token to prove who wrote it.
- **Zod:** Zod uses schemas, which are rules for the data, in register, login, posts and comments. If the data breaks a rule, the API answers 400.
