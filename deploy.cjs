const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

// 获取传入的环境参数
const args = process.argv.slice(2); // 获取传入的参数，如 'test' 或 'prod'
const environment = args[0]; // 第一个参数作为环境标识

if (!environment) {
    console.log('请传入环境参数，如 test 或 prod');
    process.exit(1);
}

// 根据环境拼接文件夹和 .bat 文件名
const distFolder = `dist-${environment}`; // 拼接文件夹名
const batFile = `bat-${environment}.bat`; // 拼接 bat 文件名
const shFile = `sh-${environment}.sh`; // 拼接 sh 文件名（Linux 使用）

// 目标路径设置
const targetPath = path.resolve('/mnt/g', 'build', 'f-sylf.zhizhangame.com');  // 这里是指定的目标路径

// 删除目标路径下的文件或文件夹，排除某些文件
const deleteFolderContents = (dirPath) => {
    if (fs.existsSync(dirPath)) {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });

        entries.forEach(entry => {
            const entryPath = path.join(dirPath, entry.name);

            // 排除特定文件或文件夹
            if (entry.name !== '.' && entry.name !== '..' &&
                entry.name !== '.git' && entry.name !== '.gitignore' &&
                entry.name !== '.htaccess' && entry.name !== 'nginx.htaccess') {

                if (entry.isDirectory()) {
                    // 递归删除子文件夹
                    deleteFolderContents(entryPath);
                    fs.rmdirSync(entryPath); // 删除空文件夹
                } else {
                    fs.unlinkSync(entryPath); // 删除文件
                }
            }
        });
    }
};

// 删除目标路径下所有内容，排除指定文件
deleteFolderContents(targetPath);

// 复制文件夹内容到目标路径
const copyFolder = (source, destination) => {
    const entries = fs.readdirSync(source, { withFileTypes: true });

    entries.forEach(entry => {
        const srcPath = path.join(source, entry.name);
        const destPath = path.join(destination, entry.name);

        if (entry.isDirectory()) {
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath, { recursive: true });
            }
            copyFolder(srcPath, destPath); // 递归复制子文件夹
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
};

// 执行文件复制
const distPath = path.resolve(__dirname, distFolder);
if (fs.existsSync(distPath)) {
    copyFolder(distPath, targetPath);
    console.log(`${distFolder} 复制完成到 ${targetPath}`);
} else {
    console.log(`${distFolder} 文件夹不存在，请检查`);
    process.exit(1);
}

// 执行对应的脚本
const executeScript = () => {
    const platform = process.platform;
    if (platform === 'win32') {
        // 在 Windows 系统中执行 .bat 文件
        const batFilePath = path.resolve(__dirname, batFile);
        if (fs.existsSync(batFilePath)) {
            console.log(`正在执行 Windows 下的 ${batFile} ...`);
            // 切换到目标路径并执行 .bat 文件
            process.chdir(targetPath); // 切换到目标文件夹
            child_process.execSync(`cmd.exe /c "${batFilePath}"`, { stdio: 'inherit' });
        } else {
            console.log(`${batFile} 文件不存在，请检查`);
            process.exit(1);
        }
    } else if (platform === 'linux') {
        // 在 Linux 系统中执行 .sh 文件
        const shFilePath = path.resolve(__dirname, shFile);
        if (fs.existsSync(shFilePath)) {
            console.log(`正在执行 Linux 下的 ${shFile} ...${targetPath}`);
            // 确保脚本具有执行权限
            const chmodCommand = `chmod +x ${shFilePath}`;
            try {
                child_process.execSync(chmodCommand, { stdio: 'inherit' });
                console.log(`为脚本 ${shFilePath} 添加了执行权限`);
            } catch (error) {
                console.error(`为脚本添加执行权限失败: ${error.message}`);
                process.exit(1);
            }
            // 切换到目标路径并执行 .sh 文件
            process.chdir(targetPath); // 切换到目标文件夹

            try {
                // 执行脚本（同步）
                const result = child_process.execSync(`${shFilePath}`, { stdio: 'inherit', maxBuffer: 1024 * 1024*100 });
                // 输出脚本执行的结果
                console.log('脚本执行成功：\n', result.toString());
            } catch (error) {
                console.log(error);
                // 捕获错误并打印
                console.error('执行脚本时出错：\n', error.message);
            }

        } else {
            console.log(`${shFile} 文件不存在，请检查`);
            process.exit(1);
        }
    } else {
        console.log('不支持当前平台的脚本执行');
        process.exit(1);
    }
};

// 调用执行脚本函数
// executeScript();
