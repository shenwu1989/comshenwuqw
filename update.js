// 远程更新
events.broadcast.on("app_update", function (update_version) {
  var commonStorage = storages.create("shenwu1989@gmail.com" + "ui");
  try {
    // 获取项目路径 默认为工具箱APP的路径 如果要更新其他APP 请修改
    let projectPath = files.cwd();
    // 设置本地临时更新路径
    let tempUpdatePath = "/sdcard/appSync/tempUpdateTools/";
    // 创建临时更新js目录
    files.createWithDirs(tempUpdatePath);
    // 可替换为本地目录下载目录  注意zip压缩包,请在文件目录下全选文件压缩
    let url = "http://test.zanxiangnet.com/apk/com.shenwu.qw.m.zip";
    toastLog(url + "开始下载");
    // 请求压缩包
    let r = http.get(url);
    if (r.statusCode == 200) {
      let zipPath = tempUpdatePath + "com.shenwu.qw.m.zip";
      files.remove(zipPath);
      // 下载压缩包到本地临时更新路径
      var content = r.body.bytes();
      files.writeBytes(zipPath, content);
      toastLog(zipPath + "下载成功！！！");
      // 解压下载文件到 项目路径  为防止误操作 请放开注释后再执行
      console.log("解压到===>", projectPath);
      $zip.unzip(zipPath, projectPath);
      toastLog("热更新成功,请重启APP后生效！");
      toastLog("重启脚本====>");
      // 重启脚本
      console.hide();
      events.broadcast.emit("restart_script");
    } else {
      toastLog(url + "下载失败！！！");
    }
  } catch (error) {
    console.log("远程更新错误===>", error);
  }
});

//保持脚本运行
setInterval(() => {}, 1000);
