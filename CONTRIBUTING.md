# Contributing to LaoTrace (ສປປ ລາວ)

Thank you for your interest in contributing to the Lao National Agricultural Traceability Platform.

## 🌿 Code Standards
1. **TypeScript & React**: Maintain strict typing and use functional components with hooks.
2. **Conventional Commits**: Format commit messages using the standard format:
   - `feat(scope): ...`
   - `fix(scope): ...`
   - `docs(scope): ...`
   - `test(scope): ...`
   - `refactor(scope): ...`
3. **Smart Contract Interfaces**: Keep ethers.js contract calls and ABI synchronizations in `dapp/src/contracts/`.

## 🧪 Testing
Always ensure test suites pass before submitting changes:
```bash
cd dapp
npm test
npm run typecheck
npm run build
```

## 📜 License
By contributing to this repository, you agree that your contributions will be licensed under the MIT License.
