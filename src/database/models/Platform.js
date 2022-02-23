const { model, Schema } = require("mongoose");

const PlatformSchema = new Schema({
  name: { type: String, required: true },
  series: [{ type: Schema.Types.ObjectId, ref: "Series" }],
});

const Platform = model("Platform", PlatformSchema, "platforms");

module.exports = Platform;
