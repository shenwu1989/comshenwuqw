// =============================================================================websocket===============================================
importPackage(Packages["okhttp3"]); //导入包
var client = new OkHttpClient.Builder().retryOnConnectionFailure(true).build();
//=======================socket配置=======================
let websocketHandler = {
  socketTask: null, //任务socket
  socketYk: null, //云控
  socketTaskConfig: {
    //任务socket配置
    isHeartData: true,
    isReconnect: true, //
    heartTime: 10000, //心跳间隔
    reConnectTime: 10000, //重连间隔
    reConnectTimer: null, // 重连句柄
    heartTimer: null, // 心跳句柄
    isClose: true, //是否关闭
    connectOK: false, // 连接是否成功
  },
  socketYkConfig: {
    //云控socket配置
    isHeartData: true,
    isReconnect: true, //
    heartTime: 10000, //心跳间隔
    reConnectTime: 10000, //重连间隔
    reConnectTimer: null, // 重连句柄
    heartTimer: null, // 心跳句柄
    isClose: true, //是否关闭
    connectOK: false, // 连接是否成功
  },
};
//=======================soket初始化=======================
websocketHandler.initWebSocket = (ws_url, wsName) => {
  console.log("初始化===>", wsName);
  let request = new Request.Builder().url(ws_url).build(); //ws
  let myListener = {
    // 建立链接
    onOpen: function (webSocket, response) {
      print("onOpen");
      websocketHandler[wsName + "Config"].isClose = false;
      websocketHandler[wsName + "Config"].connectOK = true;
      if (websocketHandler[wsName + "Config"].isHeartData) {
        //判断心跳是否开启开始清除重新创建心跳
        console.log("清理心跳");
        websocketHandler.clearHeart(wsName);
        websocketHandler.startHeart(wsName);
      }
      if (websocketHandler[wsName + "Config"].reConnectTimer) {
        //重连句柄是否存在
        console.log("清理重连句柄");
        clearInterval(websocketHandler[wsName + "Config"].reConnectTimer); //存在清理
      }
      websocketHandler[wsName + "Config"].reConnectTimer = null;
      //打开链接后，想服务器端发送一条消息
      var json = {};
      json.code = 200;
      json.uuid = appConfig.uuid;
      let newObj = JSON.parse(JSON.stringify(appConfig));
      delete newObj["uuid"];
      json.data = newObj;
      websocketHandler.send("receive_register", json, wsName);
    },
    // 监听消息
    onMessage: function (webSocket, msg) {
      //msg可能是字符串，也可能是byte数组，取决于服务器送的内容
      utils.addTask(msg, webSocket);
    },
    // 关闭
    onClosing: function (webSocket, code, response) {
      print("正在关闭");
    },
    // 主动关闭
    onClosed: function (webSocket, code, response) {
      //被关闭
      websocketHandler[wsName + "Config"].connectOK = false;
      if (
        websocketHandler[wsName + "Config"].isHeartData &&
        websocketHandler[wsName + "Config"].heartTimer != null
      ) {
        //关闭心跳
        websocketHandler.clearHeart(wsName);
      }
      // 判断是否为异常关闭
      if (
        websocketHandler[wsName + "Config"].reConnectTimer == null &&
        !websocketHandler[wsName + "Config"].isClose &&
        websocketHandler[wsName + "Config"].isReconnect
      ) {
        // 执行重连操作
        websocketHandler.reConnectSocket(ws_url, wsName);
      }
    },
    // 服务器异常关闭
    onFailure: function (webSocket, code, response) {
      print("连接不到服务器===>", code, wsName);
      try {
        device.wakeUpIfNeeded();
      } catch (error) {}
      // websocket连接异常
      websocketHandler[wsName + "Config"].connectOK = false;
      if (
        websocketHandler[wsName + "Config"].isHeartData &&
        websocketHandler[wsName + "Config"].heartTimer != null
      ) {
        console.log("清理心跳");
        websocketHandler.clearHeart(wsName);
      }
      if (
        websocketHandler[wsName + "Config"].reConnectTimer == null &&
        websocketHandler[wsName + "Config"].isReconnect
      ) {
        console.log("开始重连===>", ws_url, wsName);
        websocketHandler.reConnectSocket(ws_url, wsName);
      }
    },
  };
  //创建链接
  websocketHandler[wsName] = client.newWebSocket(
    request,
    new WebSocketListener(myListener)
  );
};
//======================= 关闭连接=======================
websocketHandler.close = () => {
  if (websocketHandler.socketTask) {
    websocketHandler.socketTask.cancel();
    websocketHandler.socketTask.close(1000, null);
    websocketHandler.socketTask = null;
  }
  if (websocketHandler.socketYk) {
    websocketHandler.socketYk.cancel();
    websocketHandler.socketYk.close(1000, null);
    websocketHandler.socketYk = null;
  }
};
// =======================重连=======================
websocketHandler.reConnectSocket = (ws_url, wsName) => {
  try {
    // 判断设备屏幕是否是亮着，如果没有唤醒则唤醒设备并进入主屏幕
    if (!device.isScreenOn()) {
      device.wakeUp();
      // sleep(1000);
      utils.swipe(
        device.width / 2,
        device.height - 100,
        device.width / 2,
        0,
        500
      );
      sleep(800);
    }
  } catch (error) {}
  console.log(
    "开始重连尝试间隔10秒===>",
    wsName,
    websocketHandler[wsName + "Config"].reConnectTimer
  );
  if (utils.isTaskRunning) {
    utils.isTaskRunning = false;
  }
  websocketHandler[wsName + "Config"].reConnectTimer = setInterval(() => {
    try {
      // 判断设备屏幕是否是亮着，如果没有唤醒则唤醒设备并进入主屏幕
      if (!device.isScreenOn()) {
        device.wakeUp();
        // sleep(1000);
        utils.swipe(
          device.width / 2,
          device.height - 100,
          device.width / 2,
          0,
          500
        );
        sleep(800);
      }
    } catch (error) {}
    console.log("轮询重连===>", websocketHandler[wsName + "Config"].connectOK);
    if (!websocketHandler[wsName + "Config"].connectOK) {
      websocketHandler.initWebSocket(ws_url, wsName);
    } else {
      if (websocketHandler[wsName + "Config"].reConnectTimer) {
        clearInterval(websocketHandler[wsName + "Config"].reConnectTimer);
        websocketHandler[wsName + "Config"].reConnectTimer = null;
      }
    }
  }, websocketHandler[wsName + "Config"].reConnectTime);
};
//=======================发送消息=======================
websocketHandler.send = (msgType, data, wsName) => {
  if (msgType !== "receive_heart" && msgType !== "phone_preview") {
    //&& msgType !== "phone_preview"
    console.log("websocketHandler.send ", msgType, wsName, data.errMsg);
  }
  if (websocketHandler[wsName]) {
    websocketHandler[wsName].send(msgType + "-" + JSON.stringify(data));
  } else {
    console.log(` websocketHandler.${wsName}不存在！`);
  }
};
//======================= 心跳=======================
websocketHandler.startHeart = (wsName) => {
  var data = JSON.parse(JSON.stringify(appConfig));
  delete data["uuid"];
  (data.phone_cell = device.getBattery()), //每次心跳重新获取手机电量
    (websocketHandler[wsName + "Config"].heartTimer = setInterval(() => {
      data["phone_cell"] =  device.getBattery()
      // 发送心跳
      websocketHandler.send(
        "receive_heart",
        {
          code: 200,
          uuid: appConfig.uuid,
          data,
        },
        wsName
      );
    }, websocketHandler[wsName + "Config"].heartTime));
};
// =======================清除心跳=======================
websocketHandler.clearHeart = (wsName) => {
  if (websocketHandler[wsName + "Config"].heartTimer) {
    clearInterval(websocketHandler[wsName + "Config"].heartTimer);
  }
  websocketHandler[wsName + "Config"].heartTimer = null;
};
//======================= 脚本退出时取消WebSocket=======================
events.on("exit", () => {
  websocketHandler.socketTaskConfig.isReconnect = false;
  if (websocketHandler.socketTask) {
    // console.log("退出脚本,关闭socketTask");
    websocketHandler.socketTask.cancel();
  }
  websocketHandler.socketTaskConfig.isReconnect = false;
  if (websocketHandler.socketYk) {
    // console.log("退出脚本,关闭socketYk");
    websocketHandler.socketYk.cancel();
  }
});
module.exports = websocketHandler;
