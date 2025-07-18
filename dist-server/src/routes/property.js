"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var Property_1 = require("../models/Property");
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
// Create property
router.post('/create', server_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var propertyData, property, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                propertyData = __assign(__assign({}, req.body), { owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId });
                property = new Property_1.default(propertyData);
                return [4 /*yield*/, property.save()];
            case 1:
                _b.sent();
                return [2 /*return*/, res.status(201).json({
                        message: 'Property created successfully',
                        property: property
                    })];
            case 2:
                error_1 = _b.sent();
                console.error('Property creation error:', error_1);
                return [2 /*return*/, res.status(500).json({
                        message: 'Error creating property',
                        error: error_1.message
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Upload property image
router.post('/upload-image', server_1.authMiddleware, upload.single('image'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.file) {
                    return [2 /*return*/, res.status(400).json({ message: 'No image file provided' })];
                }
                return [4 /*yield*/, cloudinary_1.v2.uploader.upload(req.file.path, {
                        folder: 'properties',
                        width: 1200,
                        height: 800,
                        crop: 'fill',
                    })];
            case 1:
                result = _a.sent();
                // Remove temp file
                fs_1.default.unlinkSync(req.file.path);
                return [2 /*return*/, res.status(200).json({
                        message: 'Image uploaded successfully',
                        url: result.secure_url
                    })];
            case 2:
                error_2 = _a.sent();
                console.error('Image upload error:', error_2);
                return [2 /*return*/, res.status(500).json({ message: 'Error uploading image' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get all properties
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var properties, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Property_1.default.find().populate('owner', 'name email avatar')];
            case 1:
                properties = _a.sent();
                return [2 /*return*/, res.status(200).json({ properties: properties })];
            case 2:
                error_3 = _a.sent();
                console.error('Property fetch error:', error_3);
                return [2 /*return*/, res.status(500).json({ message: 'Error fetching properties', error: error_3.message })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get property by ID
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var property, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Property_1.default.findById(req.params.id).populate('owner', 'name email avatar')];
            case 1:
                property = _a.sent();
                if (!property) {
                    return [2 /*return*/, res.status(404).json({ message: 'Property not found' })];
                }
                return [2 /*return*/, res.status(200).json({ property: property })];
            case 2:
                error_4 = _a.sent();
                console.error('Property fetch error:', error_4);
                return [2 /*return*/, res.status(500).json({ message: 'Error fetching property', error: error_4.message })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get user's properties
router.get('/user/listings', server_1.authMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var properties, error_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Property_1.default.find({ owner: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId })];
            case 1:
                properties = _b.sent();
                return [2 /*return*/, res.status(200).json({ properties: properties })];
            case 2:
                error_5 = _b.sent();
                console.error('Property fetch error:', error_5);
                return [2 /*return*/, res.status(500).json({ message: 'Error fetching properties', error: error_5.message })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Replace module.exports = router; with:
exports.default = router;
