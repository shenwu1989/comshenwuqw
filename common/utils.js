"auto";

// ================================================================================变量==================================================================
var utils = {
  taskQueue: [], // 任务队列
  filterTaskList: [], //
  isTaskRunning: false, // 是否存在执行中的任务
  websocket: null, //socket实例
  msg: "", //结果任务错误时存在
  taskResult: null, //任务结果
  msgType: "receive_task_callback", //默认任务类型
  code: 200, //0为任务失败，200为成功
  task_thread: null, //任务线程
  task_moments_time: 6 * 60 * 1000, //朋友圈任务防卡死时间
  task_mass_time: 6 * 60 * 1000, //群发消息任务防卡死时间
  task_kfName_time: 6 * 60 * 1000, //群发消息任务防卡死时间
  task_comment_time: 6 * 60 * 1000, //群发消息任务防卡死时间
  task_delFriend_time: 10 * 60 * 1000, //删好友100个半小时防卡死时间
  task_createGroup_time: 6 * 60 * 1000, //建群任务10分钟防卡死
};
// =======================任务枚举=======================
let msgTypeEnum = {
  send_update: "receive_register", //更新企微信息
  send_corp_group_send: "receive_task_callback", //群发
  send_corp_moment_send: "receive_task_callback", //朋友圈
  del_corp_moment_send: "receive_task_callback", //删友圈
  send_corp_moment_comment: "receive_task_callback", //朋友圈评论
  send_corp_pull_group: "receive_pull_group", //建群
  send_corp_pull_group_otherB: "receive_pull_group_otherb", //建群
  send_corp_pull_group_otherA: "receive_pull_group", //建群
  phone_preview_action: "receive_task_callback", //云控操作
};
// ================================================================================工具函数==================================================================
// 查找文本坐标
utils.queryTextXY = (name) => {
  if (utils.getTextName(name)) {
    let textObj = text(name).findOne(2000);
    let bounds = textObj.bounds();
    console.log(name + "标：" + bounds.centerX() + "," + bounds.centerY());
    return bounds;
  }
  return null;
};
// 获取指接点的指定className的父节点
utils.getParentNode = (node, class_name) => {
  try {
    let ok = false;
    let pNode = node.parent();
    while (!ok) {
      if (pNode && pNode.className() == class_name) {
        ok = true;
        console.log("找到父节点pNode.className===>");
      } else {
        try {
          pNode = pNode.parent();
        } catch (error) {
          console.log("未找父节点！！");
          pNode = null;
          ok = true;
        }
      }
    }
    return pNode;
  } catch (error) {
    console.log("获取指接点的指定className的父节点==error==>");
  }
};
// 判断当前app是否是指定APP不是的话打开正确APP
utils.isApp = (name) => {
  let isOk = packageName(name).exists();
  if (!isOk) {
    toastLog("重新打开===>" + name);
    app.launchPackage(name);
    sleep(3000);
  } else {
    toastLog("当前APP已是" + name);
  }
  return isOk;
};
// 查找列表下的文本
utils.queryListText = (name, location) => {
  location = location || "top";
  name = name || "androidx.recyclerview.widget.RecyclerView";
  let node = className(name).findOne(1000);
  let texts = [];
  if (node && node.children()) {
    let collection = node.children();
    let count = collection.size();
    console.log("queryListText===>", count);
    for (var i = 0; i < count - 1; ++i) {
      let obj = null;
      try {
        obj = collection.get(i);
        let a = obj.findOne(className("android.widget.TextView"));
        texts.push(a.text());
      } catch (error) {
        break;
      }
    }
  } else {
    console.log("获取不到列表节点");
  }

  if (location === "top") {
    return texts[0];
  } else if (location === "bottom") {
    return texts[texts.length - 1];
  } else {
    return texts;
  }
};
/* 模糊判断文字是否存在
 *
 * @param str 文字名称
 * */
utils.getTextName = (str, isPrecise) => {
  if (isPrecise) {
    let txtNode = textContains(str).findOne(2000);
    let txt = txtNode ? txtNode.text() : "";
    txt = String.prototype.replace.call(txt, /[\s\(\d+\+?\)]/gi, "");

    console.log("精准查找文字", str, textContains(str).exists(), txt);
    return textContains(str).exists() && txt == str.replace(/\s/gi, "");
  } else {
    console.log("模糊查找文字", str);
    return textContains(str).exists();
  }
};
// 无障碍点击节点中心点
utils.centerClick = (node) => {
  let ok = click(node.bounds().centerX(), node.bounds().centerY());
  if (!ok) {
    node.click();
    toastLog("本次操作无障碍失效！！！");
  }
  return ok;
};
/**
 * 点击指定名称的文字
 * @param {string} strName 文字名称
 * @param {number}  eq 多个相同文字时取第几个0开始
 * @param  {number} t 延迟多少毫秒 默认1000
 * @param  {boolean} scroll 是否需要滚动查找布尔值
 * @param {string} endName 最底部节点的名称用于对比停止滑动
 * @returns {boolean}
 */
utils.clickNode = (params) => {
  let { strName, eq, t, scroll, endName,isBig } = params;
  let tagBtn = null;
  let endTagName = "";
  let i = 0;
  let sameNum = 0;
  // 查找node节点
  function getNode() {
    if (eq) {
      let btns = text(strName).find();
      if (btns) {
        try {
          tagBtn = btns.get(eq);
        } catch (error) {
          utils.msg = `找不到${strName}名称的节点列表`;
          utils.code = 0;
          i = 100;
          return;
        }
      }
    } else {
      tagBtn = text(strName)
        .visibleToUser(true)
        .findOne(t || 1000);
    }
    let texts = className("TextView").visibleToUser(true).find();
    if (texts) {
      let totalNum = texts.size();
      if (totalNum > 0) {
        let newEndTagName = "";
        for (let c = 0; c < totalNum; c++) {
          newEndTagName += texts.get(c).text();
        }
        if (endTagName != newEndTagName) {
          console.log("endTagName===>", endTagName);
          console.log("newEndTagName===>", newEndTagName);
          endTagName = newEndTagName;
        } else if (sameNum == 0) {
          sameNum += 1;
        } else {
          console.log("到底部了");
          i = 100;
        }
      }
    }
    if (endName) {
      if (textContains("查看更多标签").exists()) {
        toastLog("找到" + endName + "已到底部");
        i = 100;
      }
    }
  }
  getNode(); //进入后先查询一次
  //滑动查找
  if (scroll && !tagBtn) {
    console.log("开始滑动查询");
    while (!tagBtn && i < 100) {
      if(isBig){
        console.log("滑动0.8")
        utils.downSwipeBig()
      }else{
        console.log("滑动0.5")
        utils.downSwipe();
      }
      sleep(150);
      getNode();
    }
    !tagBtn && console.log("滑动" + i + "次没找到" + strName);
  }
  // console.log("endTagName", endTagName, i, scroll, tagBtn);
  let ok = false; //点击是否成功
  if (tagBtn) {
    ok = utils.centerClick(tagBtn);
    if (!ok) {
      ok = click(strName, 0);
    }
    sleep(t || 1000);
  }
  return ok;
};
/**等待节点时间
 * @param {number} mode 0 =textContains 1=textStartsWith 2 = textEndsWith() 三种模式
 * @param {string} name 包含文字
 * @param {number} t  等待毫秒默认10000
 * @returns {node}
 * */
utils.waitNode = (param) => {
  let { mode, name, t } = param;
  let r = null;
  switch (mode) {
    case 1:
      r = textStartsWith(name).findOne(t || 10000);
      break;
    case 2:
      r = textEndsWith(name).findOne(t || 10000);
      break;
    default:
      r = textContains(name).findOne(t || 10000);
      break;
  }
  sleep(500);
  return r;
};
// 滑动
utils.swipe = (a, b, c, d, e) => {
  let r = swipe(a, b, c, d, e);
  if (!r) {
    toastLog("本次滑动操作反馈无障碍失效！！！");
  }
  return r;
};
/*等待指定文本存在的时候才继续执行
 *
 *
 * */
utils.waitForName = (name1) => {
  let node = text(name1).className("android.widget.TextView").findOne(2000);
  console.log("等待指定元素结束====>", name1);
  return node;
};
// 获取屏幕方向
utils.getOrientation = () => {
  // 1 竖屏 2横屏
  let orientation = context.getResources().getConfiguration().orientation;

  // 宽大于高 平板
  if (device.width > device.height) {
    // 转换一下方向
    orientation = orientation === 1 ? 2 : 1;
    // 高大于宽 手机
  }
  return orientation;
};
// 判断节点是否被点击选中
utils.isChecked = (name) => {
  let node = text(name).className("android.widget.TextView").findOne(2000);
  let isok = node ? node.selected() : false;
  if (!isok) {
    click(name, 0);
  }
  console.log(name, "已点击选中！！");
  return node ? node.selected() : false;
};
// 开启截图权限
utils.imageAuth = () => {
  let imgthreads = threads.start(() => {
    console.log("子线程执行任务开始====>");
    if (!requestScreenCapture()) {
      console.log("截图授权");
    }
    console.log("关闭线程===>");
    imgthreads.interrupt();
  });
  // utils.thread(() => {
  //   if (!requestScreenCapture()) {
  //     console.log("截图授权");
  //   }
  // });
};
// 向服务器发送信息
utils.send = (msgType, data) => {
  if (msgType === "receive_task_callback") {
    console.log("向服务器发送信息====>", msgType, data);
  } else {
    console.log("向服务器发送信息====>", msgType);
  }
  websocketHandler.send(msgType, data, "socketTask");
  websocketHandler.send(msgType, data, "socketYk");
};
// 向右滑动
utils.rightSwipe = () => {
  utils.swipe(
    device.width / 2,
    device.height / 2,
    device.width,
    device.height / 2,
    500
  ); //右滑动
};
// 向左滑动
utils.leftSwipe = () => {
  utils.swipe(device.width / 2, device.height / 2, 0, device.height / 2, 500); //左滑动
};
// 向上滑动
utils.upSwipe = () => {
  let ok = utils.swipe(
    device.width / 2,
    device.height * 0.5,
    device.width / 2,
    device.height * 0.9,
    500
  ); //上滑动
  return ok;
};
// 向下滑动
utils.downSwipe = () => {
  let ok = utils.swipe(
    device.width / 2,
    device.height * 0.5,
    device.width / 2,
    device.height * 0.1,
    500
  ); //下滑动
  return ok;
};
// 大幅度向下滑动
utils.downSwipeBig = () => {
  let ok = utils.swipe(
    device.width / 2,
    device.height * 0.8,
    device.width / 2,
    device.height * 0.1,
    500
  ); //下滑动
  return ok;
};
//截图并查找文字
utils.imgsToText = () => {
  console.log("开始截图文字识别！！！！！");
  try {
    let img = captureScreen(); // 截取当前屏幕
    console.log("img====>", img);
    let text = "";
    if (img) {
      text = paddle.ocr(img); // 进行OCR文字识别
    }
    return text;
  } catch (err) {
    utils.imageAuth();
    try {
      let img = captureScreen(); // 截取当前屏幕
      console.log("img====>", img);
      let text = "";
      if (img) {
        text = paddle.ocr(img); // 进行OCR文字识别
      }
      return text;
    } catch (err) {
      toast("截图权限未开启！");
      utils.msg = "截图权限未开启，导致任务失败！";
      utils.code = 0;
    }
  }
};
//截图保留失败原因
utils.taskErrImg = (msg, d) => {
  console.log("截图上传至OSS");
  let img = null;
  try {
    img = captureScreen(); // 截取当前屏幕
  } catch (err) {
    utils.imageAuth();
    try {
      img = captureScreen(); // 截取当前屏幕
    } catch (err) {
      console.log("本次截图失败了！");
    }
  }
  if (img) {
    let afterImg = images.scale(img, 0.5, 0.5);
    let imgPath = `/sdcard/errImg/${
      (msg ? msg : "") + (d ? d : Date.now())
    }.jpg`;
    images.save(afterImg, imgPath, "jpg", 50);
    media.scanFile(imgPath);
    try {
      // 发起网络请求，将文件内容上传到服务器
      let formData = {
        file: open(imgPath),
        uuid: appConfig.uuid,
      };
      http.postMultipart(appConfig.http_url_yk + "/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data; charset=UTF-8",
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
      afterImg.recycle();
      img.recycle();
    } catch (error) {
      console.log("上传日志错误", error);
    }
  }
};
/**
 * 匹配图标并返回坐标，add添加图标 ddd 三个点坐标,
 * @param {string} imgName
 * */
utils.imgQuery = (imgName) => {
  let img, grayImg, pos;
  try {
    img = captureScreen(); // 截取当前屏幕
  } catch (err) {
    utils.imageAuth();
    sleep(2000);
    try {
      img = captureScreen(); // 截取当前屏幕
    } catch (err) {
      console.log("本次截图失败了！");
    }
  }
  if (img) {
    console.log("app.versionCode===>", app.versionCode);
    let imgPath = `${files.cwd()}/img/${imgName}.png`; //638是在autoxjs上的路径开发测试使用,否则就是封装的APP
    console.log(imgPath);
    grayImg = images.grayscale(img); // 灰度化
    let targetImg = images.read(imgPath); // 读取裁剪图片
    pos = images.findImage(img, targetImg); // 在全图中查找坐标
  }
  return pos;
};
/**线程
 * @param {function} fn 执行的函数
 * @param {any} data 函数执行的参数
 * @param {number} timeOut 执行超过多少时间还没结束关闭线程
 */
utils.thread = (fn, data, timeOut) => {
  console.log("timeOut===>", data, timeOut);
  utils.task_thread = threads.start(() => {
    console.log("子线程执行任务开始====>");
    try {
      data ? fn(data) : fn();
    } catch (error) {
      utils.msg = "运行错误===>" + error;
      utils.code = 0;
      utils.task_thread.interrupt();
    }
  });
  utils.task_thread.waitFor();
  utils.task_thread.join(timeOut || 0);
  if (utils.task_thread.isAlive()) {
    console.log("任务超过时间强制关闭子线程");
    utils.msg =
      "任务超时强制关闭任务,超时原因遇到未知的错误导致程序无法顺利执行";
    utils.code = 0;
    utils.task_thread.interrupt();
  }
};
// 判断是否是JSON
utils.isJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};
// 数组去重拿到文本
utils.uniqueArr = (arr) => {
  let newArr = {};
  arr.forEach((item, index, arr) => {
    let str = String.prototype.replace.call(item, /\s+/gi, "");
    newArr[str] = 0;
  });
  return Object.keys(newArr);
};
// 点击坐标中心
utils.centreClick = (bounds) => {
  let r = click(bounds.centerX(), bounds.centerY());
  if (!r) {
    console.log("本次操作无障碍失效");
  }
  sleep(300);
};
// 长按点击坐标中心
utils.centreLongClick = (bounds) => {
  longClick(bounds.centerX(), bounds.centerY());
  sleep(300);
};
//查找今天要发的任务
utils.getToday = (type) => {
  type = type || "day";
  function getCurrentTime() {
    let date = new Date(); //当前时间
    let month = zeroFill(date.getMonth() + 1); //月
    let day = zeroFill(date.getDate()); //日
    let hour = zeroFill(date.getHours() - 1); //时
    //当前时间
    let curTime = "";
    if (type === "day") {
      curTime = month + "月" + day + "日";
    } else {
      curTime = month + "月" + day + "日" + " " + hour;
    }
    return curTime;
  }

  function zeroFill(i) {
    if (i >= 0 && i <= 9) {
      return "0" + i;
    } else {
      return String(i);
    }
  }
  return getCurrentTime();
};
// 关闭后台APP
utils.closeApp = (appName) => {
  try {
    app.openAppSetting(getPackageName("企业微信"));
    sleep(1000);
    click("强行停止", 0);
    sleep(1000);
    click("强行停止", 1);
    sleep(1000);
    app.launchPackage(getPackageName("企业微信"));
    sleep(6000);
  } catch (error) {
    try {
      recents();
      sleep(1000);
      let leftName = ""; //左滑当前名称
      let rightName = ""; //右滑当前名称
      // let leftNum = 0;
      // let rightNum = 0;
      let isCenter = false; //查找的APP是否在中心点
      //判断当前APP是否在任务中间位置
      function isCenterApp() {
        let qywx = text(appName).visibleToUser(true).findOne(1000); //获取可见下的node
        let isCenter = false;
        if (qywx) {
          isCenter = qywx.bounds().centerX() < device.width / 2; //节点的中心点是否小于屏幕宽度的中心点
        }
        return qywx && isCenter;
      }
      //找到当前中心位置的任务名称
      function getCenterAppName() {
        let nodes = className("TextView").visibleToUser(true).find();
        if (nodes) {
          for (let n = 0; n < nodes.size(); n++) {
            let node = nodes.get(n);
            if (node) {
              let ncenterX = node.bounds().centerX(); //节点的中心点
              let dcenterX = device.width / 2; //屏幕的中心点
              if (ncenterX <= dcenterX && ncenterX >= 200) {
                console.log(node.text()); //中心点应用名称
                return node.text();
              }
            }
          }
        }
      }
      isCenter = isCenterApp();
      while (!isCenter && leftName != getCenterAppName()) {
        leftName = getCenterAppName();
        console.log("左滑动查找");
        // leftNum += 1;
        let ok = utils.swipe(
          device.width * 0.1,
          device.height / 2,
          device.width * 0.9,
          device.height / 2,
          500
        ); //下滑动
        sleep(500);
        isCenter = isCenterApp();
      }
      while (!isCenter && rightName != getCenterAppName()) {
        rightName = getCenterAppName();
        console.log("右滑动查找");
        // rightNum += 1;
        let ok = utils.swipe(
          device.width * 0.9,
          device.height / 2,
          device.width * 0.1,
          device.height / 2,
          500
        ); //下滑动
        sleep(500);
        isCenter = isCenterApp();
      }
      if (isCenter) {
        sleep(1000);
        console.log("找到===>" + appName);
        let ok = utils.swipe(
          device.width / 2,
          device.height * 0.6,
          device.width / 2,
          device.height * 0.1,
          500
        ); //下滑动
        console.log(ok);
      }
      sleep(500);
      home();
    } catch (error) {
      console.log("关闭应用失败");
    }
  }
};
//获取2023618类型时间
utils.getDayStr = (time) => {
  function zeroFill(i) {
    if (i >= 0 && i <= 9) {
      return "0" + i;
    } else {
      return String(i);
    }
  }
  let date = time ? new Date(time) : new Date();
  let y = date.getFullYear();
  let m = zeroFill(date.getMonth() + 1);
  let d = zeroFill(date.getDate());
  return y + "-" + m + "-" + d;
};
// 意图
utils.action = (action) => {
  let actionObj = {
    wuzhangai: "android.settings.ACCESSIBILITY_SETTINGS", //无障碍
    dianchi: "android.settings.BATTERY_SAVER_SETTINGS", //电池设置
    xiumian: "android.settings.DISPLAY_SETTINGS", //休眠设置
  };
  app.startActivity({
    action: actionObj[action],
  });
};
// ======================================================任务========================================
/**ws消息处理*/
utils.messageHandler = (task) => {
  let { msgType, corpName, msgId, data } = JSON.parse(task);
  try {
    if (corpName && data) {
      data["corpName"] = corpName;
    }
  } catch (error) {
    data = { corpName };
  }
  if (!data) {
    data = { corpName };
  }
  if (utils.filterTaskList.some((id) => msgId == id)) {
    console.log("当前任务被过滤不再执行====>", msgId);
    utils.filterTaskList = utils.filterTaskList.filter((id) => id != msgId);
    console.log(
      "已停止本次任务,从过滤任务数组中清除此任务，避免下次执行再次被过滤",
      utils.filterTaskList
    );
    utils.msg = msgId + "此任务ID被主动过滤执行！";
    utils.code = 0;
    return;
  }
  switch (msgType) {
    case "send_corp_moment_send": //朋友圈任务
      console.log("朋友圈任务1======>");
      utils.thread(qw.sendMoments, data, utils.task_moments_time);
      break;
    case "send_corp_group_send": //群发任务
      console.log("群发任务====>");
      // let today = utils.getDayStr();
      // let task_succeed = commonStorage.get(today); //获取今天的数据是否存在
      // if (!task_succeed || Date.now() - Number(task_succeed) > 11 * 60 *1000)//task_succeed不存在或者
      utils.thread(qw.sendMass, data, utils.task_mass_time);
      break;
    case "send_update": //更新手机信息
      utils.thread(qw.getKfName, null, utils.task_kfName_time); //获取客服名称并上报
      break;
    case "send_corp_moment_comment": //朋友圈评论
      utils.thread(qw.comment, data, utils.task_comment_time); //获取客服名称并上报
      break;
    case "del_tag_friend": //删单向好友
      utils.thread(qw.delFriendAll, data, utils.task_delFriend_time);
      break;
    case "send_corp_pull_group": //建群拉人或进群拉人
    case "send_corp_pull_group_otherB": //建群拉人或进群拉人
    case "send_corp_pull_group_otherA": //建群拉人或进群拉人
      data["msgType"] = msgType;
      utils.thread(qw.createGroup, data, utils.task_createGroup_time);
      break;
    case "phone_preview_action": //预览操作手机动作
      utils.thread(
        () => {
          eval(data.action);
        },
        data,
        utils.task_comment_time
      );
      break;
    case "del_corp_moment_send": //删朋友圈
      utils.thread(qw.delFriends, data, utils.task_createGroup_time);
      break;
  }
};
// 添加任务到队列
utils.addTask = (task, socket) => {
  utils.websocket = socket;
  let is_json = utils.isJSON(task);
  if (is_json) {
    let { msgType, userId, update_version, data } = JSON.parse(task);
    if (msgType !== "send_heart") {
      console.log("接收到服务端任务信息=====>", task);
    }
    switch (msgType) {
      case "send_heart":
        // console.log("接收到服务器心跳====>");
        break;
      case "start_phone_preview":
        toastLog("预览手机", data);
        events.broadcast.emit("startPreviewDevice", {
          userId,
          data: data || {},
        });
        break;
      case "stop_phone_preview":
        toastLog("停止手机预览");
        events.broadcast.emit("stopPreviewDevice", userId);
        break;
      case "app_update":
        console.log("更新版本===>");
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
        }
        utils.update_thread = threads.start(() => {
          let isOk = utils.taskQueue.length === 0;
          while (utils.taskQueue.length > 0) {
            isOk = utils.taskQueue.length === 0;
          }
          utils.send("app_update", {
            msgType: "app_update",
            code: 200,
          });
          if (isOk) {
            toastLog("准备版本更新,更新后请重启APP===>");
            utils.isTaskRunning = true;
            events.broadcast.emit("app_update", update_version);
            utils.update_thread.interrupt();
          }
        });
        break;
      case "app_upLog":
        toastLog("上传日志！");
        console.log(JSON.parse(task));
        utils.initApp();
        events.broadcast.emit("upLog", data.date, userId);
        break;
      case "phone_activate":
        console.log("唤醒手机");
        utils.initApp();
        break;
      case "filter_task":
        console.log("过滤任务等于取消对应msgId任务执行！！！");
        utils.filterTaskList = utils.filterTaskList.concat(data.filterTaskList);
        break;
      default:
        utils.taskQueue.push(task);
        if (!utils.isTaskRunning) {
          utils.executeNextTask(); // 如果不存在执行中的任务，则立即执行下一个任务
        }
        break;
    }
  } else {
    utils.send("error", {
      msgType: "error",
      code: 0,
      data: { msg: "任务信息不是JSON" },
    });
  }
};
// 执行下一个任务
utils.executeNextTask = () => {
  if (utils.taskQueue.length > 0) {
    events.broadcast.emit("mylog", 0); //关闭控制台以免出错
    utils.isTaskRunning = true;
    var task = utils.taskQueue.shift(); // 取出队列中的第一个任务
    utils.msg = ""; //重置任务信息
    utils.code = 200; //重置状态
    utils.taskResult = null; //重置任务结果
    utils.msgType = "receive_task_callback"; //重置为默认状态
    utils.messageHandler(task); //执行任务
    utils.isTaskRunning = false;
    console.log("任务执行完成！！！", utils.msg, utils.code);
    let { msgType, corpName, msgId, data } = JSON.parse(task);
    let newAppConfig = JSON.parse(JSON.stringify(appConfig)); //复制appData
    delete newAppConfig["uuid"];
    if (msgType === "del_tag_friend") {
      //删除好友的返回结果处理
      newAppConfig["taskResult"] = utils.taskResult;
    } else {
      for (let key in data) {
        newAppConfig[key] = data[key];
      }
    }
    let obj = {
      //组装要发回服务器的内容
      code: utils.code,
      uuid: appConfig.uuid,
      msgId,
      msgType: msgTypeEnum[msgType] || utils.msgType,
      corpName,
      data: newAppConfig,
    };
    if (utils.code === 0) {
      obj.errMsg = utils.msg;
    }
    utils.send(msgTypeEnum[msgType] || utils.msgType, obj);
    if (utils.taskQueue.length === 0 && msgType !== "phone_preview_action") {
      console.log("任务池中没有任务了===>返回秘密基地");
      utils.initApp();
    }
    utils.executeNextTask(); // 继续执行下一个任务
  } else {
    // events.broadcast.emit("mylog", 1);//最小化控制台
    console.log("任务池中没有任务了====>");
  }
};
// ==================initApp=============
utils.initApp = () => {
  if (!device.isScreenOn()) {
    device.wakeUp();
    utils.swipe(
      device.width / 2,
      device.height - 100,
      device.width / 2,
      0,
      500
    ); // 上滑解锁
  } else {
    console.log("亮着");
  }
  // app.launchPackage("com.shenwu.qw.m");//返回秘密基地
};
// =====================================本地缓存===================
// 数据map
var dataMap = {};
/**
 * 设置UI缓存数据
 * @param {*} settingkeyArr UI设置key数组
 * @param {*} storageObj 储存对象
 */
utils.setUICacheData = (settingkeyArr, storageObj) => {
  settingkeyArr.forEach((item) => {
    let key = item.key; // key
    let type = item.type; // 类型
    if (!ui[key]) {
      return;
    }
    console.log("key===>", key, type);
    let value = "";
    switch (type) {
      case "开关":
        value = ui[key].isChecked();
        break;
      case "输入框":
        value = ui[key].text();
        break;
    }
    // log("value===>",value)
    storageObj.put(key, value);
  });
};

/**
 * 获取UI缓存数据
 * @param {*} settingkeyArr  UI设置key数组
 * @param {*} storageObj 储存对象
 */
utils.getUICacheData = (settingkeyArr, storageObj) => {
  settingkeyArr.forEach((item) => {
    let key = item.key; // key
    let type = item.type; // 类型
    let value = storageObj.get(key) || ""; // 值
    let dataList = dataMap[key] || []; // 字典数据列表
    if (!ui[key]) {
      return;
    }
    switch (type) {
      case "开关":
        ui[key].setChecked(value || false);
        break;
      case "输入框":
        ui[key].setText(value);
        break;
    }
  });
};
//重置云控地址
utils.setYkws = () => {
  let r = http.get("47.99.91.240:8019/getIP");
  let json = r.body.json();
  if (json.code === 200) {
    console.log("获取到最新地址:云控地址====>", json.data);
    appConfig.ws_url_yk = `ws://${json.data}:8090`;
    appConfig.http_url_yk = `http://${json.data}:8089`;
  }
};

module.exports = utils;
