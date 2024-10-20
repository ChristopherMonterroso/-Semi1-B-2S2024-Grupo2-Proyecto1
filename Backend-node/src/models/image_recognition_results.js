const { DataTypes } = require("sequelize");
const { db } = require("../config/db");
const User = require("./user");

const ImageRecognitionResult = db.define("ImageRecognitionResult", {
  result_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  file_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  recognition_result: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  processed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "image_recognition_results",
  timestamps: false,
});
ImageRecognitionResult.belongsTo(User, { foreignKey: 'user_id' });
module.exports = ImageRecognitionResult;
