const { DataTypes } = require("sequelize");
const { db } = require("../config/db");
const User = require("./user");

const Schedule = db.define("Schedule", {
  schedule_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  course_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  professor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  event_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: "schedules",
  timestamps: false,
});
Schedule.belongsTo(User, { foreignKey: 'user_id' });
module.exports = Schedule;
