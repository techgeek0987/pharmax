const BaseController = require('./baseController');
const authService = require('../services/authService');

class AuthController extends BaseController {
  constructor() {
    super();
  }

  register = this.handleAsync(async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return this.sendValidationError(res, {
        name: !name ? 'Name is required' : null,
        email: !email ? 'Email is required' : null,
        password: !password ? 'Password is required' : null
      });
    }

    const result = await authService.registerUser({ name, email, password });
    this.sendSuccess(res, result, 'User created successfully', 201);
  });

  login = this.handleAsync(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return this.sendValidationError(res, {
        email: !email ? 'Email is required' : null,
        password: !password ? 'Password is required' : null
      });
    }

    const result = await authService.loginUser({ email, password });
    this.sendSuccess(res, result, 'Login successful');
  });
}

module.exports = new AuthController();