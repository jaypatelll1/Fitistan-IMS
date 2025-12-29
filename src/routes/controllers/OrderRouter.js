const express = require("express");
const router = express.Router({ mergeParams: true });

const OrderManager = require("../../businesslogic/managers/OrderManager");
const { appWrapper } = require("../routeWrapper");
const ACCESS_ROLES = require("../../businesslogic/accessmanagement/RoleConstants");

// GET /orders/all - Get all orders with pagination and filters
router.get(
    "/all",
    appWrapper(async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { product_id, shelf_id, status } = req.query;

        const filters = {};
        if (product_id) filters.product_id = parseInt(product_id);
        if (shelf_id) filters.shelf_id = parseInt(shelf_id);
        if (status) filters.status = status;

        const result = await OrderManager.getOrdersPaginated(page, limit, filters);

        if (!result.orders || result.orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found"
            });
        }

        return res.json({
            success: true,
            data: result.orders,
            pagination: {
                page: result.page,
                limit: result.limit,
                offset: result.offset,
                total: result.total,
                totalPages: result.totalPages,
                previous: result.previous,
                next: result.next
            }
        });

    }, [ACCESS_ROLES.ALL])
);

// GET /orders/:order_id - Get order by ID with all details
router.get(
    "/orderId/:order_id",
    appWrapper(async (req, res) => {
        const { order_id } = req.params;

        const order = await OrderManager.getOrderById(parseInt(order_id));

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.json({
            success: true,
            data: order
        });

    }, [ACCESS_ROLES.ALL])
);

// PUT /orders/:order_id/status - Update order status
router.put(
    "/:order_id/status",
    appWrapper(async (req, res) => {
        const { order_id } = req.params;
        const { status } = req.body;

        const updated = await OrderManager.updateOrderStatus(
            parseInt(order_id),
            status
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.json({
            success: true,
            data: updated,
            message: "Order status updated successfully"
        });

    }, [ACCESS_ROLES.ALL])
);

module.exports = router;
