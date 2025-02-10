# Anceda

# Development

> You need to have `Docker` installed on your machine to run the database locally.

```bash
# Install dependencies
pnpm install

# Init hooks
pnpm hoks:init

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

# Content

We'll implement multi lingual support by using `i18next` and `react-i18next`, in combination with a custom `script`. Look at `login-container.ts` to see how it is used.

## Creating new content

1. Create the react component
2. Open the `translations.ts` file in the `src/client` folder. Add a new key-value pair for the URL of the component. For example, if the code is located in `dashboard/overview`, the content should look like this:

```ts
export const translations: LangTree = {
    //...
    dashboard: {
        overview: {
            welcome: {
                en: "Welcome to the overview page",
                se: "Välkommen till översiktssidan",
            },
            // ...
        },
    },
};
```

3. When the content has been added, run the script to generate content: `pnpm run content:generate`
4. Add the content with the `useTranslation` hook in the component:

```tsx
import { useTranslation } from "react-i18next";

export const Overview = () => {
    const { t } = useTranslation();

    return <h1>{t("dashboard.overview.welcome")}</h1>;
};
```

5. Profit!!

# Inspiration

Links for inspiration and ideas

- shadcn dashboard: <https://github.com/Kiranism/next-shadcn-dashboard-starter>
