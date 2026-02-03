"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const userController_1 = require("../controllers/userController");
const productController_1 = require("../controllers/productController");
const categoryController_1 = require("../controllers/categoryController");
const orderController_1 = require("../controllers/orderController");
const tallyController_1 = require("../controllers/tallyController");
const warehouseController_1 = require("../controllers/warehouseController");
const dashboardController_1 = require("../controllers/dashboardController");
const itemTypeController_1 = require("../controllers/itemTypeController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Auth (public)
router.post("/auth/login", adminController_1.adminController.login);
router.post("/auth/refreshToken", adminController_1.adminController.refreshToken);
// Public routes - Products and Categories (GET only, no auth required)
router.get("/products", productController_1.productController.getAll);
router.get("/products/:id", productController_1.productController.getById);
router.get("/categories", categoryController_1.categoryController.getAll);
router.get("/categories/:id", categoryController_1.categoryController.getById);
// All other admin routes require authentication and admin role
router.use(authMiddleware_1.authenticateToken);
router.use(authMiddleware_1.adminOnly);
// Users (admin only)
router.get("/users", userController_1.userController.getAll);
router.get("/users/:id", userController_1.userController.getById);
router.put("/users/:id", userController_1.userController.update);
router.delete("/users/:id", userController_1.userController.delete);
// Products (POST, PUT, DELETE require admin)
router.post("/products", productController_1.productController.create);
router.put("/products/:id", productController_1.productController.update);
router.delete("/products/:id", productController_1.productController.delete);
// Categories (POST, PUT, DELETE require admin)
router.post("/categories", categoryController_1.categoryController.create);
router.put("/categories/:id", categoryController_1.categoryController.update);
router.delete("/categories/:id", categoryController_1.categoryController.delete);
// Orders
router.get("/orders", orderController_1.orderController.getAll);
router.get("/orders/:id", orderController_1.orderController.getById);
router.put("/orders/:id/status", orderController_1.orderController.updateStatus);
// Tally
router.get("/tally", tallyController_1.tallyController.getAll);
router.get("/tally/:id", tallyController_1.tallyController.getById);
router.post("/tally", tallyController_1.tallyController.create);
router.put("/tally/:id", tallyController_1.tallyController.update);
router.delete("/tally/:id", tallyController_1.tallyController.delete);
// Warehouse
router.get("/warehouse", warehouseController_1.warehouseController.getAll);
router.get("/warehouse/low-stock", warehouseController_1.warehouseController.getLowStock);
router.get("/warehouse/:id", warehouseController_1.warehouseController.getById);
router.post("/warehouse", warehouseController_1.warehouseController.create);
router.put("/warehouse/:id", warehouseController_1.warehouseController.update);
router.delete("/warehouse/:id", warehouseController_1.warehouseController.delete);
// Dashboard
router.get("/dashboard/kpi", dashboardController_1.dashboardController.getKPI);
router.get("/dashboard/sales", dashboardController_1.dashboardController.getDailySales);
// Item Types (for autocomplete suggestions)
router.get("/item-types", itemTypeController_1.itemTypeController.getAll);
router.get("/item-types/search", itemTypeController_1.itemTypeController.search);
router.post("/item-types", itemTypeController_1.itemTypeController.create);
router.delete("/item-types/:id", itemTypeController_1.itemTypeController.delete);
exports.default = router;
