import mongoose from "mongoose";
const staffSchema = new mongoose.Schema({ name: { type: String, required: true } });
export default mongoose.model("Staff", staffSchema);
