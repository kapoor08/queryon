Perfect! I can see the structure now. You have:

- Repository root: `QUERYON`
- `.husky` folder at the root level
- `queryon-admin` subfolder (where your project is)
- Another `.husky` folder inside `queryon-admin`

The issue is that Git is looking for hooks in the root `.husky` folder, but you've been setting up hooks in the `queryon-admin/.husky` folder.

## Solution: Set up the hook in the ROOT .husky folder

### Step 1: Go to the repository root and set up the hook there

```bash
# Go to repository root (QUERYON folder)
cd ..

# Create pre-commit hook in the ROOT .husky folder
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
echo "Pre-commit hook running from repository root"
echo "Changing to queryon-admin directory..."

cd queryon-admin

echo "Running lint-staged..."
npx lint-staged

echo "Running build..."
npm run build

echo "Pre-commit hook completed successfully!"
EOF
```

### Step 2: Make it executable

```bash
chmod +x .husky/pre-commit
```

### Step 3: Remove the duplicate .husky folder from queryon-admin

```bash
# Remove the .husky folder from queryon-admin since we don't need it
rm -rf queryon-admin/.husky
```

### Step 4: Test the setup

```bash
# Go back to queryon-admin
cd queryon-admin

# Make a change and commit
echo "// test from root husky" >> README.md
git add README.md
git commit -m "test: using root husky folder"
```

This should now work because:

1. Git is configured to use `.husky` for hooks (`core.hooksPath = .husky`)
2. The hook is now in the ROOT `.husky` folder where Git expects it
3. The hook changes directory to `queryon-admin` before running lint-staged and build

Try this and let me know if the hook runs during the commit!
