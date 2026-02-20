import { Router } from "express";
import { adminController } from "../controllers/adminController";
import { userController } from "../controllers/userController";
import { productController } from "../controllers/productController";
import { categoryController } from "../controllers/categoryController";
import { orderController } from "../controllers/orderController";
import { tallyController } from "../controllers/tallyController";
import { warehouseController } from "../controllers/warehouseController";
import { dashboardController } from "../controllers/dashboardController";
import { itemTypeController } from "../controllers/itemTypeController";
import { customerController } from "../controllers/customerController";
import { uploadController } from "../controllers/uploadController";
import { authenticateToken, adminOnly } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();

// Auth (public)
router.post("/auth/login", adminController.login);
router.post("/auth/refreshToken", adminController.refreshToken);
router.post("/auth/logout", adminController.logout);

// Public routes - Products and Categories (GET only, no auth required)
router.get("/products", productController.getAll);
router.get("/products/:id", productController.getById);
router.get("/categories", categoryController.getAll);
router.get("/categories/:id", categoryController.getById);

// All other admin routes require authentication and admin role
router.use(authenticateToken);
router.use(adminOnly);

// Upload product images to Cloudinary
router.post("/upload", upload, uploadController.upload);

// Users (admin only)
router.get("/users", userController.getAll);
router.get("/users/:id", userController.getById);
router.put("/users/:id", userController.update);
router.delete("/users/:id", userController.delete);

// Products (POST, PUT, DELETE require admin)
router.post("/products", productController.create);
router.put("/products/:id", productController.update);
router.delete("/products/:id", productController.delete);

// Categories (POST, PUT, DELETE require admin)
router.post("/categories", categoryController.create);
router.put("/categories/:id", categoryController.update);
router.delete("/categories/:id", categoryController.delete);

// Orders
router.get("/orders", orderController.getAll);
router.get("/orders/:id", orderController.getById);
router.put("/orders/:id/status", orderController.updateStatus);

// Tally
router.get("/tally", tallyController.getAll);
router.get("/tally/:id", tallyController.getById);
router.post("/tally", tallyController.create);
router.put("/tally/:id", tallyController.update);
router.delete("/tally/:id", tallyController.delete);

// Warehouse
router.get("/warehouse", warehouseController.getAll);
router.get("/warehouse/low-stock", warehouseController.getLowStock);
router.get("/warehouse/:id", warehouseController.getById);
router.post("/warehouse", warehouseController.create);
router.put("/warehouse/:id", warehouseController.update);
router.delete("/warehouse/:id", warehouseController.delete);

// Dashboard
router.get("/dashboard/kpi", dashboardController.getKPI);
router.get("/dashboard/sales", dashboardController.getDailySales);
router.get("/dashboard/report", dashboardController.getReport);

// Item Types (for autocomplete suggestions)
router.get("/item-types", itemTypeController.getAll);
router.get("/item-types/search", itemTypeController.search);
router.post("/item-types", itemTypeController.create);
router.delete("/item-types/:id", itemTypeController.delete);

// Customers (name + phone for tally autocomplete)
router.get("/customers/search", customerController.search);
router.post("/customers", customerController.create);

export default router;
