const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ['pendente', 'em_andamento', 'concluida'],
      default: 'pendente',
    },
    priority: {
      type: String,
      enum: ['baixa', 'media', 'alta'],
      default: 'media',
    },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    dueDate: Date,
  },
  { timestamps: true }
);

const task = mongoose.model('Task', taskSchema);

module.exports = task;
