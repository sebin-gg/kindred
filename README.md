# kindred

## 🔒 Security

This repository uses [gitleaks](https://github.com/gitleaks/gitleaks) for automatic secret scanning on every commit.

### Pre-commit Hook

A pre-commit hook is configured to scan for secrets before each commit. This helps prevent accidentally committing sensitive information like:
- API keys
- Passwords
- Tokens
- Private keys

### Setup

To enable the pre-commit hook locally:

```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install
```

### Bypass (Emergency Only)

In case of emergency, you can bypass the hook:

```bash
git commit --no-verify -m "emergency commit"
```

> ⚠️ Only use `--no-verify` in emergency situations. Regular commits should always be scanned.

