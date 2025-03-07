# Contributing to Password Cleaner

First off, thank you for considering contributing to Password Cleaner! It's people like you that make Password Cleaner such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots if possible
* Include your environment details (OS, browser version, etc.)

### Suggesting Enhancements

If you have a suggestion for a new feature or enhancement, first check the existing issues and pull requests to see if it has already been proposed. If it hasn't, you can create a new issue:

* Use a clear and descriptive title
* Provide a detailed description of the suggested enhancement
* Explain why this enhancement would be useful
* List some examples of how it would be used

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code follows the existing code style
5. Write a good commit message

#### Local Development

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

### JavaScript/TypeScript Style Guide

* Use TypeScript for all new code
* Use modern ES6+ features
* Follow the existing code style
* Use meaningful variable names
* Add comments for complex logic
* Keep functions small and focused
* Use async/await for asynchronous operations

### Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

Example:
```
Add password strength indicator

- Add strength meter component
- Implement zxcvbn password strength algorithm
- Add color coding for different strength levels

Fixes #123
```

### Security

Security is a top priority for Password Cleaner. If you discover any security issues, please email security@yourdomain.com instead of using the issue tracker.

Key security principles to follow:
- Never send passwords or sensitive data to external servers
- Always process data client-side
- Use secure cryptographic methods when necessary
- Follow OWASP security guidelines

## License

By contributing to Password Cleaner, you agree that your contributions will be licensed under its MIT license. 