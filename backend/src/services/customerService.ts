import { Customer, ICustomer } from "../models/customer";

class CustomerService {
  async searchCustomers(query: string): Promise<ICustomer[]> {
    if (!query || query.trim().length === 0) {
      return await Customer.find().sort({ name: 1 }).limit(15);
    }
    const searchRegex = new RegExp(query.trim(), "i");
    return await Customer.find({ name: searchRegex })
      .sort({ name: 1 })
      .limit(15);
  }

  async createCustomer(name: string, phone: string): Promise<ICustomer> {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim().replace(/\D/g, "");
    if (!trimmedName || !trimmedPhone) {
      throw new Error("Name and phone are required");
    }
    if (trimmedPhone.length !== 10) {
      throw new Error("Phone must be 10 digits");
    }
    const existing = await Customer.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
      phone: trimmedPhone,
    });
    if (existing) {
      throw new Error("Customer with this name and phone already exists");
    }
    const customer = new Customer({
      name: trimmedName,
      phone: trimmedPhone,
    });
    return await customer.save();
  }
}

export const customerService = new CustomerService();
