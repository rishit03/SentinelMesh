# Contributing to SentinelMesh

Thank you for your interest in contributing to SentinelMesh! We welcome contributions from developers, researchers, and security professionals who share our vision of securing autonomous AI agent communication.

## 🎯 Project Vision

SentinelMesh is the security mesh for autonomous AI agents, providing real-time risk detection, traffic policies, and forensic observability for decentralized AI agent communication. We're building the future of AI agent security, and we'd love your help.

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- Docker and Docker Compose
- Git

### Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/SentinelMesh.git
   cd SentinelMesh
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Run with Docker Compose:**
   ```bash
   docker compose up --build
   ```

4. **Access the application:**
   - Backend API: http://localhost:8000
   - Frontend Dashboard: http://localhost:5173

## 🤝 How to Contribute

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug Reports**: Help us identify and fix issues
- 💡 **Feature Requests**: Suggest new features or improvements
- 🔧 **Code Contributions**: Implement features, fix bugs, or improve performance
- 📚 **Documentation**: Improve documentation, tutorials, or examples
- 🧪 **Testing**: Add tests or improve test coverage
- 🎨 **Design**: Improve UI/UX or create visual assets

### Before You Start

1. **Check existing issues**: Look for existing issues or discussions related to your contribution
2. **Create an issue**: If none exists, create an issue to discuss your proposed changes
3. **Get feedback**: Wait for feedback from maintainers before starting significant work

### Development Workflow

1. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Follow our coding standards (see below)
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes:**
   ```bash
   # Run backend tests
   cd backend && python -m pytest

   # Run frontend tests
   cd frontend/sentinelmesh-dashboard && npm test
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create a pull request:**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Coding Standards

### Python (Backend)

- Follow PEP 8 style guidelines
- Use type hints where appropriate
- Write docstrings for functions and classes
- Use `black` for code formatting
- Use `flake8` for linting

### JavaScript/React (Frontend)

- Use ES6+ features
- Follow React best practices
- Use meaningful component and variable names
- Write JSDoc comments for complex functions
- Use Prettier for code formatting
- Use ESLint for linting

### General Guidelines

- Write clear, descriptive commit messages
- Keep commits focused and atomic
- Add tests for new functionality
- Update documentation for user-facing changes
- Follow the existing code style and patterns

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend/sentinelmesh-dashboard
npm test

# End-to-end tests
npm run test:e2e
```

### Writing Tests

- Write unit tests for new functions and classes
- Add integration tests for API endpoints
- Include edge cases and error conditions
- Aim for good test coverage (>80%)

## 📋 Pull Request Process

1. **Ensure your PR:**
   - Has a clear title and description
   - References related issues
   - Includes tests for new functionality
   - Updates documentation as needed
   - Passes all CI checks

2. **PR Review Process:**
   - At least one maintainer review is required
   - Address feedback promptly
   - Keep discussions constructive and respectful
   - Be patient - reviews take time

3. **After Approval:**
   - PRs will be merged by maintainers
   - Your contribution will be acknowledged in release notes

## 🏷️ Issue Labels

We use labels to categorize issues:

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested

## 🆘 Getting Help

- **GitHub Discussions**: For general questions and discussions
- **GitHub Issues**: For bug reports and feature requests
- **Discord**: Join our community Discord server (link in README)

## 🎉 Recognition

Contributors will be:
- Listed in our CONTRIBUTORS.md file
- Mentioned in release notes
- Invited to join our contributor Discord channel
- Considered for maintainer roles based on contributions

## 📜 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 📄 License

By contributing to SentinelMesh, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to SentinelMesh! Together, we're building the future of AI agent security. 🛡️