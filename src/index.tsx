import "./styles.less";
import {Component, h, render} from "preact";

interface ITriflesOptions {
    configUrl: string;
    listFilesUrl: string;
    onSelectRoot: (x: {root: ITriflesRoot}) => void;
    onSelectFile: (x: {file: ITriflesFile}) => void;
}

interface ITriflesRoot {
    id: string;
    label: string;
    displayPath: string;
    type: "drive" | "location" | string;
}

interface ITriflesFile {
    id: string;
    label: string;
    displayPath: string;
    type: "file" | "folder" | string;
}

interface ITriflesConfig {
    roots: [ITriflesRoot];
    selectedRoot: ITriflesRoot;
    files: [ITriflesFile];
}

export default class Trifles extends Component<any, any> {

    public static create(element: Element, wOptions: ITriflesOptions | {} = {}) {
        render((
            <Trifles options={wOptions} />
        ), element || document.body);
    }

    private options: ITriflesOptions;

    constructor({options: options}: {options: ITriflesOptions}) {
        super();

        this.options = {
            configUrl: "http://localhost:3000/config",
            listFilesUrl: "http://localhost:3000/list_files?id=",
            ...options
        };

        this.load();
    }

    public render({}, { roots, files, selectedRoot, displayFilePath }: any) {
        return (
            <div class="trifles">
                <div class="trifles__header">
                    {this.renderFullPath(displayFilePath)}
                </div>

                <div class="trifles__content">
                    <ul class="trifles__left-column">
                        {this.renderRoots(roots, selectedRoot)}
                    </ul>

                    <ul class="trifles__right-column">
                        {this.renderFiles(files)}
                    </ul>
                </div>
            </div>
        );
    }

    private renderRoots(roots: [ITriflesRoot], selectedRoot: ITriflesRoot) {
        return roots && roots.map((root) => {
            return this.renderRoot(root, selectedRoot);
        });
    }

    private renderRoot(root: ITriflesRoot, selectedRoot: ITriflesRoot) {
        return (
            <li
                onClick={() => {this.selectRoot(root); }}
                className={this.getRootCssClass(selectedRoot, root)}
            >
                <span class="trifles__root__label">
                    {root.label}
                </span>
            </li>
        );
    }

    private renderFiles(files: [ITriflesFile]) {
        return files && files.map((file, index) => {
            return this.renderFile(file);
        });
    }

    private renderFile(file: ITriflesFile) {
        return (
            <li
                onClick={() => {this.selectFile(file); }}
                className={this.getFileCssClass(file)}
            >
                <span class="trifles__file__label">
                    {file.label}
                </span>
            </li>
        );
    }

    private load() {
        fetch(this.options.configUrl).then((response) => {
            response.json().then((config: ITriflesConfig) => {
                const selectedRoot = config.selectedRoot;
                this.setState({
                    roots: config.roots,
                    files: config.files,
                    selectedRoot: selectedRoot,
                    displayFilePath: selectedRoot.displayPath
                });
            });
        });
    }

    private getRootCssClass(selectedRoot: ITriflesRoot, root: ITriflesRoot) {
        let classes = "trifles__item trifles__root";

        if (root.type) {
            classes += (" trifles__root__is-" + root.type);
        }

        if (selectedRoot.id === root.id) {
            classes += " trifles__root__is-selected";
        }

        return classes;
    }

    private getFileCssClass(file: ITriflesFile) {
        let classes = "trifles__item trifles__file";

        if (file.type) {
            classes += (" trifles__file__is-" + file.type);
        }

        return classes;
    }

    private selectRoot(root: ITriflesRoot) {
        this.setState({
            selectedRoot: root,
            displayFilePath: root.displayPath
        });
        this.fetchFiles(root);

        if (this.options.onSelectRoot) {
            this.options.onSelectRoot({
                root: root
            });
        }
    }

    private selectFile(file: ITriflesFile) {
        if (file.type === "folder") {
            this.setState({displayFilePath: file.displayPath});
            this.fetchFiles(file);
        }

        if (this.options.onSelectFile) {
            this.options.onSelectFile({
                file: file
            });
        }
    }

    private fetchFiles(file: ITriflesFile) {
        fetch(this.options.listFilesUrl + file.id).then((response) => {
            response.json().then((data) => {
                this.setState({files: data.files});
            });
        });
    }

    private renderFullPath(displayFilePath: string) {
        return (
            <div>
                {displayFilePath}
            </div>
        );
    }
}
