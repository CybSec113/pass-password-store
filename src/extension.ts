// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { PassTreeProvider } from './passTree/tree-data';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "pass-password-store" is now active!');

	//vscode.window.createTreeView('passTree', {
	// 	treeDataProvider: new PassTreeProvider()
	// });

	// register the password-store tree data provider
	// const rootPath =
	// 	vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
	// 	? vscode.workspace.workspaceFolders[0].uri.fsPath
	// 	: undefined;
	vscode.window.createTreeView('passTree', {
		treeDataProvider: new PassTreeProvider()
	});

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('passGetFiles', () => {
		vscode.window.showInformationMessage('passGetFiles command invoked');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
