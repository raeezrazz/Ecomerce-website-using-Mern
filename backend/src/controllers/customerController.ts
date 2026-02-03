import { Request, Response } from "express";
import { customerService } from "../services/customerService";

export const customerController = {
  async search(req: Request, res: Response) {
    try {
      const { q } = req.query;
      const query = typeof q === "string" ? q : "";
      const customers = await customerService.searchCustomers(query);
      res.json(
        customers.map((c) => ({
          id: c._id.toString(),
          name: c.name,
          phone: c.phone,
        }))
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Server error";
      res.status(500).json({ error: message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { name, phone } = req.body;
      if (!name || !String(name).trim()) {
        return res.status(400).json({ error: "Name is required" });
      }
      if (!phone || !String(phone).trim()) {
        return res.status(400).json({ error: "Phone is required" });
      }
      const customer = await customerService.createCustomer(
        String(name).trim(),
        String(phone).trim()
      );
      res.status(201).json({
        id: customer._id.toString(),
        name: customer.name,
        phone: customer.phone,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Server error";
      if (
        message === "Customer with this name and phone already exists" ||
        message === "Phone must be 10 digits"
      ) {
        return res.status(409).json({ error: message });
      }
      res.status(400).json({ error: message });
    }
  },
};
