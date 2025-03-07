# Contributing to Password Cleaner

![100% Open Source](https://img.shields.io/badge/Open%20Source-100%25-blue)
![MIT License](https://img.shields.io/badge/License-MIT-green)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

Password Cleaner is a 100% open-source tool that helps users manage and clean up their password exports from Chromium-based browsers (Chrome, Brave, Edge, Opera, etc.). Our mission is to provide a secure, private, and efficient way to organize browser passwords while keeping all processing local.

## 🌟 Why Contribute?

- **Impact**: Help thousands of users manage their passwords securely
- **Privacy-First**: Build tools that respect user privacy
- **Open Source**: Join a transparent and collaborative development process
- **Learning**: Work with modern web technologies and security practices

## 🤝 Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Our Code of Conduct includes:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

## 🚀 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check [existing issues](https://github.com/peaktwilight/chrome-csv-password-cleaner/issues) to avoid duplicates. When creating a bug report, please include:

* A clear and descriptive title
* Detailed steps to reproduce the problem
* Specific examples and screenshots if applicable
* Your environment details (OS, browser version, etc.)
* Any relevant error messages or logs

### Suggesting Enhancements

Have an idea? First check our [existing issues](https://github.com/peaktwilight/chrome-csv-password-cleaner/issues) and [pull requests](https://github.com/peaktwilight/chrome-csv-password-cleaner/pulls). For new suggestions:

* Provide a clear and descriptive title
* Explain the step-by-step workflow of your suggestion
* Include mockups or examples if possible
* Describe the value this would add for users

### Pull Requests

1. Fork the repo and create your branch from `main`
2. Install dependencies and ensure everything works locally
3. Make your changes following our code style
4. Add tests if applicable
5. Update documentation as needed
6. Submit a well-documented pull request

## 💻 Development Setup

1. Clone the repository:
```bash
git clone https://github.com/peaktwilight/chrome-csv-password-cleaner.git
cd chrome-csv-password-cleaner
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see your local instance.

## 📝 Code Style Guide

We use TypeScript and modern web technologies to ensure code quality and maintainability:

* TypeScript for type safety and better developer experience
* Modern ES6+ features for clean and efficient code
* Consistent formatting with Prettier
* ESLint for code quality
* Component-based architecture with React
* Tailwind CSS for styling

### Commit Style

We follow conventional commits for clear history:

```
type(scope): description

[optional body]

[optional footer]
```

Example:
```
feat(parser): add support for Opera browser exports

- Add Opera-specific CSV format parsing
- Update documentation for Opera users
- Add tests for new parser

Fixes #123
```

## 🔒 Security

Security is our top priority. If you discover any security issues:

1. **DO NOT** open a public issue
2. Email security@passwordcleaner.dev immediately
3. Provide detailed information about the vulnerability
4. Wait for a response before disclosing publicly

Key Security Principles:
- Zero server communication - all processing stays local
- No data storage - everything stays in memory
- Secure parsing and handling of sensitive data
- Regular security audits and updates

## 📄 License

By contributing to Password Cleaner, you agree that your contributions will be licensed under the MIT License. See [LICENSE](LICENSE) for more details.

## 🙏 Recognition

Contributors are listed in our [README.md](README.md). We appreciate all contributions, big and small! 