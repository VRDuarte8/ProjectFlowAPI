const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    status: {
      type: String,
      enum: ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA'],
      default: 'PENDENTE',
    },
    priority: {
      type: String,
      enum: ['BAIXA', 'MEDIA', 'ALTA'],
      default: 'MEDIA',
    },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    dueDate: Date,
  },
  { timestamps: true }
);

const task = mongoose.model('Task', taskSchema);

module.exports = task;
