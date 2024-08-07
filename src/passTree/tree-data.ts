import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { readdir } from 'node:fs/promises';

export class PassTreeProvider implements vscode.TreeDataProvider<PassTreeItem> {
    //onDidChangeTreeData?: vscode.Event<void | PassTreeItem | PassTreeItem[] | null | undefined> | undefined;

    private _passTree = new Array<PassTreeItem>();
    private _passdir = String();

    constructor() {
        // TODO: make this a setting in the extension
        this._passdir = path.normalize('/Users/jnn/Devel/VSCodeExt/pass-password-store/.password-store');
        vscode.window.showInformationMessage("password-store directory: ", this._passdir);
        console.debug('pass dir: ', this._passdir);
        this.getFiles();
    }

    getTreeItem(element: PassTreeItem): vscode.TreeItem|Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: PassTreeItem): vscode.ProviderResult<PassTreeItem[]> {
        if(element === undefined) {
            console.debug('get children undefined');
            return this._passTree;
        }
        console.debug('get children');
        return element.children;
    }

    private async getFiles() {
        try {
            console.debug('Getting files from ', this._passdir);
            const files = await readdir(this._passdir, { recursive: true });
            this.makeTree(files);
        } catch (err) {
            console.error(err);
        }
    }

    private makeTree(files: string[]) {
        for (var file of files) {
            if(file[0] === '.'){
                continue;
            }
            // console.debug('file:', file);
            var splits = file.split('/');
            if (splits.length === 1) {
                this._passTree.push(new PassTreeItem(splits[0],''));
            }
        }
        return [];
    }

    private pathExists(p: string): boolean {
        try {
            fs.accessSync(p);
        } catch (err) {
            console.error('Could not find folder: ', p);
            return false;
        }
        return true;
    }
}

class PassTreeItem extends vscode.TreeItem {
    children: PassTreeItem[] | undefined;

    constructor(
        public readonly lable: string,
        public readonly fullPath: string,
        children?: PassTreeItem[]
    ) {
        super(lable,
            children === undefined ? vscode.TreeItemCollapsibleState.None :
                                     vscode.TreeItemCollapsibleState.Collapsed);
        this.children = children;
        // this.tooltip = `${this.label}`;
        // this.description = `${this.label}`;
    }
}