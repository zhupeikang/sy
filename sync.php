<?php
if ($argc < 2) {
    exit('请输入需要构建的版本，如：php build.php test');
}
$env = $argv[1];
$envs = [
    'test' => [
        'dir' => '/mnt/h/build/sylf/shiyuan-test',
    ],
    'pro' => [
        'dir' => 'mnt/h/build/sylf/shiyuan',
    ],
];
if (!isset($envs[$env])) {
    exit('不支持当前环境');
}
$config = $envs[$env];
// echo '删除目录：' . $config['dir'] . "\n";
// @deldir($config['dir']);
echo "复制当前目录\n";
//复制当前目录过去
recurse_copy('dist-' . $env, $config['dir']);

$res = system('.\\command\\' . $env . '-git.bat');
// $res = system('.\\command\\' . $env . '-sync.bat');
/**
 * 复制目录
 *
 * @param string $src 原目录
 * @param string $dst 新目录
 * @return void
 */
function recurse_copy($src, $dst)
{

    $dir = opendir($src);
    @mkdir($dst);
    while (false !== ($file = readdir($dir))) {
        if (($file != '.') && ($file != '..')) {
            if (is_dir($src . '/' . $file)) {
                recurse_copy($src . '/' . $file, $dst . '/' . $file);
            } else {
                copy($src . '/' . $file, $dst . '/' . $file);
            }
        }
    }
    closedir($dir);
}

function deldir($dir)
{
    //先删除目录下的文件：
    $dh = opendir($dir);
    while ($file = readdir($dh)) {
        if ($file != "." && $file != ".." && $file != '.git' && $file != '.gitignore' && $file!='.htaccess' &&$file!='nginx.htaccess') {
            $fullpath = $dir . "/" . $file;
            if (!is_dir($fullpath)) {
                unlink($fullpath);
            } else {
                deldir($fullpath);
            }
        }
    }
    closedir($dh);

    //删除当前文件夹：
    if (rmdir($dir)) {
        return true;
    } else {
        return false;
    }
}
