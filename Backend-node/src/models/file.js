const { DataTypes } = require("sequelize");
const { db } = require("../config/db");
const User = require("./user");

const File = db.define("File", {
  file_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  file_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  s3_path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "files",
  timestamps: false,
});
File.belongsTo(User, { foreignKey: 'user_id' });
module.exports = File;
