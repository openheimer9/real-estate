"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var PropertySchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    images: [{ type: String, required: true }],
    beds: { type: Number, required: true },
    baths: { type: Number, required: true },
    parking: { type: Boolean, default: false },
    furnished: { type: Boolean, default: false },
    area: { type: Number, required: true },
    type: {
        type: String,
        enum: ['Apartment', 'Villa', 'House', 'Office', 'Shop', 'Land'],
        required: true
    },
    status: {
        type: String,
        enum: ['For Rent', 'For Sale'],
        required: true
    },
    featured: { type: Boolean, default: false },
    owner: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
var Property = mongoose_1.default.models.Property || mongoose_1.default.model('Property', PropertySchema);
exports.default = Property;
