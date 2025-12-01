const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: ""},
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const project = mongoose.model('Project', projectSchema);

module.exports = project;
