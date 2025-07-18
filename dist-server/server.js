"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withRoles = exports.authMiddleware = void 0;
var express = require("express");
var dotenv = require("dotenv");
var cookieParser = require("cookie-parser");
var cors = require("cors");
var mongoose_1 = require("mongoose");
var path = require("path");
var cloudinary_1 = require("cloudinary");
var jwt = require("jsonwebtoken");
// Setup routes
var auth_1 = require("./src/routes/auth"); // Using relative path instead of alias
var user_1 = require("./src/routes/user"); // Using path alias
var property_1 = require("./src/routes/property"); // Using path alias
// Load environment variables
dotenv.config();
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Setup Express
var app = express();
var PORT = process.env.PORT || 3001;
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
// Connect to MongoDB
var connectToDatabase = function () { return __awaiter(void 0, void 0, void 0, function () {
    var mongoUri, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                mongoUri = process.env.MONGODB_URI;
                if (!mongoUri) {
                    throw new Error('MONGODB_URI environment variable is not defined');
                }
                return [4 /*yield*/, mongoose_1.default.connect(mongoUri)];
            case 1:
                _a.sent();
                console.log('Connected to MongoDB');
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('MongoDB connection error:', error_1);
                process.exit(1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
connectToDatabase();
// Auth middleware
var authMiddleware = function (req, res, next) {
    var _a;
    try {
        var token = req.cookies.token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        var jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }
        var decoded = jwt.verify(token, jwtSecret);
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };
        next();
    }
    catch (error) {
        var message = error instanceof Error ? error.message : 'Unauthorized: Invalid token';
        return res.status(401).json({ message: message });
    }
};
exports.authMiddleware = authMiddleware;
// Role-based middleware
var withRoles = function (roles) {
    return function (req, res, next) {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};
exports.withRoles = withRoles;
app.use('/api/auth', auth_1.default);
app.use('/api/user', user_1.default);
app.use('/api/property', property_1.default);
// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}
// Start server
app.listen(PORT, function () {
    console.log("Server running on port ".concat(PORT));
});
