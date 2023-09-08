import * as vscode from "vscode";
import { accessSync, readFileSync } from "fs";
import * as path from "path";

export const pathExists = (p: string, rootPath: string) => {
  try {
    accessSync(path.join(rootPath, p));
  } catch {
    return false;
  }
  return true;
};

export const getNodeConfigJson = (rootPath: string) => {
  let nodeConfigJson;
  if (pathExists("node.config.json", rootPath)) {
    const jsonStr = readFileSync(
      path.join(rootPath, "node.config.json"),
      "utf-8"
    );
    try {
      nodeConfigJson = JSON.parse(jsonStr);
    } catch (error) {
      vscode.window.showErrorMessage("node.config.json parse error");
    }
  }
  return nodeConfigJson;
};

export const buildScriptText = (script: string, rootPath: string) => {
  const scripts = [];

  if (pathExists("yarn.lock", rootPath)) {
    scripts.push(`yarn ${script}`);
  } else if (pathExists("pnpm-lock.yaml", rootPath)) {
    scripts.push(`pnpm run ${script}`);
  } else {
    scripts.push(`npm run ${script}`);
  }

  return scripts.join(" && ");
};
