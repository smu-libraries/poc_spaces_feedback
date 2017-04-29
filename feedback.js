let sequelize = require('sequelize');

let db = new sequelize('poc_spaces_feedback', null, null, {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'poc_spaces_feedback.db'
});

module.exports = (db, DataTypes) => {
  return db.define('feedback', {
    _id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    app_id: DataTypes.STRING,
    rating: DataTypes.STRING,
    comment: { type: DataTypes.STRING, allowNull: true }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};

db.sync();
