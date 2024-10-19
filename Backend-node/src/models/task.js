const { DataTypes } = require("sequelize");
const { db } = require("../config/db");
const User = require("./user");

const Task = db.define("Task", {
  task_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM('alta', 'media', 'baja'),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pendiente', 'en progreso', 'completada'),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "tasks",
  timestamps: false,
});
Task.belongsTo(User, { foreignKey: 'user_id' });
module.exports = Task;
