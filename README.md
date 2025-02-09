# Anceda

# Development

> You need to have `Docker` installed on your machine to run the database locally.

```bash
# Install dependencies
pnpm install

# Generate prisma client
pnpm db:generate

# Start local database
pnpm db:start

# Migrate database
pnpm db:reset

# Start development server
pnpm dev
```

# git workflow

- `main` branch is the main branch
- Create a new branch for each feature
- Create a pull request to merge the feature branch to `main`
- We use conventional commits for commit messages (<https://www.conventionalcommits.org/en/v1.0.0/>)

## Creating a new feature branch

```bash
# Fetch latest main
git checkout main
git pull

# Create a new branch
git checkout -b feature/<feature-name>

# Make changes
...

# Commit changes
git add .
git commit -m "feat: <feature-name>"

# Push changes
git push origin feature/<feature-name>

# Create a pull request on GitHub
```

## Rebasing

Whenever you want to update your feature branch with the latest changes from `main`, you can use `rebase`.

```bash
# Fetch latest main
git checkout main
git pull

# Switch to feature branch
git checkout feature/<feature-name>

# Rebase with main
git rebase main
```

## TODO

- [ ] Add roles or organization
