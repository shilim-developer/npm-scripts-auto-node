import * as vscode from "vscode";
import { NpmScriptsProvider } from "./NpmScriptsProvider";
import { buildScriptText, getNodeConfigJson, pathExists } from "./utils";

export function activate(context: vscode.ExtensionContext) {
  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : "";

  vscode.commands.executeCommand(
    "setContext",
    "workspaceHasNodeConfigJSON",
    pathExists("node.config.json", rootPath)
  );

  const npmScriptsProvider = new NpmScriptsProvider(
    vscode.workspace.workspaceFolders
  );

  vscode.window.createTreeView("npm-scripts-auto-node.npmScripts", {
    treeDataProvider: npmScriptsProvider,
  });

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "npm-scripts-auto-node.runScripts",
      async ({ path: rootPath, label }) => {
        // script脚本
        const scriptTask = new vscode.Task(
          {
            type: "shell",
          },
          vscode.TaskScope.Global,
          label,
          "npm",
          new vscode.ShellExecution(buildScriptText(label, rootPath), {
            cwd: rootPath,
          })
        );

        // switch node version脚本
        let changeNodeTask;
        const nodeConfigJson = getNodeConfigJson(rootPath);
        if (nodeConfigJson) {
          changeNodeTask = new vscode.Task(
            { type: "shell" },
            vscode.TaskScope.Global,
            "switch node version",
            "npm",
            new vscode.ShellExecution(nodeConfigJson.script, {
              cwd: rootPath,
            })
          );
        }

        // 判断是否已运行
        let runningTask = null;
        for (const taskExecution of vscode.tasks.taskExecutions) {
          if (taskExecution.task.definition.id === scriptTask.definition.id) {
            runningTask = taskExecution;
            break;
          }
        }
        if (runningTask) {
          const result = await vscode.window.showInformationMessage(
            "The task is currently running. Would you like to restart?",
            "Yes",
            "No"
          );
          if (result === "Yes") {
            runningTask.terminate();
          } else {
            return;
          }
        }

        if (changeNodeTask) {
          const taskExecution = await vscode.tasks.executeTask(changeNodeTask);
          // 任务结束监听
          vscode.tasks.onDidEndTaskProcess((e) => {
            if (e.execution === taskExecution) {
              vscode.tasks.executeTask(scriptTask);
            }
          });
        } else {
          vscode.tasks.executeTask(scriptTask);
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "npm-scripts-auto-node.refreshScripts",
      npmScriptsProvider.refresh.bind(npmScriptsProvider)
    ),
    vscode.commands.registerCommand(
      "npm-scripts-auto-node.openTerminal",
      () => {
        const terminal = vscode.window.createTerminal("Auto Node Terminal");
        // 向终端发送命令
        const nodeConfigJson = getNodeConfigJson(rootPath);
        if (nodeConfigJson) {
          terminal.sendText(nodeConfigJson.script);
        }
        terminal.show();
      }
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
