"ui";
// =====================引入环节js====================
var commonConstant = require("./common/commonConstant.js");
var appConfig = require("./common/config.js");
var utils = require("./common/utils.js");
var qw = require("./common/qw.js");
// 公共储存对象
var commonStorage = storages.create("shenwu1989@gmail.com" + "ui");
var isJc = false;
// ====脚本变量====
var runScript = null;
var updateScript = null;
// ================UI========
ui.layout(
  <drawer id="drawer">
    <vertical>
      <appbar>
        <toolbar id="toolbar" title="秘密基地" />
        <tabs id="tabs" />
      </appbar>
      <horizontal>
        <button
          id="wzatest"
          layout_gravity="center"
          text="启动前点击"
          style="Widget.AppCompat.Button.Colored"
          bg="#ff0000"
          w="{{device.width/2}}px"
          h="150px"
          gravity="center"
          textSize="14sp"
          textColor="#ffffff"
          foreground="?selectableItemBackground"
        />
        <button
          id="startScript"
          layout_gravity="center"
          text="启动服务"
          style="Widget.AppCompat.Button.Colored"
          bg="#04a9f5"
          w="{{device.width/2}}px"
          h="150px"
          gravity="center"
          textSize="14sp"
          textColor="#ffffff"
          foreground="?selectableItemBackground"
        />
      </horizontal>
      <viewpager id="viewpager">
        <frame>
          <vertical padding="15 10" bg="#e3e0e0">
            <ScrollView h="auto" layout_weight="25">
              <vertical h="auto" layout_weight="25">
                <card
                  contentPadding="50px 20px 50px 20px"
                  cardBackgroundColor="#ffffff"
                  cardCornerRadius="15px"
                  cardElevation="15px"
                >
                  <vertical id="deiveceBaseInfo" visibility="visible">
                    <text
                      text="基本信息:"
                      textSize="22sp"
                      textColor="#210303"
                      marginBottom="5px"
                    />
                    <horizontal h="80px">
                      <text
                        text="屏幕宽度:"
                        textColor="#210303"
                        textSize="16sp"
                        h="*"
                        w="400px"
                        gravity="left|center"
                        layout_weight="1"
                      />
                      <text
                        id="屏幕宽度"
                        text="{{appConfig.phone_width}}"
                        textColor="#210303"
                        textSize="16sp"
                        h="*"
                        w="*"
                        gravity="left|center"
                        layout_weight="2"
                      />
                    </horizontal>
                    <horizontal h="80px">
                      <text
                        text="屏幕高度:"
                        textColor="#210303"
                        textSize="16sp"
                        h="*"
                        w="400px"
                        gravity="left|center"
                        layout_weight="1"
                      />
                      <text
                        id="屏幕高度"
                        text="{{appConfig.phone_height}}"
                        textColor="#210303"
                        textSize="16sp"
                        h="*"
                        w="*"
                        gravity="left|center"
                        layout_weight="2"
                      />
                    </horizontal>
                    <horizontal h="80px">
                      <text
                        text="设备UUID:"
                        textColor="#210303"
                        textSize="16sp"
                        h="*"
                        w="400px"
                        gravity="left|center"
                        layout_weight="1"
                      />
                      <text
                        id="设备UUID"
                        text="{{appConfig.uuid}}"
                        textColor="#210303"
                        textSize="16sp"
                        h="*"
                        w="*"
                        gravity="left|center"
                        layout_weight="2"
                      />
                    </horizontal>
                    <horizontal h="80px">
                      <text
                        text="当前版本号:"
                        textColor="#210303"
                        textSize="16sp"
                        h="*"
                        w="400px"
                        gravity="left|center"
                        layout_weight="1"
                      />
                      <text
                        id="app_version"
                        text="{{appConfig.app_version}}"
                        textColor="#210303"
                        textSize="16sp"
                        h="*"
                        w="*"
                        gravity="left|center"
                        layout_weight="2"
                      />
                    </horizontal>
                    <horizontal h="80px">
                      <text
                        text="最新版本号:"
                        textColor="#210303"
                        textSize="16sp"
                        h="*"
                        w="400px"
                        gravity="left|center"
                        layout_weight="1"
                      />
                      <text
                        id="sever_version"
                        text="{{appConfig.app_version}}"
                        textColor="#210303"
                        textSize="16sp"
                        h="*"
                        w="*"
                        gravity="left|center"
                        layout_weight="2"
                      />
                    </horizontal>
                    <horizontal h="80px">
                      <text
                        text="设备编号:"
                        textSize="16sp"
                        h="*"
                        w="450px"
                        gravity="left|center"
                        layout_weight="1"
                      />
                      <input
                        id="phone_number"
                        inputType="text"
                        hint="请输入手机背后贴纸编号"
                        textSize="16sp"
                        h="*"
                        w="*"
                        margin="0"
                        bg="#ffffff"
                        padding="15px 0 0 0"
                        gravity="left|center"
                        layout_weight="2"
                      />
                    </horizontal>
                    <horizontal h="80px">
                      <text
                        text="手机持有者:"
                        textSize="16sp"
                        h="*"
                        w="450px"
                        gravity="left|center"
                        layout_weight="1"
                      />
                      <input
                        id="phone_holder"
                        inputType="text"
                        hint="请输入手机持有者名称"
                        textSize="16sp"
                        h="*"
                        w="*"
                        margin="0"
                        bg="#ffffff"
                        padding="15px 0 0 0"
                        gravity="left|center"
                        layout_weight="2"
                      />
                    </horizontal>
                  </vertical>
                </card>
                <button
                  id="upDate"
                  layout_gravity="center"
                  text="APP更新"
                  style="Widget.AppCompat.Button.Colored"
                  bg="#00b96b"
                  marginTop="15px"
                  h="150px"
                  gravity="center"
                  textSize="14sp"
                  textColor="#ffffff"
                  foreground="?selectableItemBackground"
                />
                <button
                  id="logBtn"
                  layout_gravity="center"
                  text="日志"
                  h="150px"
                  style="Widget.AppCompat.Button.Colored"
                  bg="#52c41a"
                  marginTop="15px"
                  gravity="center"
                  textSize="14sp"
                  textColor="#ffffff"
                  foreground="?selectableItemBackground"
                />
                <vertical id="admin" marginTop="15px">
                  <horizontal>
                    <button
                      id="pro"
                      layout_gravity="center"
                      text="线上环境"
                      style="Widget.AppCompat.Button.Colored"
                      bg="#ff0000"
                      w="{{device.width/2}}px"
                      h="150px"
                      gravity="center"
                      textSize="14sp"
                      textColor="#ffffff"
                      foreground="?selectableItemBackground"
                    />
                    <button
                      id="dev"
                      layout_gravity="center"
                      text="测试环境"
                      style="Widget.AppCompat.Button.Colored"
                      bg="#04a9f5"
                      w="{{device.width/2}}px"
                      h="150px"
                      gravity="center"
                      textSize="14sp"
                      textColor="#ffffff"
                      foreground="?selectableItemBackground"
                    />
                  </horizontal>
                  <input
                    id="my_ws"
                    inputType="text"
                    hint="自定义WS地址,存在地址将优先使用此地址"
                    textSize="16sp"
                    h="150px"
                    w="*"
                    margin="0"
                    bg="#ffffff"
                    padding="15px 0 0 0"
                    gravity="left|center"
                    marginTop="15px"
                  />
                </vertical>
              </vertical>
            </ScrollView>
            <horizontal layout_weight="1" gravity="center" marginTop="30px">
              <button
                id="loadSetting"
                layout_gravity="center"
                text="载入配置"
                style="Widget.AppCompat.Button.Colored"
                bg="#827f7f"
                h="150px"
                w="{{device.width/4}}px"
                gravity="center"
                textSize="14sp"
                textColor="#ffffff"
                foreground="?selectableItemBackground"
              />
              <button
                id="saveSetting"
                layout_gravity="center"
                text="保存配置"
                style="Widget.AppCompat.Button.Colored"
                bg="#ff5723"
                marginLeft="1px"
                marginRight="1px"
                w="{{device.width/4}}px"
                h="150px"
                gravity="center"
                textSize="14sp"
                textColor="#ffffff"
                foreground="?selectableItemBackground"
              />
              <button
                id="log"
                layout_gravity="center"
                text="显示控制台"
                marginLeft="1px"
                marginRight="1px"
                style="Widget.AppCompat.Button.Colored"
                bg="#fe7300"
                h="150px"
                gravity="center"
                textSize="14sp"
                textColor="#ffffff"
                w="{{device.width/4}}px"
                foreground="?selectableItemBackground"
              />
              <button
                id="logClear"
                layout_gravity="center"
                text="清"
                marginLeft="1px"
                marginRight="1px"
                style="Widget.AppCompat.Button.Colored"
                bg="#fe7300"
                w="{{device.width/4}}px"
                h="150px"
                gravity="center"
                textSize="14sp"
                textColor="#ffffff"
                foreground="?selectableItemBackground"
              />
            </horizontal>
          </vertical>
        </frame>
        <frame>
          <vertical padding="15 10" bg="#e3e0e0">
            <button
              id="overCell"
              layout_gravity="center"
              text="点击将此APP电池优化设为不允许"
              style="Widget.AppCompat.Button.Colored"
              bg="#00bcd4"
              marginTop="15px"
              h="150px"
              gravity="center"
              textSize="14sp"
              textColor="#ffffff"
              foreground="?selectableItemBackground"
            />
            <button
              id="xiumian"
              layout_gravity="center"
              text="休眠设置"
              style="Widget.AppCompat.Button.Colored"
              bg="#00bcd4"
              marginTop="15px"
              h="150px"
              gravity="center"
              textSize="14sp"
              textColor="#ffffff"
              foreground="?selectableItemBackground"
            />
            <button
              id="wuzhangai"
              layout_gravity="center"
              text="无障碍设置"
              style="Widget.AppCompat.Button.Colored"
              bg="#00bcd4"
              marginTop="15px"
              h="150px"
              gravity="center"
              textSize="14sp"
              textColor="#ffffff"
              foreground="?selectableItemBackground"
            />
            <button
              id="appConfig"
              layout_gravity="center"
              text="应用权限设置"
              style="Widget.AppCompat.Button.Colored"
              bg="#fe7300"
              marginTop="15px"
              h="150px"
              gravity="center"
              textSize="14sp"
              textColor="#ffffff"
              foreground="?selectableItemBackground"
            />
            <button
              id="hwPhone"
              layout_gravity="center"
              text="华为手机管家设置"
              style="Widget.AppCompat.Button.Colored"
              bg="#fe7300"
              marginTop="15px"
              h="150px"
              gravity="center"
              textSize="14sp"
              textColor="#ffffff"
              foreground="?selectableItemBackground"
            />
            <button
              id="autoSetConfig"
              layout_gravity="center"
              text="华为系统自动设置"
              style="Widget.AppCompat.Button.Colored"
              bg="#ff0000"
              marginTop="15px"
              h="150px"
              gravity="center"
              textSize="14sp"
              textColor="#ffffff"
              foreground="?selectableItemBackground"
            />
          </vertical>
        </frame>
        <frame>
          <vertical padding="15 10" bg="#e3e0e0">
            <button
              id="delFans"
              layout_gravity="center"
              text="删除全部朋友圈"
              style="Widget.AppCompat.Button.Colored"
              bg="#00bcd4"
              marginTop="15px"
              h="150px"
              gravity="center"
              textSize="14sp"
              textColor="#ffffff"
              foreground="?selectableItemBackground"
            />
          </vertical>
        </frame>
      </viewpager>
    </vertical>
  </drawer>
);
//设置滑动页面的标题
ui.viewpager.setTitles(["设备信息", "权限设置", "功能"]);
//让滑动页面和标签栏联动
ui.tabs.setupWithViewPager(ui.viewpager);
activity.setSupportActionBar(ui.toolbar);
ui.phone_number.setText(commonStorage.get("phone_number") || "");
ui.phone_holder.setText(commonStorage.get("phone_holder") || "");
// =======开启前台======
try {
  var notification = new Notification();
  var currentApp = app.getForegroundApp();
  var icon = app.getIcon(currentApp.packageName);
  notification.icon = icon;
  notification.ticker = "前台服务已启动";
  notification.contentTitle = "前台服务";
  notification.contentText = "正在运行";
  notification.flags |= Notification.FLAG_ONGOING_EVENT;
  auto.service.startForeground(1, notification.build(), icon);
} catch (error) {
  try {
    let manager = context.getSystemService(
      android.app.Service.NOTIFICATION_SERVICE
    );
    manager.cancelAll();
    let idStr = "秘密基地保活服务！";
    let nameStr = "秘密基地！";
    idStr = idStr || "";
    let channel_id = idStr + ".foreground";
    let channel_name = nameStr + " 前台服务通知";
    let content_title = nameStr + " 正在运行中";
    let content_text = "请勿手动移除该通知,保持不掉线处理!";
    let ticker = nameStr + "已启动";
    let notification;
    let icon = context
      .getResources()
      .getIdentifier(
        "ic_3d_rotation_black_48dp",
        "drawable",
        context.getPackageName()
      );
    if (device.sdkInt >= 26) {
      let channel = new android.app.NotificationChannel(
        channel_id,
        channel_name,
        android.app.NotificationManager.IMPORTANCE_DEFAULT
      );
      channel.enableLights(true);
      channel.setLightColor(0xff0000);
      channel.setShowBadge(false);
      manager.createNotificationChannel(channel);
      notification = new android.app.Notification.Builder(context, channel_id)
        .setContentTitle(content_title)
        .setContentText(content_text)
        .setWhen(new Date().getTime())
        .setSmallIcon(icon)
        .setTicker(ticker)
        .setOngoing(true)
        .build();
    } else {
      notification = new android.app.Notification.Builder(context)
        .setContentTitle(content_title)
        .setContentText(content_text)
        .setWhen(new Date().getTime())
        .setSmallIcon(icon)
        .setTicker(ticker)
        .build();
    }
    manager.notify(1, notification);
  } catch (error) {
    console.warn("前台保活服务启动失败:" + error);
    console.warn("保活服务启动失败,不影响辅助的正常运行,继续挂机即可.");
  }
}
ui.run(function () {
  ui.admin.visibility = android.view.View.GONE;
  ui.log.visibility = android.view.View.GONE;
  ui.logClear.visibility = android.view.View.GONE;
});
// =======读取更新包更新======
let thread = threads.start(() => {
  let isStart = false;
  try {
    // 判断无障碍权限
    if (auto.service == null) {
      app.startActivity({
        action: "android.settings.ACCESSIBILITY_SETTINGS",
      });
      toast("请开启无障碍权限");
    }
    // 查看开启的脚本状态
    for (let e of engines.all()) {
      if (
        e &&
        e.source &&
        String.prototype.indexOf.call(e.source, "runScript.js") !== -1
      ) {
        // log("找到runScript===>",JSON.stringify(e.source));
        ui.startScript.setText("停止服务");
        isJc = true;
        isStart = true;
      }
    }
    // 请求远程版本
    let r = http.get("47.99.157.216:8089/version");
    let json = r.body.json();
    if (json.code === 200) {
      let v = json.data;
      ui.sever_version.setText(v);
      if (appConfig.app_version != v && !isStart) {
        console.log("APP版本号:" + appConfig.app_version, "!服务器版本号:", v);
        // 设置本地临时更新路径
        let tempUpdatePath = "/sdcard/appSync/tempUpdateTools/";
        // 获取项目路径 默认为工具箱APP的路径 如果要更新其他APP 请修改
        let projectPath = files.cwd();
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
          toastLog("热更新成功,请重启重新打开APP启动！");
          if (!isStart) {
            alert("请重新打开APP！！！");
            engines.stopAll();
          }
        } else {
          toastLog(url + "下载失败！！！");
          let ok = files.exists(zipPath);
          if (ok) {
            console.log("存在更新包开始替换文件！ $zip.unzip", projectPath);
            $zip.unzip(zipPath, projectPath);
            if (!isStart) {
              alert("请重新打开APP！！！");
              engines.stopAll();
            } else {
              toastLog("热更新成功,请重启重新打开APP启动！");
            }
          } else {
            console.log("没有可替换文件！");
          }
        }
      } else {
        console.log("无需替换文件！", isStart);
      }
    } else {
      alert("获取版本号失败！");
    }
    //日志
    try {
      while (true) {
        sleep(1000);
        let tempTimes = getCurrentTime();
        if (currenTimes !== tempTimes) {
          currenTimes = tempTimes;
          console.setGlobalLogConfig({
            file: "/sdcard/mmjdLog/log" + currenTimes + ".txt",
          });
        }
      }
    } catch (error) {
      console.error("错误", error);
    }
  } catch (error) {
    console.log("upDateerr", error);
  }
  // console.log("关闭线程updateThreads====>");
  // thread.interrupt();
});
// 保存设置按钮
ui.saveSetting.on("click", () => {
  // 设置公共缓存数据
  utils.setUICacheData(commonConstant.commonSettingKey, commonStorage);
  toastLog("保存成功！");
});
// 加载设置按钮
ui.loadSetting.on("click", () => {
  let phone_number = ui["phone_number"].text();
  let phone_holder = ui["phone_holder"].text();
  if (phone_number === "admin" && phone_holder === "shenwu") {
    ui.run(function () {
      ui.admin.visibility = android.view.View.VISIBLE;
    });
  }
  // 读取公共缓存数据
  utils.getUICacheData(commonConstant.commonSettingKey, commonStorage);
  toast("载入成功！");
});
// 自动设置按钮
ui.autoSetConfig.on("click", () => {
  if (!isJc) {
    alert("请先先点击启动前点击按钮,保证无障碍已开启！");
    return;
  }
  if (commonStorage.get("phone_system") === "鸿蒙") {
    confirm("是否确定自动设置！").then((value) => {
      //当点击确定后会执行这里, value为true或false, 表示点击"确定"或"取消"
      if (value) {
        hmautoSetConfig = engines.execScriptFile("./hmAutoConfig.js");
      }
    });
  } else if (commonStorage.get("phone_system") === "安卓") {
    confirm("是否确定自动设置！").then((value) => {
      //当点击确定后会执行这里, value为true或false, 表示点击"确定"或"取消"
      if (value) {
        autoConfigScript = engines.execScriptFile("./autoConfig.js");
      }
    });
  } else {
    toast("没有系统信息无法执行设置！");
  }
});
ui.delFans.on("click", () => {
  confirm("确定要删除全部朋友圈?").then((value) => {
    //当点击确定后会执行这里, value为true或false, 表示点击"确定"或"取消"
    if (value) {
      // 日期处理
      function zeroFill(i) {
        if (i >= 0 && i <= 9) {
          return "0" + i;
        } else {
          return String(i);
        }
      }
      let date = new Date();
      let month = zeroFill(date.getMonth() + 1); //月
      let day = zeroFill(date.getDate()); //日
      let year = zeroFill(date.getFullYear()); //年
      let newDateStr = `${year}-${month}-${day}`;
      let obj = {
        startTime: newDateStr,
      };
      let delfansthreads = threads.start(() => {
        qw.delFriends(obj);
        console.log("关闭线程====>");
        delfansthreads.interrupt();
      });
    }
  });
});
// app更新
ui.upDate.on("click", () => {
  confirm("确定是否要更新至最新版本").then((value) => {
    //当点击确定后会执行这里, value为true或false, 表示点击"确定"或"取消"
    if (value) {
      let updateThreads = threads.start(() => {
        try {
          let r = http.get("47.99.157.216:8089/version");
          let json = r.body.json();
          if (json.code === 200) {
            events.broadcast.emit("app_update", json.data);
          } else {
            alert("获取版本号失败！");
          }
        } catch (error) {
          console.log("upDateerr", error);
        }
        console.log("关闭线程====>");
        updateThreads.interrupt();
      });
    }
  });
});
// 开始脚本
ui.startScript.on("click", () => {
  if (!isJc) {
    alert("请先先点击启动前点击按钮");
    return;
  }
  startScriptFun();
});
//控制台
ui.log.on("click", () => {
  const btnContent = ui.log.text();
  const afterBtnContent =
    "显示控制台" === btnContent ? "隐藏控制台" : "显示控制台";
  ui.log.setText(afterBtnContent);
  if (btnContent === "显示控制台") {
    events.broadcast.emit("mylog", 1);
    ui.logClear.visibility = android.view.View.VISIBLE;
  } else {
    events.broadcast.emit("mylog", 0);
    ui.logClear.visibility = android.view.View.GONE;
  }
});
// 日志
ui.logBtn.on("click", () => {
  app.startActivity("console");
});
ui.logClear.on("click", () => {
  events.broadcast.emit("mylog");
});
// 应用管理
ui.appConfig.on("click", () => {
  let packageName = currentPackage(); // 获取当前应用的包名
  app.openAppSetting(packageName);
});
// 关闭电池优化
ui.overCell.on("click", () => {
  //忽略电池优化设置
  var intent = new Intent();
  intent.setAction("android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS");
  app.startActivity(intent);
  toast("请设置为不允许优化秘密基地！");
});
// 无障碍设置
ui.wuzhangai.on("click", () => {
  utils.action("wuzhangai");
});
// 华为手机管家
ui.hwPhone.on("click", () => {
  launchPackage("com.huawei.systemmanager");
});
//休眠
ui.xiumian.on("click", () => {
  utils.action("xiumian");
});
// //电池
// ui.dianchi.on("click",()=>{
//   utils.action("dianchi")
// })
// // 变态功能
// ui.abnormal.on("click", () => {
//   alert(
//     "卧槽~~没想到你是这种人😮,请把你的变态需求提交给宝姐，我们评估后尽最大的努力满足你😌"
//   );
// });
// 无障碍测试
ui.wzatest.on("click", () => {
  let vThreads = threads.start(() => {
    // 搜索设置
    function query() {
      textStartsWith("设置").findOne(5000);
      let input =
        className("EditText").findOne(1000) || text("搜索设置项").findOne(1000);
      while (!input) {
        input =
          className("EditText").findOne(1000) ||
          text("搜索设置项").findOne(1000);
        utils.swipe(
          device.width / 2,
          device.height * 0.5,
          device.width / 2,
          device.height * 0.9,
          500
        ); //上滑动
      }
      if (input) {
        input.click();
        text("搜索历史").findOne(5000);
        let editText =
          className("EditText").findOne(1000) ||
          text("搜索设置项").findOne(1000);
        sleep(1000);
        editText.setText("关于手");
        sleep(1500);
        console.log("点击");
        let node = text("关于手机").find();
        if (node && node.size() > 1) {
          click("关于手机", 1);
        } else {
          click("关于手机", 0);
        }
      }
    }
    //回到设置首页
    function goIndex() {
      console.log("回到首页开始");
      let isIndex =
        textStartsWith("设置").findOne(1000) || desc("设置").findOne(1000);
      while (!isIndex) {
        console.log("回首页");
        isIndex =
          textStartsWith("设置").findOne(1000) || desc("设置").findOne(1000);
        if (!isIndex) {
          back();
          sleep(500);
        }
      }
      sleep(500);
      console.log("回到首页结束");
    }
    let sw = swipe(
      device.width / 2,
      device.height / 2,
      device.width / 2,
      0,
      300
    );
    if (typeof sw === "boolean" && sw === true) {
      let phone_version_long = commonStorage.get("phone_version_long");
      let phone_system = commonStorage.get("phone_system");
      // 系统信息不存在去获取系统信息
      if (!phone_system && ["HUAWEI"].includes(device.brand)) {
        toast("首次启动,需要获取一次系统信息，请稍等！");
        launchApp("设置"); //打开设置
        sleep(1000);
        goIndex();
        query();
        sleep(500);
        try {
          let android = textContains("Android").exists();
          if (android) {
            commonStorage.put("phone_system", "安卓");
            console.log("安卓");
          } else {
            commonStorage.put("phone_system", "鸿蒙");
            console.log("鸿蒙");
          }
          let t = text("版本号").findOne(1000);
          let tp = t.parent().parent();
          let tc = tp.find(className("TextView"));
          for (let n of tc) {
            let txt = n.text();
            if (txt != "版本号") {
              console.log(txt);
              commonStorage.put("phone_version_long", txt);
              break;
            }
          }
          if (!commonStorage.get("phone_version_long")) {
            //鸿蒙3.0
            commonStorage.put("phone_version_long", "3.0.0");
          }
        } catch (error) {
          console.log("获取错误");
        }
        launchApp("秘密基地");
      }
      alert("功能正常！请点击启动服务");
      isJc = true;
    } else {
      isJc = false;
      alert(
        "无障碍功能虽启动,但没有正常工作，这可能是安卓系统的BUG，请尝试重启手机后再试！"
      );
      powerDialog();
    }
    console.log("关闭线程====>");
    vThreads.interrupt();
  });
});
//线上环境
ui.pro.on("click", () => {
  commonStorage.put("app_mode", "pro");
});
// 开始
ui.dev.on("click", () => {
  commonStorage.put("app_mode", "dev");
});
//脚本
function startScriptFun() {
  let phone_number = ui["phone_number"].text();
  let phone_holder = ui["phone_holder"].text();
  let my_ws = ui.my_ws.text();
  if (!phone_number) {
    ui.phone_number.setError("请先设置设备编号");
    return;
  }
  if (!phone_holder) {
    ui.phone_holder.setError("请先设置设备持有者");
    return;
  }
  if (my_ws) {
    commonStorage.put("app_mode", "myws");
    commonStorage.put("my_ws_url", my_ws);
    console.log("使用自定义WS");
  }
  appConfig.phone_number = phone_number;
  appConfig.phone_holder = phone_holder;
  commonStorage.put("phone_number", phone_number);
  commonStorage.put("phone_holder", phone_holder);
  const btnContent = ui.startScript.text();
  toast(btnContent);
  const afterBtnContent = "启动服务" === btnContent ? "停止服务" : "启动服务";
  ui.startScript.setText(afterBtnContent);
  if (btnContent === "启动服务") {
    toastLog("无障碍正常！");
    runScript = engines.execScriptFile("./runScript.js");
    updateScript = engines.execScriptFile("./update.js");
    ui.run(function () {
      ui.log.visibility = android.view.View.VISIBLE;
    });
  } else {
    ui.startScript.setText("启动服务");
    ui.run(function () {
      ui.log.visibility = android.view.View.GONE;
    });
    // 停止所有脚本
    const all = engines.all();
    // 停止所有进程
    threads.shutDownAll();
    all.forEach((item) => {
      item.forceStop();
    });
  }
}
// 重启脚本
events.broadcast.on("restart_script", function () {
  let websocketHandler = require("./common/websocket.js");
  if (websocketHandler) {
    websocketHandler.close();
    console.log("停止socket====>");
  }
  console.log("停止threads===>");
  threads.shutDownAll();
  console.log("停止之前脚本====>");
  if (runScript) {
    console.log("停止runScript");
    runScript.getEngine().forceStop();
    runScript = null;
  }
  if (updateScript) {
    console.log("停止updateScript");
    updateScript.getEngine().forceStop();
    updateScript = null;
  }
  // 再次搜索查询
  let jsArr = [];
  try {
    for (let e of engines.all()) {
      if (
        e &&
        e.source &&
        String.prototype.indexOf.call(e.source, "main.js") === -1
      ) {
        if (String.prototype.indexOf.call(e.source, "update.js") !== -1) {
          jsArr.unshift(e);
        } else {
          jsArr.push(e);
        }
      }
    }
    for (let e of jsArr) {
      console.log("再次查询脚本并停止===>", e.source);
      e.forceStop();
    }
    console.hide();
    // 重新启动脚本
    console.log("开始重新启动关键脚本程序！！！");
    runScript = engines.execScriptFile("./runScript.js");
    updateScript = engines.execScriptFile("./update.js");
  } catch (err) {
    console.log("版本更新错误", err);
  }
});
// 控制台UI控制监听
events.broadcast.on("uiLog", function (show) {
  if (show === 0) {
    ui.log.setText("显示控制台");
  } else {
    ui.log.setText("隐藏控制台");
  }
});
// ==============日志存放手机==================

function getCurrentTime() {
  var date = new Date(); //当前时间
  var month = zeroFill(date.getMonth() + 1); //月
  var day = zeroFill(date.getDate()); //日
  // var hour = zeroFill(date.getHours()); //时
  //当前时间
  var curTime = date.getFullYear() + month + day;
  return curTime;
}

function zeroFill(i) {
  if (i >= 0 && i <= 9) {
    return "0" + i;
  } else {
    return String(i);
  }
}

files.createWithDirs("/sdcard/mmjdLog/");
// 获取当前时间字符串
let currenTimes = getCurrentTime();
console.setGlobalLogConfig({
  file: "/sdcard/mmjdLog/log" + currenTimes + ".txt",
});

events.broadcast.on("upLog", function (date, userId) {
  console.log("upLog===>");
  let logThread = threads.start(() => {
    try {
      // 上传日志脚本
      let currenTimes = date || getCurrentTime();
      console.log("currenTimes===>", currenTimes);
      let fileContent = "/sdcard/mmjdLog/log" + currenTimes + ".txt"; // 读取文件内容
      // 发起网络请求，将文件内容上传到服务器
      let formData = {
        file: open(fileContent),
        uuid: appConfig.uuid,
        userId,
      };
      http.postMultipart(appConfig.http_url_yk + "/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        encoding: "utf-8",
        asString: true,
        success: function (response) {
          // 上传成功的处理逻辑
          console.log(response.body.string());
        },
        error: function (err) {
          // 错误处理逻辑
          console.error(err);
        },
      });
    } catch (error) {
      console.log("上传日志错误", error);
    }
    console.log("关闭上传日志线程===>");
    logThread.interrupt();
  });
});
setInterval(() => {
  // 防止主线程退出
  // console.log("防止主线程退出");
}, 1000);
