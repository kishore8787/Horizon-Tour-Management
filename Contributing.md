# Contributing Guidelines

Thank you for considering contributing to this **Tour Management MERN Web Application**! 🎉  
We welcome all kinds of contributions — whether it's reporting a bug, suggesting a feature, improving documentation, or submitting a pull request.

---

## 🛠 How to Contribute

### 1. Fork & Clone the Repository
- Fork this repository to your GitHub account.  
- Clone your fork to your local machine:
  ```bash
  git clone https://github.com/<your-username>/<repo-name>.git
  ```
- Navigate into the project folder:
  ```bash
  cd <repo-name>
  ```

### 2. Set Up the Project
- Install dependencies for both **frontend** and **backend**:
  ```bash
  npm install
  ```
- Create a `.env` file in the backend directory and configure the following:
  ```
  MONGODB_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  ```
- Update `utils/config.js` with your local `BASE_URL`.

- Run frontend and backend in separate terminals:
  ```bash
  # Frontend
  npm run start

  # Backend
  npm run start
  ```

### 3. Branching Strategy
- Create a new branch for your work:
  ```bash
  git checkout -b feature/your-feature-name
  ```
- Keep your branch name descriptive (e.g., `bugfix/login-error` or `feature/add-review-system`).

### 4. Making Changes
- Follow project coding style (ESLint/Prettier if configured).  
- Write clear, concise commit messages:
  ```
  feat: add search filtering by price range
  fix: resolve booking confirmation crash
  docs: update installation steps
  ```

### 5. Testing Your Changes
- Test both frontend and backend before submitting.  
- Ensure no existing features are broken.  
- If applicable, add/update unit or integration tests.

### 6. Submitting a Pull Request (PR)
- Push your branch to your fork:
  ```bash
  git push origin feature/your-feature-name
  ```
- Open a Pull Request to the **main** branch of this repository.  
- Clearly describe:
  - What problem/feature the PR addresses  
  - Steps to test your changes  
  - Any dependencies introduced

---

## 🤝 Contribution Types
- **Bug Fixes** – Fixing broken functionality or errors  
- **Features** – Adding new modules or capabilities  
- **Docs** – Improving documentation, READMEs, setup guides  
- **Refactoring** – Code clean-up, performance improvements  
- **UI/UX** – Enhancements to frontend experience  

---

## 🧑‍💻 Code of Conduct
Please make sure to:
- Be respectful and constructive in discussions.  
- Avoid offensive language or behavior.  
- Collaborate with kindness — we’re building this together!  

---

## ⭐ Acknowledgment
Your contributions make this project better for everyone.  
Thank you for helping improve the **Tour Management MERN App**!

