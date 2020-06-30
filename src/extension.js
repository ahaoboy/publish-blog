// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// const vscode = require("vscode");
import * as vscode from "vscode";

import publishAll from "./platform";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "publish-blog" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "publish-blog.publish",
    async function ({ fsPath }) {
      let { code } = await publishAll(fsPath);
      // The code you place here will be executed every time your command is executed
      if (code === 1) {
        vscode.window.showInformationMessage("发布成功");
      } else {
        vscode.window.showErrorMessage("发布失败");
      }
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
