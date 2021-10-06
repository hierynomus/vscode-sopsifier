import * as vscode from 'vscode';
import * as cp from "child_process";

interface SopsProps {

}

const channel = vscode.window.createOutputChannel("Sops");

class Sops implements SopsProps {
    encrypt(): Promise<string> {
        let args = this.buildArgs();
        args.push("-e");
        args.push("/dev/stdin");
        return this.exec(args);
    }

    decrypt(): Promise<string> {
        let args = this.buildArgs();
        args.push("-d");
        args.push("/dev/stdin");
        return this.exec(args);
    }

    private exec(args: string[]): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            var child = cp.spawn("sops", args);
            child.stdin.write(this.getContents());
            child.stdin.end();
            child.stdout.on("data", (data) => {
                resolve(data.toString());
            });
            child.stderr.on("data", (data) => {
                channel.append("Error: " + data.toString());
                reject(data.toString());
            });
            child.on("close", (code) => {
                channel.appendLine("child process exited with code " + code);
            });
        });
    }

    private buildArgs(): string[] {
        const args: string[] = [];

        const fileType = this.getFileType();
		args.push("--input-type");
		args.push(fileType);
		args.push("--output-type");
        args.push(fileType);
        this.appendKeyIfConfigured(args);

        return args;
    }

    private appendKeyIfConfigured(args: string[]) {
        const config = vscode.workspace.getConfiguration("sops");
        if (config.has("keys.aws")) {
            let awsKey = config.get<string>("keys.aws.kms");
            if (awsKey) {
                args.push("--kms");
                args.push(awsKey);
            }

            let awsProfile = config.get<string>("keys.aws.profile");
            if (awsProfile) {
                args.push("--aws-profile");
                args.push(awsProfile);
            }
        }
    }

    private getContents(): string {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            return "";
        }

        return activeEditor.document.getText();
    }

    private getFileType(): string {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            return "";
        }

        return activeEditor.document.languageId;
    }
}

export { Sops };
