# Graphite Demo Project

A simple Node.js API demonstrating Graphite's stacking workflow with 3 dependent PRs.

## Overview

This demo shows how to use Graphite to create and manage stacked pull requests. We'll build a task management API with the following stack:

```
main
└── PR 1: User Management (users endpoints + data store)
    └── PR 2: Task Management (tasks endpoints)
        └── PR 3: Authentication (auth middleware + login)
```

## Prerequisites

- Node.js 18+
- Git
- [Graphite CLI](https://graphite.dev/docs/graphite-cli) installed and authenticated
- GitHub account

### Install Graphite CLI

```bash
npm install -g @withgraphite/graphite-cli
gt auth --token <your-github-token>
```

## API Endpoints

| Endpoint | Method | Auth | PR |
|----------|--------|------|-----|
| /health | GET | No | main |
| /users | GET | No | PR 1 |
| /users/:id | GET | No | PR 1 |
| /users | POST | No | PR 1 |
| /tasks | GET | Yes | PR 2 |
| /tasks/:id | GET | Yes | PR 2 |
| /tasks | POST | Yes | PR 2 |
| /tasks/:id | PATCH | Yes | PR 2 |
| /login | POST | No | PR 3 |

---

## Demo Instructions

### Step 1: Initial Setup

```bash
# Initialize git and create GitHub repo
cd graphite-demo
git init
git add .
git commit -m "Initial commit: Express server with health endpoint"

# Add GitHub remote
git remote add origin git@github-personal.com:markelca/graphite-demo.git

# Push main branch
git push -u origin main

# Initialize Graphite
gt init
```

### Step 2: Verify Base Setup

```bash
# Install dependencies
npm install

# Start server
npm start

# Test health endpoint (in another terminal)
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"healthy","timestamp":"2024-01-15T10:30:00.000Z"}
```

---

## Creating the Stack

### PR 1: User Management

```bash
# Create a new branch stacked on main
gt create -m "feat: add user management endpoints"

# Apply the patch
git apply diffs/01-user-management.patch

# Stage and amend the commit
git add .
gt modify -m "feat: add user management endpoints"

# Submit the PR
gt submit
```

#### Test PR 1

```bash
# Restart server, then test:
curl http://localhost:3000/users
curl http://localhost:3000/users/1
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Charlie","email":"charlie@example.com"}'
```

---

### PR 2: Task Management

```bash
# Create a new branch stacked on PR 1
gt create -m "feat: add task management endpoints"

# Apply the patch
git apply diffs/02-task-management.patch

# Stage and amend the commit
git add .
gt modify -m "feat: add task management endpoints"

# Submit the PR
gt submit
```

#### Test PR 2

```bash
# Restart server, then test:
curl http://localhost:3000/tasks
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My first task","userId":1}'
curl http://localhost:3000/tasks/1
curl -X PATCH http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

---

### PR 3: Authentication

```bash
# Create a new branch stacked on PR 2
gt create -m "feat: add authentication middleware"

# Apply the patch
git apply diffs/03-authentication.patch

# Stage and amend the commit
git add .
gt modify -m "feat: add authentication middleware"

# Submit the PR
gt submit
```

#### Test PR 3

```bash
# Restart server, then test:

# Try accessing tasks without auth (should fail)
curl http://localhost:3000/tasks
# Response: {"error":"Unauthorized"}

# Login to get token
TOKEN=$(curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com"}' | jq -r '.token')

echo "Token: $TOKEN"

# Access tasks with auth
curl http://localhost:3000/tasks \
  -H "Authorization: Bearer $TOKEN"

# Create a task with auth
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Authenticated task","userId":1}'
```

---

## Graphite Workflow Commands

### View the Stack

```bash
# See your stack visually
gt log

# See all stacks
gt ls
```

### Sync with Remote

```bash
# Sync all branches with remote
gt sync
```

### Restack After Merge

When PR 1 gets merged to main:

```bash
# Update local main and restack
gt sync

# Or manually restack
gt restack
```

### Navigate the Stack

```bash
# Move to parent branch
gt checkout -u

# Move to child branch
gt checkout -d

# Checkout specific branch
gt checkout <branch-name>
```

### Modify a PR in the Stack

If you need to make changes to PR 1 after creating PR 2 and PR 3:

```bash
# Checkout PR 1's branch
gt checkout feat/user-management

# Make your changes
# ...

# Commit the changes
gt modify -m "feat: add user management endpoints"

# Restack children (PR 2 and PR 3 will be rebased)
gt restack

# Submit all updated PRs
gt submit --stack
```

### Submit Entire Stack

```bash
# Submit all PRs in the stack at once
gt submit --stack
```

---

## Project Structure

```
graphite-demo/
├── package.json
├── README.md
├── src/
│   ├── index.js          # Main entry point
│   ├── routes/
│   │   ├── health.js     # Health check (main)
│   │   ├── users.js      # User routes (PR 1)
│   │   └── tasks.js      # Task routes (PR 2)
│   ├── middleware/
│   │   └── auth.js       # Auth middleware (PR 3)
│   └── data/
│       └── store.js      # In-memory data store (PR 1)
└── diffs/
    ├── 01-user-management.patch
    ├── 02-task-management.patch
    └── 03-authentication.patch
```

---

## Troubleshooting

### Patch fails to apply

If a patch fails, you can manually create the files from the patch content or reset and try again:

```bash
git checkout .
git clean -fd
```

### Merge conflicts during restack

```bash
# After fixing conflicts
git add .
gt continue
```

### Reset to clean state

```bash
gt checkout main
gt branch delete <branch-name> --force
```
