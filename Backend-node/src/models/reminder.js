const { DataTypes } = require("sequelize");
const { db } = require("../config/db");
const Task = require("./task");

const Reminder = db.define("Reminder", {
  reminder_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reminder_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: "reminders",
  timestamps: false,
});
Reminder.belongsTo(Task, { foreignKey: 'task_id' });
module.exports = Reminder;
