# Contributing to BlockchainLightning

Thank you for your interest in contributing to the Lightning Certificate project! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:

1. **Clear title**: Describe the bug in one sentence
2. **Description**: Detailed explanation of the issue
3. **Steps to reproduce**: List the exact steps to trigger the bug
4. **Expected behavior**: What should happen
5. **Actual behavior**: What actually happens
6. **Environment**: OS, Node version, React Native version, etc.
7. **Screenshots**: If applicable
8. **Error logs**: Console output or error messages

**Example:**
```
Title: Payment status not updating after Lightning invoice paid

Description: When a Lightning invoice is paid, the payment status check
does not detect the payment and remains stuck in "checking" state.

Steps to reproduce:
1. Select birth certificate
2. Fill in form
3. Create payment
4. Pay invoice with Lightning wallet
5. Wait on payment screen

Expected: Payment should be detected within 30 seconds
Actual: Payment status never updates, stays in checking loop

Environment: iOS 16, React Native 0.82, Backend v1.0.0
```

### Suggesting Features

For new features or enhancements:

1. **Check existing issues**: Search for similar requests
2. **Open an issue**: Use the "Feature Request" template
3. **Describe the feature**: What it does and why it's needed
4. **Use cases**: Real-world scenarios where it would be useful
5. **Alternatives**: Other solutions you've considered

### Pull Requests

We love pull requests! Here's how to submit one:

#### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR-USERNAME/BlockchainLightning.git
cd BlockchainLightning
```

#### 2. Create a Branch

```bash
# Create a descriptive branch name
git checkout -b feature/add-certificate-templates
# or
git checkout -b fix/payment-status-polling
```

Branch naming conventions:
- `feature/`: New features
- `fix/`: Bug fixes
- `docs/`: Documentation updates
- `refactor/`: Code refactoring
- `test/`: Test additions or fixes

#### 3. Make Your Changes

**Backend changes:**
```bash
cd backend
npm install
# Make your changes
npm start  # Test locally
```

**Mobile changes:**
```bash
cd mobile
npm install
# Make your changes
npm run ios  # or npm run android
```

**Code style guidelines:**
- Use meaningful variable names
- Add comments for complex logic
- Follow existing code style
- Keep functions small and focused
- Write self-documenting code

#### 4. Test Your Changes

Before submitting:

**Backend:**
```bash
cd backend
npm start
# Run API tests
./test-api.sh
```

**Mobile:**
- Test on both iOS and Android (if possible)
- Test on different screen sizes
- Test happy path and error cases
- Test with slow network (if applicable)

#### 5. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "Add certificate template selection feature

- Add template picker component
- Update certificate generation to use templates
- Add three default templates (modern, classic, elegant)
- Update documentation
"
```

Commit message format:
- First line: Brief summary (50 chars or less)
- Blank line
- Detailed explanation with bullet points
- Reference issue numbers: "Fixes #123" or "Related to #456"

#### 6. Push and Create PR

```bash
git push origin feature/add-certificate-templates
```

On GitHub:
1. Go to your fork
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template
5. Submit

**PR Title Examples:**
- ✅ "Add certificate template selection feature"
- ✅ "Fix payment status polling bug"
- ✅ "Update API documentation for new endpoints"
- ❌ "Update" (too vague)
- ❌ "Changes" (not descriptive)

**PR Description Should Include:**
- What changes were made
- Why the changes were necessary
- How to test the changes
- Screenshots/videos (for UI changes)
- Related issues
- Breaking changes (if any)

#### 7. Code Review

- Be patient and responsive
- Address review comments
- Make requested changes
- Update your PR with new commits
- Discuss disagreements respectfully

## Development Setup

### Backend Development

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Mobile Development

```bash
cd mobile
npm install
# Update API_BASE_URL in src/config/config.js
npm start
npm run ios  # or npm run android
```

## Project Structure

```
BlockchainLightning/
├── backend/           # Node.js Express backend
│   ├── src/
│   │   ├── config/    # Configuration
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/    # API routes
│   │   ├── services/  # Business logic
│   │   └── utils/     # Utilities
│   └── test/          # Tests (add here)
├── mobile/            # React Native app
│   └── src/
│       ├── screens/   # UI screens
│       ├── navigation/  # Navigation
│       ├── services/  # API calls
│       └── context/   # State management
└── docs/              # Documentation
```

## Coding Standards

### JavaScript/ES6+

- Use ES6+ features (const/let, arrow functions, destructuring)
- Use async/await instead of callbacks
- Handle errors properly with try/catch
- Use meaningful variable names
- Keep functions pure when possible
- Avoid deep nesting

**Example:**
```javascript
// ❌ Bad
function getData(id, cb) {
  fetch('/api/data/' + id).then(function(res) {
    res.json().then(function(data) {
      cb(null, data);
    }).catch(function(err) {
      cb(err);
    });
  });
}

// ✅ Good
async function getData(id) {
  try {
    const response = await fetch(`/api/data/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
```

### React Native

- Use functional components with hooks
- Use meaningful component names
- Keep components small and focused
- Extract reusable logic into custom hooks
- Handle loading and error states
- Use PropTypes or TypeScript

**Example:**
```javascript
// ✅ Good component structure
const CertificateCard = ({ certificate, onPress }) => {
  const [loading, setLoading] = useState(false);
  
  const handlePress = async () => {
    try {
      setLoading(true);
      await onPress(certificate.id);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <TouchableOpacity onPress={handlePress} disabled={loading}>
      <Text>{certificate.name}</Text>
    </TouchableOpacity>
  );
};
```

## Documentation

When adding features:

1. Update relevant README files
2. Add JSDoc comments to functions
3. Update API_DOCUMENTATION.md for API changes
4. Update ARCHITECTURE.md for structural changes
5. Add inline comments for complex logic

**JSDoc Example:**
```javascript
/**
 * Generate a PDF certificate for a user
 * @param {Object} userData - User's personal information
 * @param {string} certificateType - Type of certificate (birth, marriage, etc.)
 * @returns {Promise<Object>} Generated certificate details with blockchain anchor
 * @throws {Error} If payment not completed or certificate generation fails
 */
async function generateCertificate(userData, certificateType) {
  // Implementation
}
```

## Testing

### Writing Tests

We welcome test contributions! Use these frameworks:

**Backend:**
- Unit tests: Jest
- Integration tests: Supertest
- API tests: See `test-api.sh`

**Mobile:**
- Component tests: React Native Testing Library
- E2E tests: Detox

**Example test:**
```javascript
describe('Certificate Service', () => {
  it('should generate certificate with valid data', async () => {
    const userData = {
      fullName: 'John Doe',
      dateOfBirth: '01/01/1990',
    };
    
    const result = await certificateService.generateCertificate(
      userData,
      'birth'
    );
    
    expect(result).toHaveProperty('certificateId');
    expect(result).toHaveProperty('documentHash');
    expect(result.blockchainAnchor).toBeDefined();
  });
});
```

## What to Contribute

### Good First Issues

Look for issues labeled `good-first-issue`:
- Documentation improvements
- Adding code comments
- Fixing typos
- Small bug fixes
- Test coverage

### Ideas for Contributions

**Features:**
- Multi-language support
- Additional certificate types
- Certificate templates
- Email notifications
- Dark mode
- Offline support

**Improvements:**
- Better error messages
- Loading state improvements
- Performance optimizations
- Accessibility enhancements
- Security improvements

**Infrastructure:**
- CI/CD pipeline
- Automated testing
- Docker improvements
- Deployment scripts

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Open a GitHub Issue
- **Chat**: Join our community (if available)
- **Email**: Contact maintainers

## Recognition

Contributors will be:
- Added to CONTRIBUTORS.md
- Credited in release notes
- Mentioned in project documentation

Thank you for contributing to BlockchainLightning! 🎉⚡🪙
