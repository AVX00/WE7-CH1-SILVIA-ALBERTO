const { model, Schema } = require("mongoose");

const PlatformSchema = new Schema({
  name: { type: String, required: true },
  series: { type: Array },
});

const Platform = model("Platform", PlatformSchema, "platforms");

module.exports = Platform;
