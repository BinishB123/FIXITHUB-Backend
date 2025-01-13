import { Schema, model } from "mongoose";

interface Ibrand {
  brand: string;
}

const brandSchema = new Schema<Ibrand>({
  brand: { type: String, required: true },
});

const brandModel = model("brand", brandSchema);
export default brandModel;
