// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as cp from "child_process";
import { Sops } from './sops/sops';

function sopsify(f: (s: Sops) => Promise<string>): () => Promise<void> {
	return () => new Promise<void>((resolve, reject) => {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			reject("No Active editor");
			return;
		}

		const document = activeEditor.document;
		f(new Sops())
			.then(result =>
				activeEditor.edit(editBuilder => {
					editBuilder.replace(document.validateRange(new vscode.Range(0, 0, document.lineCount, 0)), result);
				})
		).then((r) => { if (r) { resolve(); } else { reject("SOPS: Could not replace contents"); }}, (err) => reject(err));
	});
}

function register(ctx: vscode.ExtensionContext, id: string, callback: () => Promise<void>) {
	let disposable = vscode.commands.registerCommand(id, callback);
	ctx.subscriptions.push(disposable);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	register(context, 'sopsifier.encrypt', sopsify((s: Sops) => s.encrypt()));
	register(context, 'sopsifier.decrypt', sopsify((s: Sops) => s.decrypt()));
}

// this method is called when your extension is deactivated
export function deactivate() {}
