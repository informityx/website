# Baselining the database (used `db push` before, no migrations)

Your database was created with `db push` and has never had migrations applied. To switch to migrations **without losing data**, do the following once.

## Steps (run in your project root)

### 1. Apply the Custom Types migration SQL

This creates the `CustomType` table and updates `Section` (adds `customTypeId`, makes `pageId` optional). Your existing tables and data are left as-is.

```bash
npx prisma db execute --file ./prisma/migrations/20250316000000_add_custom_types/migration.sql
```

If you see "relation CustomType does not exist" or similar, the migration may have already been applied (e.g. by a previous `db push`). You can skip to step 2.

### 2. Mark migrations as applied

Tell Prisma that both migrations are already applied so it does not try to run them (and so future `migrate dev` / `migrate deploy` work correctly). Run **in this order**:

```bash
npx prisma migrate resolve --applied "20250316000000_add_custom_types"
npx prisma migrate resolve --applied "20260309212248_add_page_banner_fields"
```

### 3. Regenerate the client (optional)

```bash
npx prisma generate
```

## After this

- Use **`npm run db:migrate`** (or `npx prisma migrate dev`) when you change the schema. That creates a new migration file and applies it **without** wiping data.
- Do **not** use `db push` for schema changes anymore.
- For production/CI, use **`npx prisma migrate deploy`** to apply pending migrations.

## One-liner (all steps)

From the project root:

```bash
npx prisma db execute --file ./prisma/migrations/20250316000000_add_custom_types/migration.sql && npx prisma migrate resolve --applied "20250316000000_add_custom_types" && npx prisma migrate resolve --applied "20260309212248_add_page_banner_fields" && npx prisma generate
```

Then run the app or build as usual.
