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
var express_1 = require("express");
var User_1 = require("../models/User");
var server_1 = require("../../server");
var multer_1 = require("multer");
var cloudinary_1 = require("cloudinary");
var fs_1 = require("fs");
var path_1 = require("path");
var router = express_1.default.Router();
// Configure multer for file uploads
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        var uploadDir = path_1.default.join(__dirname, '../../uploads');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
var upload = (0, multer_1.default)({ storage: storage });
// Get user profile
router.get('/profile', server_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId).select('-password')];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                }
                return [2 /*return*/, res.status(200).json({ user: user })];
            case 2:
                error_1 = _b.sent();
                console.error('Profile error:', error_1);
                return [2 /*return*/, res.status(500).json({ message: 'Server error', error: error_1.message })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Update user profile
router.put('/profile', server_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, email, phone, bio, user, error_2;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.body, name_1 = _a.name, email = _a.email, phone = _a.phone, bio = _a.bio;
                return [4 /*yield*/, User_1.default.findByIdAndUpdate((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId, { name: name_1, email: email, phone: phone, bio: bio }, { new: true }).select('-password')];
            case 1:
                user = _c.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                }
                return [2 /*return*/, res.status(200).json({ message: 'Profile updated successfully', user: user })];
            case 2:
                error_2 = _c.sent();
                console.error('Profile update error:', error_2);
                return [2 /*return*/, res.status(500).json({ message: 'Server error', error: error_2.message })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Update user password
router.put('/password', server_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, currentPassword, newPassword, user, isMatch, error_3;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                _a = req.body, currentPassword = _a.currentPassword, newPassword = _a.newPassword;
                return [4 /*yield*/, User_1.default.findById((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId)];
            case 1:
                user = _c.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                }
                return [4 /*yield*/, user.comparePassword(currentPassword)];
            case 2:
                isMatch = _c.sent();
                if (!isMatch) {
                    return [2 /*return*/, res.status(400).json({ message: 'Current password is incorrect' })];
                }
                // Update password
                user.password = newPassword;
                return [4 /*yield*/, user.save()];
            case 3:
                _c.sent();
                return [2 /*return*/, res.status(200).json({ message: 'Password updated successfully' })];
            case 4:
                error_3 = _c.sent();
                console.error('Password update error:', error_3);
                return [2 /*return*/, res.status(500).json({ message: 'Server error', error: error_3.message })];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Update user settings
router.put('/settings', server_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, notifications, privacy, user, error_4;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.body, notifications = _a.notifications, privacy = _a.privacy;
                return [4 /*yield*/, User_1.default.findByIdAndUpdate((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId, {
                        notifications: notifications || undefined,
                        privacy: privacy || undefined,
                    }, { new: true }).select('-password')];
            case 1:
                user = _c.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                }
                return [2 /*return*/, res.status(200).json({ message: 'Settings updated successfully', user: user })];
            case 2:
                error_4 = _c.sent();
                console.error('Settings update error:', error_4);
                return [2 /*return*/, res.status(500).json({ message: 'Server error', error: error_4.message })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Upload avatar
router.post('/upload-avatar', server_1.authMiddleware, upload.single('image'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, user, error_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                if (!req.file) {
                    return [2 /*return*/, res.status(400).json({ message: 'No image file provided' })];
                }
                return [4 /*yield*/, cloudinary_1.v2.uploader.upload(req.file.path, {
                        folder: 'avatars',
                        width: 200,
                        height: 200,
                        crop: 'fill',
                    })];
            case 1:
                result = _b.sent();
                // Remove temp file
                fs_1.default.unlinkSync(req.file.path);
                return [4 /*yield*/, User_1.default.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, { avatar: result.secure_url }, { new: true }).select('-password')];
            case 2:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                }
                return [2 /*return*/, res.status(200).json({
                        message: 'Avatar uploaded successfully',
                        url: result.secure_url,
                        user: user
                    })];
            case 3:
                error_5 = _b.sent();
                console.error('Avatar upload error:', error_5);
                return [2 /*return*/, res.status(500).json({ message: 'Error uploading avatar' })];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Correctly using ES module export
exports.default = router;
