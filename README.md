# OKF Wiki Template

This is a starter template for an **Open Knowledge Framework (OKF) v3** wiki. It is designed to be highly structured for both humans and AI agents.

## Getting Started

1. Use this template to create a new repository.
2. Initialize your wiki by editing `index.md` and `log.md`.
3. Add new concepts in `concepts/`, projects in `projects/`, etc.

## OKF Standards

- **Metadata**: Every file must contain YAML frontmatter with `title`, `type`, and `timestamp`.
- **References**: Use standard Markdown relative links (`[Title](./path/to/file.md)`) instead of WikiLinks (`[[Title]]`).
- **Structure**: Every folder should contain its own `index.md` and `log.md`.

## Local Validation

Run the following command to validate your wiki against OKF standards:
```bash
npm install
npm run validate
```
