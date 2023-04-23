import { Sequelize } from "sequelize";
var userModel = require("../src/models/user");
var postModel = require("../src/models/post");
var postTagModel = require("../src/models/post_tag");
var tagModel = require("../src/models/tag");
var likeModel = require("../src/models/like");
var chatLogModel = require("../src/models/chat_log");
var noticeModel = require("../src/models/notice");
var fileModel = require("../src/models/file");
var commentModel = require("../src/models/comment");
var alarmModel = require("../src/models/alarm");

function initModels(sequelize: Sequelize) {
  var user = userModel(sequelize);
  var post = postModel(sequelize);
  var post_tag = postTagModel(sequelize);
  var tag = tagModel(sequelize);
  var like = likeModel(sequelize);
  var chat_log = chatLogModel(sequelize);
  var notice = noticeModel(sequelize);
  var file = fileModel(sequelize);
  var comment = commentModel(sequelize);
  var alarm = alarmModel(sequelize);

  like.belongsTo(user, { foreignKey: "user_id", as: "user" });
  user.hasMany(like, { foreignKey: "user_id", as: "like" });
  post.belongsTo(user, { foreignKey: "user_id", as: "user" });
  user.hasMany(post, { foreignKey: "user_id", as: "post" });
  post_tag.belongsTo(post, { foreignKey: "post_id", as: "post" });
  post.hasMany(post_tag, { foreignKey: "post_id", as: "post_tag" });
  post_tag.belongsTo(tag, { foreignKey: "tag_id", as: "tag" });
  tag.hasMany(post_tag, { foreignKey: "tag_id", as: "post_tag" });
  like.belongsTo(post, { foreignKey: "post_id", as: "post" });
  post.hasMany(like, { foreignKey: "post_id", as: "like" });
  notice.belongsTo(user, { foreignKey: "user_id", as: "user" });
  user.hasMany(notice, { foreignKey: "user_id", as: "notice" });
  file.belongsTo(post, { foreignKey: "post_id", as: "post" });
  post.hasMany(file, { foreignKey: "post_id", as: "file" });
  file.belongsTo(user, { foreignKey: "user_id", as: "user" });
  user.hasMany(file, { foreignKey: "user_id", as: "file" });
  comment.belongsTo(user, { foreignKey: "user_id", as: "user" });
  user.hasMany(comment, { foreignKey: "user_id", as: "comment" });
  comment.belongsTo(post, { foreignKey: "post_id", as: "post" });
  post.hasMany(comment, { foreignKey: "post_id", as: "comment" });
  alarm.belongsTo(user, { foreignKey: "user_id", as: "user" });
  user.hasMany(alarm, { foreignKey: "user_id", as: "alarm" });
  alarm.belongsTo(comment, { foreignKey: "comment_id", as: "comment" });
  comment.hasOne(alarm, { foreignKey: "comment_id", as: "alarm" });

  return {
    user,
    post,
    post_tag,
    tag,
    like,
    chat_log,
    notice,
    file,
    comment,
    alarm,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
