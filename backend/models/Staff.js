import mongoose from "mongoose";
const staffSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});
export default mongoose.model("Staff", staffSchema);
