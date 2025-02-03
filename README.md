# Anceda

# Development

> You need to have `Docker` installed on your machine to run the database locally.

```bash
# Install dependencies
pnpm install

# allow scripts to run
chmod +x ./scripts/*

# Generate prisma client
pnpm db:generate

# Start local database
pnpm db:local:start

# Start development server
pnpm dev
```

## TODO

- [ ] Add roles or organization
