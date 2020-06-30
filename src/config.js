// 用于记录已发表的博客信息字段名
export const FM_KEY = "_publish_blog_";


import * as vscode from "vscode";


// 配置文件的信息, 如果是默认信息, 则表示不支持该平台
// cookie 信息
const cookie = vscode.workspace.getConfiguration().get("publish-blog.cookie");

// 个人主页
const mainPage = vscode.workspace
  .getConfiguration()
  .get("publish-blog.mainPage");