import "./styles.less";
import {Component, h, render} from "preact";

export default class FileSelector extends Component<any, any> {

    constructor() {
        super();

        this.options = FileSelector.options;

        this.load();
    }

    private options: any;
    private static options: any;

    public static init(options: any = {}) {
        FileSelector.options = {
            configUrl: options.configUrl || "http://localhost:3000/config",
            listFilesUrl: options.listFilesUrl || "http://localhost:3000/list_files?id=",
            onSelectRoot: options.onSelectRoot,
            onSelectFile: options.onSelectFile,
            apiKey: "xxx123xxx"
        };

        render((
            <FileSelector />
        ), options.element || document.body);
    }

    public render({}, { roots, files, selectedRoot, displayFilePath }) {
        return (
            <div class="file-selector">
                <div class="file-selector__header">
                    {this.renderFullPath(displayFilePath)}
                </div>

                <div class="file-selector__content">
                    <ul class="file-selector__left-column">
                        {this.renderRoots(roots, selectedRoot)}
                    </ul>

                    <ul class="file-selector__right-column">
                        {this.renderFiles(files)}
                    </ul>
                </div>
            </div>
        );
    }

    private renderRoots(roots, selectedRoot) {
        return roots && roots.map((root, index) => {
            return this.renderRoot(root, selectedRoot);
        });
    }

    private renderRoot(root, selectedRoot) {
        return (
            <li
                onClick={() => {
                    this.selectRoot(root)
                }}
                className={
                    this.getRootCssClass(selectedRoot, root)
                }
            >
                <span class="file-selector__root__label">
                    {root.label}
                </span>
            </li>
        );
    }

    private renderFiles(files) {
        return files && files.map((file, index) => {
            return this.renderFile(file);
        });
    }

    private renderFile(file) {
        return (
            <li
                onClick={() => {
                    this.selectFile(file)
                }}
                className={
                    this.getFileCssClass(file)
                }
            >
                <span class="file-selector__file__label">
                    {file.label}
                </span>
            </li>
        );
    }

    private load() {
        fetch(this.options.configUrl).then((response) => {
            response.json().then((config) => {
                let selectedRoot = config.selectedRoot;
                this.setState({
                    roots: config.roots,
                    files: config.files,
                    selectedRoot: selectedRoot,
                    displayFilePath: selectedRoot.displayPath
                });
            });
        });
    }

    private getRootCssClass(selectedRoot, root) {
        let classes = "file-selector__item file-selector__root";

        if (root.type) {
            classes += (" file-selector__root__is-" + root.type);
        }

        if (selectedRoot.id == root.id) {
            classes += " file-selector__root__is-selected";
        }

        return classes;
    }
    
    private getFileCssClass(file) {
        let classes = "file-selector__item file-selector__file";

        if (file.type) {
            classes += (" file-selector__file__is-" + file.type);
        }

        return classes;
    }

    private selectRoot(root: any) {
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

    private selectFile(file: any) {
        if (!file.isFile) {
            this.setState({displayFilePath: file.displayPath});
            this.fetchFiles(file)
        }

        if (this.options.onSelectFile) {
            this.options.onSelectFile({
                file: file
            });
        }
    }

    private fetchFiles(file) {
        fetch(this.options.listFilesUrl + file.id).then((response) => {
            response.json().then((data) => {
                this.setState({files: data.files});
            });
        });
    }

    private renderFullPath(displayFilePath) {
        return (
            <div>
                {displayFilePath}
            </div>
        );
    }
}
