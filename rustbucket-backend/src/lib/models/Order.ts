import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true }, // snapshot at purchase time
    price: { type: Number, required: true }, // snapshot at purchase time
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

export type DeliveryAddress = {
  fullName?: string;
  street?: string;
  city?: string;
  postcode?: string;
};

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true },
    deliveryAddress: {
      fullName: String,
      street: String,
      city: String,
      postcode: String,
    },
    // Demo/prototype checkout — never store real card numbers. Only the
    // last 4 digits, same as any real payment processor would hand back.
    cardLast4: { type: String, default: "" },
    status: {
      type: String,
      enum: ["confirmed", "packed", "dispatched", "delivered"],
      default: "confirmed",
    },
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
