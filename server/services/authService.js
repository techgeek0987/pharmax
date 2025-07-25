const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authService = {
    async registerUser({ name, email, password }) {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Create user
        const user = new User({ name, email, password });
        await user.save();

        // Generate token
        const token = this.generateToken(user._id);

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        };
    },

    async loginUser({ email, password }) {
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // Generate token
        const token = this.generateToken(user._id);

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        };
    },

    generateToken(userId) {
        return jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
    },

    verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
};

module.exports = authService;