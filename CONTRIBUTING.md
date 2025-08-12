# Contributing to Unbound SDK

Thank you for your interest in contributing to the Unbound SDK!

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/cameronjweeks/unbound-sdk.git
cd unbound-sdk
```

2. Install dependencies:
```bash
npm install
```

3. Run tests:
```bash
npm test
```

## Project Structure

- `index.js` - Main SDK entry point
- `base.js` - Base SDK class with transport system  
- `services/` - Individual service modules (21 services)
- `internal-sdk/` - Internal SDK extension
- `README.md` - Public documentation
- `IMPLEMENTATION_SUMMARY.md` - Technical implementation details

## Making Changes

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Add tests for new functionality
4. Run linting: `npm run lint`
5. Commit with descriptive message
6. Push and create a Pull Request

## Service Development

When adding or modifying services:
- Follow existing patterns in `services/` directory
- Add parameter validation using `this.sdk.validateParams()`
- Include JSDoc comments for all public methods
- Update README.md with new functionality

## Questions?

- 📧 Email: [support@unbound.cx](mailto:support@unbound.cx)
- 🐛 Issues: [GitHub Issues](https://github.com/cameronjweeks/unbound-sdk/issues)
