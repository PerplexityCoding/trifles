const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;
const uuid = require('node-uuid');

const files = {};
const revertFiles = {};

async function get_win_drives(success_cb,error_cb){
    let stdout = "";
    const list  = spawn('cmd');

    return new Promise((success, failure) => {

        list.stdout.on('data', function (data) {
            stdout += data;
        });

        list.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });

        list.on('exit', function (code) {
            if (code == 0) {
                let data = stdout.split('\r\n');
                data = data.splice(4, data.length - 7);
                data = data.map(Function.prototype.call, String.prototype.trim);
                success(data);
            } else {
                console.log('child process exited with code ' + code);
                failure();
            }
        });

        list.stdin.write('wmic logicaldisk get caption\n');
        list.stdin.end();
    });
}

function addFile(fullPath) {
    let id = files[fullPath];
    if (id == null) {
        id = uuid.v4();
        files[fullPath] = id;
        revertFiles[id] = fullPath;
    }
    return id;
}

function getFile(id) {
    return revertFiles[id];
}

function _getFiles(fileId) {
    const dirPath = getFile(fileId);
    const filesPath = fs.readdirSync(dirPath);

    let result = [];
    for (const filePath of filesPath) {
        const fullPath = path.join(dirPath, filePath);

        try {
            let stat = fs.statSync(fullPath);

            result.push({
                id: addFile(fullPath),
                label: filePath,
                displayPath: fullPath,
                type: stat.isFile() ? "file" : "folder"
            });
        } catch (e) {
            console.log(e);
        }
    }

    result = result.sort((a, b) => {
        if (a.type == b.type) {
            if (a.label < b.label) {
                return -1;
            }
            if (a.label > b.label) {
                return 1;
            }
            return 0;
        } else {
            if (a.type == "folder") {
                return -1;
            }
            if (b.type == "folder") {
                return 1;
            }
        }
        return 0;
    });

    return result;
}

function getFiles(fileId) {
    return {
        files: _getFiles(fileId)
    };
}

async function getConfig() {

    const win_drives = await get_win_drives();

    const roots = win_drives.map((drive) => {
        let path = drive + "\\";

        return {
            label: drive.replace(':', ''),
            type: "drive",
            displayPath: path,
            id: addFile(path)
        };
    });

    const homePath = "C:\\Users\\Gori\\";
    roots.unshift({
        label: "Home",
        type: "home",
        displayPath: homePath,
        id: addFile(homePath)
    });

    return {
        roots: roots,
        selectedRoot: roots[0],
        files: _getFiles(roots[0].id)
    };
}

module.exports = {
    getFiles: getFiles,
    getConfig: getConfig
};