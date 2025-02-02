# Anceda

# Development

```bash
# Install dependencies
pnpm install

# allow scripts to run
chmod +x ./scripts/*

# Generate prisma client
pnpm db:generate

# Start development server
pnpm dev
```

To develop UI, use Vite port `5173` locally. Do not use the default port `3009` as it won't have hot module reloading.
