import { Router } from "express";
import { adminController } from "../controllers/adminController";
import { userController } from "../controllers/userController";
import { productController } from "../controllers/productController";
import { categoryController } from "../controllers/categoryController";
import { orderController } from "../controllers/orderController";
import { tallyController } from "../controllers/tallyController";
import { warehouseController } from "../controllers/warehouseController";
import { dashboardController } from "../controllers/dashboardController";

const router = Router();

// Auth
router.post("/auth/login", adminController.login);

// Users
router.get("/users", userController.getAll);
router.get("/users/:id", userController.getById);
router.put("/users/:id", userController.update);
router.delete("/users/:id", userController.delete);

// Products
router.get("/products", productController.getAll);
router.get("/products/:id", productController.getById);
router.post("/products", productController.create);
router.put("/products/:id", productController.update);
router.delete("/products/:id", productController.delete);

// Categories
router.get("/categories", categoryController.getAll);
router.get("/categories/:id", categoryController.getById);
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

export default router;
