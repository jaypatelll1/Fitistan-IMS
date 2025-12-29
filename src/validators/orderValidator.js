const Joi = require("joi");
const COMMON_MESSAGES = require("../validators/validationConstants/commanMessages");
const { ORDER_STATUS } = require("../models/libs/dbConstants");

const validStatuses = Object.values(ORDER_STATUS);

const createOrderSchema = Joi.object({
    product_id: Joi.number()
        .integer()
        .positive()
        .required()
        .label("Product ID")
        .messages({
            "number.base": COMMON_MESSAGES.NUMBER_BASE,
            "number.integer": COMMON_MESSAGES.NUMBER_INTEGER,
            "number.positive": COMMON_MESSAGES.NUMBER_POSITIVE,
            "any.required": COMMON_MESSAGES.ANY_REQUIRED
        }),

   shelf_id: Joi.number()
        .integer()
        .positive()
        .required()
        .label("Warehouse ID")
        .messages({
            "number.base": COMMON_MESSAGES.NUMBER_BASE,
            "number.integer": COMMON_MESSAGES.NUMBER_INTEGER,
            "number.positive": COMMON_MESSAGES.NUMBER_POSITIVE,
            "any.required": COMMON_MESSAGES.ANY_REQUIRED
        }),

    quantity: Joi.number()
        .integer()
        .positive()
        .required()
        .label("Quantity")
        .messages({
            "number.base": COMMON_MESSAGES.NUMBER_BASE,
            "number.integer": COMMON_MESSAGES.NUMBER_INTEGER,
            "number.positive": COMMON_MESSAGES.NUMBER_POSITIVE,
            "any.required": COMMON_MESSAGES.ANY_REQUIRED
        })
});

const updateStatusSchema = Joi.object({
    order_id: Joi.number()
        .integer()
        .positive()
        .required()
        .label("Order ID")
        .messages({
            "number.base": COMMON_MESSAGES.NUMBER_BASE,
            "number.integer": COMMON_MESSAGES.NUMBER_INTEGER,
            "number.positive": COMMON_MESSAGES.NUMBER_POSITIVE,
            "any.required": COMMON_MESSAGES.ANY_REQUIRED
        }),

    status: Joi.string()
        .valid(...validStatuses)
        .required()
        .label("Status")
        .messages({
            "any.only": `{#label} must be one of: ${validStatuses.join(", ")}`,
            "any.required": COMMON_MESSAGES.ANY_REQUIRED
        })
});

const paginationSchema = Joi.object({
    page: Joi.number()
        .integer()
        .positive()
        .default(1)
        .label("Page")
        .messages({
            "number.base": COMMON_MESSAGES.NUMBER_BASE,
            "number.integer": COMMON_MESSAGES.NUMBER_INTEGER,
            "number.positive": COMMON_MESSAGES.NUMBER_POSITIVE
        }),

    limit: Joi.number()
        .integer()
        .positive()
        .default(10)
        .label("Limit")
        .messages({
            "number.base": COMMON_MESSAGES.NUMBER_BASE,
            "number.integer": COMMON_MESSAGES.NUMBER_INTEGER,
            "number.positive": COMMON_MESSAGES.NUMBER_POSITIVE
        }),

    // Optional filters
    product_id: Joi.number()
        .integer()
        .positive()
        .optional()
        .label("Product ID"),

   shelf_id: Joi.number()
        .integer()
        .positive()
        .optional()
        .label("Warehouse ID"),

    status: Joi.string()
        .valid(...validStatuses)
        .optional()
        .label("Status")
});

module.exports = {
    createOrderSchema,
    updateStatusSchema,
    paginationSchema
};
