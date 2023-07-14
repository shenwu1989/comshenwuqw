//=======================预览设备参数变量=======================
let deviceParam = {
  imgQuality: 100, //图片质量0-100
  imgScale: 1, //图片比例
  isOpenGray: 0,
  isOpenThreshold: 0,
  imgThreshold: 60,
  appSpace: 1000 / 15, //截图间隔
};

// =======================引入环境=======================
var appConfig = require("./common/config.js");
var utils = require("./common/utils.js");
var qw = require("./common/qw.js");
var websocketHandler = require("./common/websocket.js");
var commonStorage = storages.create("shenwu1989@gmail.com" + "ui");
//======================= 初始化appConfig=======================
if (commonStorage.get("app_mode")) {
  appConfig.app_mode = commonStorage.get("app_mode");
}
if (commonStorage.get("my_ws_url")) {
  appConfig.my_ws_url = commonStorage.get("my_ws_url");
}
if (commonStorage.get("phone_number")) {
  appConfig.phone_number = commonStorage.get("phone_number");
}
if (commonStorage.get("phone_holder")) {
  appConfig.phone_holder = commonStorage.get("phone_holder");
}
if (commonStorage.get("phone_system")) {
  appConfig.phone_system = commonStorage.get("phone_system");
}
if (commonStorage.get("phone_version_long")) {
  appConfig.phone_version_long = commonStorage.get("phone_version_long");
}
// 创建错误存放IMG
files.createWithDirs("/sdcard/errImg/");
// ==========初始化UI控制台按钮=========
events.broadcast.emit("uiLog", 0);
//=======================获取脚本路径=======================
commonStorage.put("appPath", files.cwd());
if (["HUAWEI"].includes(device.brand)) {
  commonStorage.put("otherClickText", "允许");
}
//=======================开启截图权限=======================
utils.imageAuth();
//======================= 初始化socketTask=======================
let ws_url =
  appConfig.app_mode === "pro"
    ? appConfig.pro_ws_url
    : appConfig.app_mode === "dev"
    ? appConfig.dev_ws_url
    : appConfig.my_ws_url;
websocketHandler.initWebSocket(ws_url, "socketTask");
//======================= 初始化socketYk=======================
websocketHandler.initWebSocket(appConfig.ws_url_yk, "socketYk");
//======================= 定义进程变量=======================
var deviceThread = null;
var clickThread = null;
var showThread = null;
//======================= 预览设备=======================
events.broadcast.on("startPreviewDevice", (params) => {
  let { userId, data } = params;
  let { imgQuality, appSpace, imgScale, multidevice } = data;
  if (imgQuality) {
    deviceParam.imgQuality = imgQuality;
  }
  if (appSpace) {
    deviceParam.appSpace = appSpace;
  }
  if (imgScale) {
    deviceParam.imgScale = imgScale;
  }
  console.log(data, deviceParam.imgQuality);
  // 唤醒设备
  if (!device.isScreenOn()) {
    device.wakeUp();
    utils.swipe(
      device.width / 2,
      device.height - 100,
      device.width / 2,
      0,
      500
    ); // 上滑解锁
    //home(); // 进入主屏幕
  }
  // if (clickThread) {
  //   console.log("关闭自动点击线程");
  //   clickThread.interrupt();
  // }
  if (showThread) {
    console.log("关闭常亮进程");
    showThread.interrupt();
  }
  if (deviceThread) {
    console.log("关闭预览线程");
    deviceThread.interrupt();
  }
  console.log("开启自动点击线程");
  // 保持屏幕常亮
  showThread = threads.start(function () {
    while (true) {
      device.wakeUpIfNeeded();
      sleep(1000);
    }
  });
  // // 自动点击授权
  // clickThread = threads.start(function () {
  //   while (true) {
  //     let click1 = text("立即开始").findOne(100);
  //     if (click1) {
  //       click1.click();
  //     }
  //     let otherClickText = commonStorage.get("otherClickText");
  //     if (otherClickText) {
  //       let click2 = text(otherClickText).findOne(100);
  //       if (click2) {
  //         click2.click();
  //       }
  //     }
  //   }
  // });
  // 关闭心跳
  websocketHandler.clearHeart("socketYk");
  deviceThread = threads.start(() => {
    let isOk = false;
    try {
      let img = images.captureScreen();
      isOk = true;
    } catch (error) {
      console.log("截图没权限", error);
      requestScreenCapture();
      isOk = true;
    }
    console.log("isOk", isOk);
    sleep(500);
    toastLog("开始预览");
    while (isOk) {
      try {
        let img = images.captureScreen();
        let afterImg = images.scale(
          img,
          deviceParam.imgScale,
          deviceParam.imgScale
        );
        //单设备预览
        let base64Img = images.toBase64(
          afterImg,
          "jpg",
          deviceParam.imgQuality
        );
        if (multidevice) {
          // 多设备预览逻辑
          let imgPath = `/sdcard/${appConfig.uuid}.jpg`;
          images.save(afterImg, imgPath, "jpg", deviceParam.imgQuality);
          media.scanFile(imgPath);
          var formData = {
            file: open(imgPath),
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
        } else {
          websocketHandler.send(
            "phone_preview",
            {
              msgType: "phone_preview",
              base64: base64Img,
              userId,
              code: 200,
              uuid: appConfig.uuid,
            },
            "socketYk"
          );
        }
        afterImg.recycle();
        img.recycle();
        sleep(30);
      } catch (error) {
        console.error("预览错误", error);
        try {
          console.log("重开权限");
          if (!requestScreenCapture()) {
            console.log("截图授权");
          }
        } catch (error1) {
          console.error("重开截图权限错误", error1);
          if (deviceThread) {
            toastLog("停止预览");
            deviceThread.interrupt();
          }
        }
      }
    }
  });
});
//======================= 停止预览设备=======================
events.broadcast.on("stopPreviewDevice", function (userId) {
  // 唤醒设备
  device.wakeUpIfNeeded();
  if (deviceThread) {
    websocketHandler.startHeart("socketYk"); //开启心跳
    toastLog("停止预览");
    deviceThread.interrupt();
    showThread.interrupt();
    utils.send("stop_phone_preview", {
      code: 200,
      userId,
      msgType: "stop_phone_preview",
    });
  }
});
// =======================首次启动60秒内自动点击截图授权=======================
clickThread = threads.start(function () {
  while (true) {
    let click1 = text("立即开始").findOne(100);
    if (click1) {
      click1.click();
    }
    let otherClickText = commonStorage.get("otherClickText");
    if (otherClickText) {
      let click2 = text(otherClickText).findOne(100);
      if (click2) {
        click2.click();
      }
    }
    let click3 = text("稍后").findOne(100);
    if (click3) {
      click3.click();
    }
    // 判断当前是否存在软件更新
    if (textContains("软件更新").exists()) {
      console.log("找到软件更新弹窗！！！");
      let btn = text("稍后").findOnce(100);
      if (btn) {
        let ok = btn.click();
        if (!ok) {
          ok = click("稍后", 0);
          if (!ok) {
            centerClick(btn);
          }
        }
      } else {
        click("稍后", 0);
        console.log("未找到稍后按钮");
      }
      let btn1 = text("取消").findOnce(100);
      if (btn1) {
        let ok = btn.click();
        if (!ok) {
          ok = click("取消", 0);
          if (!ok) {
            centerClick(btn1);
          }
        }
      } else {
        click("取消", 0);
        console.log("未找到取消按钮");
      }
    }
    if (textContains("下载该更新").exists()) {
      if(textContains("稍后").exists()){
        click("稍后", 0);
      }
      if(textContains("取消").exists()){
        click("取消", 0);
      }
    }
    if (textContains("下载并安装").exists()) {
      if(textContains("稍后").exists()){
        click("稍后", 0);
      }
      if(textContains("取消").exists()){
        click("取消", 0);
      }
    }
    // 判断开启WLAN弹窗
    if (textContains("开启WLAN").exists()) {
      let btn1 = text("取消").findOnce(100);
      if (btn1) {
        let ok = btn.click();
        if (!ok) {
          ok = click("取消", 0);
          if (!ok) {
            centerClick(btn1);
          }
        }
      } else {
        click("取消", 0);
        console.log("未找到取消按钮");
      }
    }
    if (textContains("自动下载安装包").exists()) {
      if(textContains("稍后").exists()){
        click("稍后", 0);
      }
      if(textContains("取消").exists()){
        click("取消", 0);
      }
    }
    // 判断企微是否响应
    if (textContains("无响应").exists()) {
      let btn1 = text("等待").findOnce(100);
      if (btn1) {
        let ok = btn.click();
        if (!ok) {
          ok = click("等待", 0);
          if (!ok) {
            centerClick(btn1);
          }
        }
      } else {
        click("等待", 0);
        console.log("未找到等待按钮");
      }
    }
    //企微加群被拒绝弹窗
    if (textContains("拒绝加入").exists()) {
      if(textContains("我知道了").exists()){
        click("我知道了", 0);
      }
    }
    //移入风险管控中心
    if (textContains("移入风险管控中心").exists()) {
      if(textContains("取消").exists()){
        click("取消", 0);
      }
    }
    //风险提示
    if (textContains("风险提示").exists()) {
      if(textContains("继续使用").exists()){
        click("继续使用", 0);
      }
    }
    //系统参数更新
    if (textContains("系统参数更新").exists()) {
      if(textContains("稍后").exists()){
        click("稍后", 0);
      }
    }

    sleep(1000);
  }
  // let time = 0;
  // while (time < 60) {
  //   let click1 = text("立即开始").findOne(100);
  //   if (click1) {
  //     click1.click();
  //   }
  //   let otherClickText = commonStorage.get("otherClickText");
  //   if (otherClickText) {
  //     let click2 = text(otherClickText).findOne(100);
  //     if (click2) {
  //       click2.click();
  //     }
  //   }
  //   sleep(1000);
  //   time += 1;
  // }
  // if (clickThread) {
  //   console.log("定时关闭自动点击线程", time);
  //   clickThread.interrupt();
  // }
});

// 控制台UI控制监听
events.broadcast.on("mylog", function (show) {
  console.hide();
  let logthreads = threads.start(function () {
    switch (show) {
      case 0:
        console.hide();
        events.broadcast.emit("uiLog", 0); //改变UI文本
        break;
      case 1:
        console.show(true);
        events.broadcast.emit("uiLog", 1); //改变UI文本
        break;
      case 2:
        // 最小化控制台悬浮窗
        // console.minimize();
        // console.setSize(50, 50)
        break;
      default:
        console.clear();
        break;
    }
    console.log("关闭线程====>");
    logthreads.interrupt();
  });
});
// // 每5分钟上传一次日志
// threads.start(() => {
//   try {
//     while (true) {
//       function getCurrentTime() {
//         var date = new Date(); //当前时间
//         var month = zeroFill(date.getMonth() + 1); //月
//         var day = zeroFill(date.getDate()); //日
//         // var hour = zeroFill(date.getHours()); //时
//         //当前时间
//         var curTime = date.getFullYear() + month + day;
//         return curTime;
//       }
//       function zeroFill(i) {
//         if (i >= 0 && i <= 9) {
//           return "0" + i;
//         } else {
//           return String(i);
//         }
//       }
//       if (device.isScreenOn()) {//
//         // 上传日志脚本
//         let currenTimes = getCurrentTime();
//         let fileContent = "/sdcard/mmjdLog/log" + currenTimes + ".txt"; // 读取文件内容
//         // 发起网络请求，将文件内容上传到服务器
//         let formData = {
//           file: open(fileContent),
//           uuid: appConfig.uuid,
//         };
//         http.postMultipart(appConfig.http_url_yk + "/upload", formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           encoding: "utf-8",
//           asString: true,
//           success: function (response) {
//             // 上传成功的处理逻辑
//             console.log(response.body.string());
//           },
//           error: function (err) {
//             // 错误处理逻辑
//             console.error(err);
//           },
//         });
//       }
//       sleep(1000 * 60 * 5);
//     }
//   } catch (error) {
//     console.log("上传日志错误", error);
//   }
// });
//=======================保持脚本运行=======================
// 


