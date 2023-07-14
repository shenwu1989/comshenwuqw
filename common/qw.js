"auto";

var qw = {};
task_retry = 3;
// ======================================================企微脚本事件========================================
// 公共储存对象
var commonStorage = storages.create("shenwu1989@gmail.com" + "ui");
// 企业微信初始化
qw.qwInit = (corpName) => {
  console.log("初始化====>");
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
  // 判断当前是否存在软件更新
  if (utils.getTextName("软件更新")) {
    console.log("找到软件更新弹窗！！！");
    let btn = text("稍后").findOnce(1000);
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
    let btn1 = text("取消").findOnce(1000);
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
  } else {
    console.log("未找到软件更新弹窗");
  }
  // 判断当前是否打开企业微信，如果没有打开则打开企业微信
  qw.isApp();
  // 判断企微是否登录
  let loginState = qw.isLogin();
  if (!loginState) {
    toastLog("企微已登录");
    //查看是否投消息提示框
    qw.msgPup(); //是否有消息提示框有就取消掉
    qw.selectSf(corpName); //首次进入选身份
    console.log("init.qw.isQwHome====>");
    qw.isQwHome("消息");
    toast("准备就绪开始执行任务,请勿操作手机！");
  } else {
    toastLog("企微未登录");
    qw.overQwTask("企微未登录！");
  }
};
// 企微公司列表侧边栏
qw.openSidebar = (b) => {
  let node = text("高级功能").findOne(1000);
  if (node) {
    let pNode = utils.getParentNode(node, "android.widget.FrameLayout");
    if (pNode.parent().child(0).className() !== "android.widget.FrameLayout") {
      console.log("没有展开侧边栏");
      b && utils.rightSwipe();
    } else {
      console.log("侧边栏已是打开状态");
      !b && utils.leftSwipe();
    }
  } else {
    console.log("qw.openSidebar===>找不到高级功能node");
    // qw.isQwHome("消息");
    // qw.openSidebar(b);
  }
};
//判断企微是否登录
qw.isLogin = () => {
  let login = text("微信登录").className("android.widget.Button").findOne(1000);
  return !!login;
};
// 消息提示框点取消
qw.msgPup = () => {
  if (textContains("实时接收新消息提醒").exists()) {
    click("以后再说", 0);
  }
  if (textContains("实时接收新消息提醒").exists()) {
    click("以后再说", 0);
  }
};
//判断是否是企微不是重新打开
qw.isApp = () => {
  // 判断当前是否打开企业微信，如果没有打开则打开企业微信
  if (currentPackage() != "com.tencent.wework") {
    toastLog("qw.isApp打开企微");
    app.launchPackage("com.tencent.wework");
    toastLog("等待6秒让企微完成启动！！！");
    sleep(6000);
    if (!packageName("com.tencent.wework").exists()) {
      console.log("再次app.launchApp企业微信");
      app.launchApp("企业微信");
      toastLog("等待6秒让企微完成启动！！！");
      sleep(6000);
    }
  } else {
    toastLog("企业微信已打开");
  }
};
// 回首页并去指定菜单
qw.isQwHome = (name) => {
  // 判断当前是否是企微
  qw.isApp();
  let btn1 = textContains("消息").exists();
  let btn2 = textContains("邮件").exists();
  let btn3 = textContains("文档").exists();
  let btn4 = textContains("工作台").exists();
  let btn5 = textContains("通讯录").exists();
  let isHome =
    currentActivity() === "com.tencent.wework.launch.WwMainActivity" ||
    (btn1 && btn2 && btn3 && btn4 && btn5);
  let isqywx =
    currentPackage() === "com.tencent.wework" ||
    packageName("com.tencent.wework").exists(); //再次验证当前是否是企微
  let focusName = "";
  console.log("首页条件结果isqywx===>1", isqywx);
  console.log(
    "首页条件结果btn1, btn2, btn3, btn4, btn5===>2",
    btn1,
    btn2,
    btn3,
    btn4,
    btn5
  );
  console.log(
    "首页条件结果currentActivity() === com.tencent.wework.launch.WwMainActivity===>3",
    currentActivity() === "com.tencent.wework.launch.WwMainActivity"
  );
  if (isHome && isqywx) {
    //判断是否是企微并且在首页
    toastLog("当前在企微首页");
    name && getFocusName();
  } else {
    if (!isqywx) {
      toastLog("当前识别不在企微准备重新开启企微");
      utils.closeApp("企业微信");
      sleep(1000);
    }
    if (isqywx && !isHome) {
      toastLog("在企微返回上级页面");
      //在企微就返回上级
      back();
      sleep(500);
    }
    focusName = qw.isQwHome(name);
  }
  return focusName;
  function getFocusName() {
    sleep(2000);
    let node = text("通讯录").findOne(3000);
    if (node) {
      let pNode = utils.getParentNode(node, "android.view.ViewGroup");
      if (pNode) {
        try {
          let num = pNode.childCount();
          console.log("总共" + num + "子节点");
          for (let i = 0; i < num; i++) {
            let n = pNode.child(i);
            let txtNode = n.findOne(className("TextView").selected());
            if (txtNode) {
              focusName = txtNode.text();
              console.log("当前选中页面为===>", focusName);
              if (name && name != focusName) {
                console.log("准备切换到===>", name);
                let btn = text(name).findOne(1000);
                let ok = false;
                if (btn) {
                  ok = utils.centerClick(btn);
                }
                console.log("切换结果===>", ok);
                sleep(500);
              }
              break;
            }
          }
        } catch (error) {
          console.log("备用方案");
        }
      }
    } else {
      console.log("暂无通讯录节点");
      qw.isQwHome(name);
    }
  }
};
// 去指定公司
qw.gotoCorp = (corpName) => {
  try {
    utils.rightSwipe();
    qw.openSidebar(true); //侧边栏是否打开再次验证,没打开开启
    let node = depth(12).findOne(10000).parent().parent();
    let isOk = false; //是否在对应公司
    if (node) {
      let collection = node.children();
      let obj = collection.get(1);
      let gsNode = obj.findOne(className("android.widget.TextView"));
      let gsName = gsNode.text();
      isOk =
        String.prototype.replace.call(gsName, /[\s\(\d+\+?\)]/gi, "") ==
        corpName.replace(/\s/gi, "");
    }
    if (isOk) {
      console.log("在对应公司===>", corpName);
      utils.leftSwipe();
      click("消息", 0);
      return true;
    } else {
      console.log("不在对应公司===>", corpName);
      qw.openSidebar(true); //侧边栏是否打开再次验证,没打开开启
      let ok = qw.swipeCorp(
        corpName,
        "androidx.recyclerview.widget.RecyclerView"
      );
      if (!!ok) {
        console.log("=============切换公司成功！！！========");
        utils.centreClick(ok);
        console.log("==============查找是否需要身份验证==========");
        qw.selectSf(corpName);
        console.log("==============查看侧边栏是否需要关闭==========");
        qw.openSidebar(false); //侧边栏是否打开再次验证,已打开关闭
        console.log("==============点击消息进首页==========");
        utils.isChecked("消息");
        console.log("已进入===>", corpName);
        return true;
      } else {
        console.log("已进入对应公司关闭侧边栏");
        utils.leftSwipe();
        return false;
      }
    }
  } catch (error) {
    console.log("去指定公司出错了！！！", error);
    return qw.gotoCorp(corpName);
  }
};
// 消息窗口滑动
qw.msgSwipe = (direction) => {
  function up() {}
  function down() {}
};
// 去发群发
qw.sendMass = (data, retry) => {
  retry = retry || 0;
  let isOk = false;
  toastLog(`第${retry + 1}次执行任务！`);
  let { corpName, msgId } = data;
  // 错误处理
  function taskErr(msg) {
    if (!isOk && retry >= task_retry) {
      console.log(msg);
      utils.taskErrImg(msgId ? msgId + "_group_" : "group_");
      utils.msg = msg;
      utils.code = 0;
      qw.isQwHome();
      return;
    }
    if (!isOk && retry < task_retry) {
      toastLog("延迟1分钟再次尝试===>", retry);
      qw.retry("sendMass", data, retry + 1);
    }
  }

  qw.qwInit(corpName); //每次初始化企微，确保设备被唤醒，并且已打开企微并在首页
  let ok = qw.gotoCorp(corpName); //切换公司
  if (!ok) {
    retry = task_retry + 1;
    taskErr("找不到指定公司！！！！");
    return;
  } else {
    //新方法走工作台
    try {
      click("工作台");
      sleep(2000);
      click("群发助手");
      sleep(1000);
      let btn = className("TextView")
        .textEndsWith("企业消息待发送")
        .findOne(5000);
      let ok = null;
      if (btn) {
        console.log("存在企业消息待发送按钮");
        ok = btn.click();
        if (!ok) {
          console.log("b2");
          ok = click(btn.text(), 0);
          if (!ok) {
            console.log("b3");
            ok = utils.centerClick(btn);
          }
        }
        //进入后等待3秒
        sleep(3000);
        let list = className("TextView")
          .textMatches(
            /(刚刚)|(\d+分钟前)|(\d+:\d+)|([上下午]{0,2}\s{0,2}\d+:\d+)/
          )
          .find(); //加上下午 05:24 这样的时间
        if (list) {
          let num = list.size();
          console.log("共找到" + num + "条匹配的群发消息");
          for (let i = 0; i < num; i++) {
            let node = list.get(i);
            if (node) {
              console.log("当前为" + node.text() + "的群发消息！");
              let tp = node.parent().parent();
              function getP(node) {
                if (node) {
                  let tbtn = node.findOne(
                    className("TextView").textStartsWith("发送")
                  );
                  return tbtn;
                }
              }
              let tbtn = getP(tp);
              if (!tbtn) {
                tbtn = getP(tp.parent());
              }
              if (tbtn) {
                let ok = tbtn.click();
                if (!ok) {
                  utils.centerClick(tbtn);
                }
                isOk = true;
                retry = task_retry + 1;
                sleep(1000);
              }
            }
          }
          if (num === 0) {
            taskErr("找不到今天的群发消息");
          }
        } else {
          taskErr("找不到今天的群发消息");
        }
      } else {
        taskErr("找不到企业消息待发送！！！");
      }
    } catch (error) {
      taskErr("执行群发任务程序中途出错！！！");
    }
  }
};
// 去发朋友圈
qw.sendMoments = (data, retry) => {
  retry = retry || 0;
  let isOk = false;
  toastLog(`第${retry + 1}次执行任务！`);
  let { corpName, msgId } = data;
  // 错误处理
  function taskErr(msg) {
    if (!isOk && retry >= task_retry) {
      console.log("找不到客户朋友圈");
      utils.taskErrImg(msgId ? msgId + "_moment_" : "moment_");
      utils.msg = msg;
      utils.code = 0;
      qw.isQwHome();
      return;
    }
    if (!isOk && retry < task_retry) {
      qw.retry("sendMoments", data, retry + 1);
    }
  }
  console.log("开始执行朋友圈任务！！！");
  qw.qwInit(corpName); //每次初始化企微，确保设备被唤醒，并且已打开企微并在首页
  let ok = qw.gotoCorp(corpName); //切换公司
  if (!ok) {
    retry = task_retry + 1;
    taskErr("找不到指定公司！！！！");
    return;
  } else {
    //新方式走工作台
    try {
      click("工作台");
      sleep(2000);
      if (textContains("客户朋友圈").exists()) {
        console.log("当前为客户朋友圈");
        click("客户朋友圈");
        sleep(1000);
      }
      if (textContains("学员朋友圈").exists()) {
        console.log("当前为学员朋友圈");
        click("学员朋友圈");
        sleep(1000);
      }
      let btn = text("去发表").findOne(5000);
      let ok = null;
      if (btn) {
        console.log("存在去发表按钮");
        ok = btn.click();
        if (!ok) {
          console.log("b2");
          ok = click("去发表", 0);
          if (!ok) {
            console.log("b3");
            ok = utils.centerClick(btn);
          }
        }
        //进入后等待3秒
        sleep(3000);
        let date = utils.getToday();
        console.log("查找的时间" + date + "的朋友圈");
        let list = className("TextView").textStartsWith(date).find();
        if (list) {
          let num = list.size();
          console.log("共找到" + num + "条匹配的朋友圈");
          for (let i = 0; i < num; i++) {
            let node = list.get(i);
            if (node) {
              console.log("当前为" + node.text() + "的消息！");
              let tp = node.parent().parent();
              function getP(node) {
                if (node) {
                  let tbtn = node.findOne(
                    className("TextView").textStartsWith("发表")
                  );
                  return tbtn;
                }
              }
              let tbtn = getP(tp);
              if (!tbtn) {
                tbtn = getP(tp.parent());
              }
              if (tbtn) {
                let ok = tbtn.click();
                if (!ok) {
                  utils.centerClick(tbtn);
                }
                isOk = true;
                retry = task_retry + 1;
                sleep(1000);
              }
            }
          }
          if (num === 0) {
            taskErr("找不到匹配" + date + "的朋友圈");
          }
        } else {
          // console.log("找不到列表,尝试点击第一条发表任务！！！");
          // let ok = click("发表", 0);
          if (!ok) {
            taskErr("找不到匹配" + date + "的朋友圈");
          }
        }
      } else {
        taskErr("找不到去发表按钮！！！");
      }
    } catch (error) {
      taskErr("执行朋友圈任务程序中途出错！！！");
    }
  }
};
// 切换公司滑动查找公司
qw.swipeCorp = (corpName, name) => {
  // 查找结果
  let ok = false;
  let bounds = null;
  // 滑动开关
  let downSwipes = true;
  let upSwipes = true;
  // 待查找的文字
  let targetText = corpName;
  // 找到的文字对比判断是否到顶部和底部,
  let topTxt = "";
  let bottmTxt = "";
  if (targetText) {
    console.log("要查找的公司名称===>", targetText);
    // 找到指定文字后跳出循环
    while (downSwipes) {
      console.log("向上滑动查找");
      let txt = utils.queryListText(name);
      console.log("topTxt,txt", topTxt, txt, topTxt != txt);
      if (topTxt != txt) {
        //判断上次记录的顶部文字是否等于当前顶部文字 不相同代表没有到顶部再次滑动
        topTxt = txt;
        // 查找文本
        if (text(targetText).exists()) {
          console.log("已找到：" + targetText);
          // 找到后关掉上下滑动
          downSwipes = false;
          upSwipes = false;
          // 找到后记录状态
          ok = true;
          bounds = text(targetText).findOne().bounds();
          break;
        }
        utils.upSwipe();
      } else {
        //上次和本次查到的文本一样已到顶部关闭顶部滑动
        console.log("向上滑动查找结束已到顶部");
        downSwipes = false;
      }
    }
    while (upSwipes) {
      console.log("向下滑动查找");
      let txt = utils.queryListText(name, "bottom");
      console.log("bottmTxt,txt", bottmTxt, txt, bottmTxt != txt);
      if (bottmTxt != txt) {
        bottmTxt = txt;
        // 查找文本
        if (text(targetText).exists()) {
          console.log("已找到：" + targetText);
          // 找到后关掉上下滑动
          downSwipes = false;
          upSwipes = false;
          // 找到后记录状态
          ok = true;
          bounds = text(targetText).findOne().bounds();
          break;
        }
        utils.downSwipe();
      } else {
        console.log("向下滑动查找结束已到底部");
        upSwipes = false;
      }
    }

    // 如果未找到指定文字，则提示未找到
    if (!ok) {
      console.log("未找到：" + targetText);
      utils.msg = "未找到：" + targetText;
      utils.code = 0;
      console.log("utils.msg===>", utils.msg);
    }
    return bounds;
  } else {
    console.log("没有传入公司名称，默认直接选第一个公司");
    let txt = utils.queryListText(name);
    bounds = text(txt).findOne().bounds();
    return bounds;
  }
};
// 滑动获取全部公司名称
qw.swipeGetCorpList = (name) => {
  // 查找结果
  let corpList = [];
  // 滑动开关
  let downSwipes = true;
  let upSwipes = true;
  // 找到的文字对比判断是否到顶部和底部,
  let topTxt = "";
  let bottmTxt = "";

  // 找到指定文字后跳出循环
  while (downSwipes) {
    console.log("向上滑动查找");
    let txts = utils.queryListText(name, "list");
    corpList = corpList.concat(txts);
    console.log("topTxt,txts", topTxt, txts[0], topTxt != txts[0]);
    if (topTxt != txts[0]) {
      //判断上次记录的顶部文字是否等于当前顶部文字 不相同代表没有到顶部再次滑动
      topTxt = txts[0];
      utils.upSwipe();
    } else {
      //上次和本次查到的文本一样已到顶部关闭顶部滑动
      console.log("向上滑动查找结束已到顶部");
      downSwipes = false;
    }
  }
  while (upSwipes) {
    console.log("向下滑动查找");
    let txts = utils.queryListText(name, "list");
    console.log(
      "topTxt,txts",
      bottmTxt,
      txts[txts.length - 1],
      bottmTxt != txts[txts.length - 1]
    );
    corpList = corpList.concat(txts);
    if (bottmTxt != txts[txts.length - 1]) {
      bottmTxt = txts[txts.length - 1];
      utils.downSwipe();
    } else {
      console.log("向下滑动查找结束已到底部");
      upSwipes = false;
    }
  }
  return utils.uniqueArr(corpList);
};
// 判断是否需要选择身份进入
qw.selectSf = (corpName) => {
  let node = text("选择工作身份").findOne(1000 * 2);
  if (!!node && utils.getTextName("选择工作身份")) {
    console.log("需要选择身份");
    // sleep(500);
    let ok = qw.swipeCorp(corpName, "android.widget.ListView");
    if (!!ok) {
      utils.centreClick(ok);
    }
    // click(corpName, 0);
    // sleep(500);
    utils.waitForName("进入");
    let xy = utils.queryTextXY("进入");
    utils.centreClick(xy);
    // sleep(1000);
  } else {
    console.log("无需身份验证！！");
  }
};
// 获取客服名称
qw.getKfName = () => {
  qw.qwInit();
  utils.waitForName("消息");
  // 若没选中消息点击
  utils.isChecked("消息");
  sleep(1000);
  utils.rightSwipe();
  qw.openSidebar(true); //侧边栏是否打开再次验证,没打开开启
  utils.waitForName("高级功能");
  console.log("左侧等待列表出现！！");
  className("androidx.recyclerview.widget.RecyclerView").findOne(2000);
  let name = "";
  name = depth(12).findOne(10000).text();
  console.log("客服名称===》", name);
  appConfig.qw_name = name;
  appConfig.qw_corp_list = qw.swipeGetCorpList(
    "androidx.recyclerview.widget.RecyclerView"
  );
  commonStorage.put("qw_name", appConfig.qw_name);
  commonStorage.put("qw_corp_list", JSON.stringify(appConfig.qw_corp_list));
  utils.leftSwipe();
  qw.openSidebar(false); //侧边栏是否打开再次验证并关闭
};
//朋友圈评论
qw.comment = (data) => {
  let { corpName } = data;
  qw.qwInit(corpName); //初始化
  let ok = qw.gotoCorp(corpName); //切换公司
  if (!ok) {
    return;
  }
  // 查找朋友圈文本按钮
  if (utils.getTextName("客户朋友圈")) {
    click("客户朋友圈", 0);
    sleep(500);
    // 等待今天文本是否在朋友圈
    utils.waitForName("今天");
    qw.setComment(data);
  } else {
    utils.msg = "找不到客户朋友圈";
    utils.code = 0;
    return;
  }
};
// 去朋友圈评论
qw.setComment = (data) => {
  let { comment_title, comment_like, comment_content } = data;
  if (comment_title || comment_content) {
    if (utils.getTextName(comment_title)) {
      console.log("在朋友圈界面");
      click(comment_title, 0);
      sleep(500);
      let node = depth(15).findOne(2000);
      if (comment_like && node) {
        console.log("点赞一下！");
        node.parent().child(0).click();
      }
      if (comment_content && textContains("评论").exists()) {
        console.log("开始评论");
        //点击评论按钮
        click("评论", 0);
        sleep(300);
        // 查找输入框
        let input = className("android.widget.EditText").findOne(2000);
        // 输入文本
        input.setText(comment_content);
        // 点击输入框
        depth(9).findOnce(5).click();
        qw.isQwHome();
      } else {
        utils.code = 0;
        utils.msg = "找不到评论按钮或点击失败";
      }
    } else {
      console.log("找不到指定朋友圈内容");
      utils.code = 0;
      utils.msg = "找不到对应朋友圈内容";
      qw.isQwHome();
    }
  } else {
    console.log("不需要评论");
  }
};
//终止线程任务
qw.overQwTask = (msg) => {
  console.log(msg + "：终止企微任务！！");
  utils.msg = msg;
  utils.code = 0;
  if (utils.task_thread.isAlive()) {
    utils.task_thread.interrupt();
  }
};
// 延迟1分钟再次尝试执行任务
qw.retry = (taskName, data, retry) => {
  //======== 延迟一分钟执行消息开始==========
  let t = 0;
  toast("1分钟后重新尝试执行任务！！！");
  while (t <= 60) {
    t += 5;
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
    toastLog(`${65 - t}秒后重新尝试执行任务！！！`);
    sleep(5000);
  }
  sleep(500);
  //======== 延迟一分钟执行消息结束==========
  qw[taskName](data, retry);
};
// 批量删除好友
qw.delFriendAll = (data) => {
  let { corpName, msgId, delNum } = data;
  console.log("本次需要删除人数===>", delNum, data);
  qw.qwInit();
  sleep(1000);
  console.log("=============初始化结束=============");
  let gotoCorpOk = qw.gotoCorp(corpName); //切换公司
  console.log("=============切换公司结束=============！");
  if (!gotoCorpOk) {
    console.log("找不到指定公司！！！！");
    utils.taskErrImg(msgId ? msgId + "_delTagFriend_" : "_delTagFriend_");
    utils.msg = "找不到指定公司！！！！";
    utils.code = 0;
    qw.isQwHome();
    return;
  } else {
    console.log("=============开始删除好友=============！！！");
    qw.delTagFriend(0, 0, msgId, delNum, corpName);
  }
};
/**批量删标签好友
 *@param {number} count  已删除多少个好友
 *@param {number} num 已重试多少次
 */
qw.delTagFriend = (count, num, msgId, totalNum, corpName) => {
  console.log("qw.delTagFriend====>");
  let delNum = count || 0; //本次操作删除个数
  let isShowLog = true; //本次结果是否打印
  let isTop = false; //是否通讯录顶部，以我的客户我的学员判断
  let topNum = 0;
  msgId = msgId || 0;
  //判断是否在企微首页
  qw.isQwHome("通讯录");
  sleep(1000);
  console.log("判断是否在通讯录顶部并进入");
  // 判断是否在通讯录顶部并进入
  while (!isTop && topNum < 10) {
    //进入我的客户
    if (textContains("我的客户").exists()) {
      isTop = true;
      click("我的客户");
      sleep(1000);
    } else if (textContains("我的学员").exists()) {
      isTop = true;
      click("我的学员");
      sleep(1000);
    } else if (textContains("外部联系人").exists()) {
      isTop = true;
      click("外部联系人");
      sleep(1000);
    }
    if (!isTop) {
      utils.upSwipe();
      topNum += 1; //滑动次数
      sleep(500);
    }
  }
  if (!isTop && topNum >= 10) {
    taskErr("滑动10次未找到我的客户");
    return;
  } else {
    console.log("进入客户信息界面");
    //进入客户
    function ckUser(node) {
      let ok = utils.centerClick(node) && text("客户信息").findOne(2000); //等待客户信息字段
      let delOk = false;
      if (ok) {
        delOk = deleteUser();
      } else {
        console.log("未找到客户信息字段");
      }
      console.log("等待1秒");
      return delOk;
    }
    //点击删除好友操作
    function deleteUser() {
      console.log("单向好友删除处理");
      let node = text("客户信息").findOne(3000);
      let dxhy = textContains("QC_DELETED").exists();
      let userName = "";
      let fansImg = "";
      sleep(1000);
      let isOk = false;
      if (node && dxhy) {
        //获取到当前要删除人的名称做记录
        let wxStrNode = text("微信").findOne(1000);
        if (wxStrNode) {
          let pNode = wxStrNode.parent();
          for (let i = 0; i < pNode.childCount(); i++) {
            let node = pNode.child(i);
            let nodeText = node.findOne(className("TextView"));
            if (nodeText) {
              if (nodeText.text() && nodeText.text() != "微信") {
                console.log("nodeText.text()===>", nodeText.text());
                userName = nodeText.text(); //获取到当前用户名称
                break;
              }
            }
          }
        }
        //截图保存
        let date = new Date();
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        fansImg = encodeURIComponent(userName) + y + "" + m + "" + d;
        utils.taskErrImg(encodeURIComponent(userName), y + "" + m + "" + d);
        //找到节点
        let pNode = utils.getParentNode(node, "android.widget.RelativeLayout"); //查找节点的父节点
        if (pNode) {
          //拿到父节点
          let pNodeNum = pNode.children().size();
          let btn = pNode.child(pNodeNum - 1); //找进入个人信息界面的按钮
          if (btn) {
            let ok = utils.centerClick(btn);
            if (ok) {
              //进入到个人信息界面
              text("个人信息").findOne(2000); //等待个人信息字段2秒
              let delBtn = text("删除").visibleToUser(true).findOne(1000); //找到可见的
              while (!delBtn) {
                //循环滑动页面查找删除按钮
                utils.downSwipe(); //滑动界面
                console.log("滑动");
                delBtn = text("删除").visibleToUser(true).findOne(1000);
              }
              sleep(500);
              if (delBtn && delBtn.visibleToUser()) {
                //找到删除按钮
                let ok = utils.centerClick(delBtn); //点击删除
                if (ok) {
                  let okBtn = text("确认删除").findOne(2000);
                  isOk = utils.centerClick(okBtn); //点击确认删除
                  if (utils.taskResult) {
                    utils.taskResult = utils.taskResult.concat([
                      {
                        isOk,
                        userName,
                        fansImg,
                        corpName,
                        delTime: Date.now(),
                      },
                    ]);
                  } else {
                    utils.taskResult = [
                      {
                        isOk,
                        userName,
                        fansImg,
                        delTime: Date.now(),
                        corpName,
                      },
                    ];
                  }
                  console.log("utils.taskResult", utils.taskResult);
                }
              }
            }
          }
        }
      } else {
        console.log(node, "====单向好友标签===>", dxhy);
      }
      return isOk;
    }
    //进入标签界面
    sleep(3000);
    let isbq = text("标签").findOne(5000);
    console.log("进入好友列表界面", isbq);
    let ok = utils.clickNode({ strName: "标签" });
    if (!ok) {
      ok = click("标签", 0);
    }
    if (!ok) {
      console.log("未找到标签使用点击坐标");
      let node = text("标签").findOne(1000);
      console.log(node);
      if (node) {
        ok = utils.centerClick(node);
      }
    }
    if (ok) {
      toastLog("开始查找单向好友标签");
      //进入指定标签
      let tagOk = utils.clickNode({
        strName: "QC_DELETED",
        scroll: true,
        t: 500,
        endName: "查看更多标签",
      });
      if (tagOk) {
        console.log("开始删用户");
        //开始删用户
        sleep(1000);
        let wxUsers = text("＠微信").find(); //查找微信联系人字段列表
        while (wxUsers && wxUsers.size() > 0 && delNum < totalNum) {
          //查找到用户并且已删除的用户小于本次限制的人数
          //循环操作用户
          let ok = ckUser(wxUsers.get(0));
          if (ok) {
            delNum += 1;
          } else {
            if (num < 3) {
              console.log("退出循环重新进入！", num);
              isShowLog = false;
              qw.delTagFriend(delNum, num + 1, msgId, totalNum, corpName);
            } else {
              console.log("结束重试已超出重试次数！", num);
            }
            break;
          }
          sleep(2000); //等两秒删除界面消失
          if (textContains("个人信息").exists()) {
            back();
            sleep(500);
          }
          if (textContains("客户信息").exists()) {
            back();
            sleep(500);
          }
          text("企业标签").findOne(6000);
          wxUsers = text("＠微信").find(); //再次查找微信联系人字段列表
        }
        if (isShowLog) {
          console.log("已清完本次共删除", delNum, "重试次数", num);
        }
      } else {
        taskErr("未找到单向好友标签");
        return;
      }
    } else {
      taskErr("未找到标签文字");
      return;
    }
  }
  // 错误处理
  function taskErr(msg) {
    toastLog(msg);
    utils.taskErrImg(msgId ? msgId + "_delTagFriend_" : "_delTagFriend_");
    utils.msg = msg;
    utils.code = 0;
    qw.isQwHome();
    return;
  }
};
/** 建群拉人或进群拉人
 * @param {number} mode 0=建群拉人 1=进群拉人
 * @param {string} groupName 群名称
 * @param {string} tagName 标签名称
 * @param {number} retry 重试次数
 * */
qw.createGroup = (param, retry) => {
  let {
    mode,
    groupName,
    tagName,
    fixedTagName,
    corpUserList,
    corpName,
    msgId,
    newGroupOwner,
    autoOutGroup,
    msgType,
  } = param;
  console.log("msgType===>", msgType);
  retry = retry || 0;
  // (tagName = tagName || groupName), //标签名称不存在使用群名称
  mode = mode ? mode : "0"; //mode存在使用mode 不存在默认建群
  console.log("建群拉人或进群拉人param", param, retry);
  let isJyh = false;
  let strName = "";
  qw.qwInit(); //初始化
  sleep(1500);
  let gotoCorpOk = qw.gotoCorp(corpName); //切换公司
  if (!gotoCorpOk) {
    retry = task_retry + 1;
    taskErr("找不到指定公司！！！！");
    return;
  } else {
    click("工作台");
    sleep(2000);
    isJyh = !textContains("客户群").exists(); //是否是教育号
    strName = isJyh ? "学员群" : "客户群";
    console.log("isJyhisJyhisJyhisJyhisJyh====>", isJyh);
    //进入客户群界面
    let ok = utils.clickNode({
      strName,
    });
    sleep(500);
    if (ok) {
      //进入客户群界面后
      switch (mode) {
        case "1": //进群拉人
          console.log(mode + "=进群拉人");
          if (msgType && msgType == "send_corp_pull_group_otherA") {
            let waitNode = utils.waitNode({ name: "创建一个" + strName }); //等待对应界面加载
            console.log("waitNode===>", "创建一个" + strName, !!waitNode);
            if (waitNode) {
              back();
              sleep(1000);
            }
            click("消息");
            sleep(2000);
            let queryNode = className("RelativeLayout")
              .depth(11)
              .drawingOrder(2)
              .find();
            utils.centerClick(queryNode.get(1));
            // click(800,180)
            sleep(1000);
            let input = text("搜索").findOne(2000);
            input && input.setText(groupName);
            sleep(1500);
            let goGroup = utils.clickNode({
              strName: groupName,
              scroll: true,
              endName: "查看更多群",
              eq: 1,
            });
            if (goGroup && !textStartsWith("快捷回复").exists()) {
              console.log("11111");
              let nodes = text(goGroup).find();
              if (nodes) {
                utils.centerClick(nodes.get(1));
                sleep(1500);
              }
            }
            if (goGroup) {
              console.log("进入群详情界面");
              sleep(1000);
              let dddckOk = false; //点击点点点
              let topNode = className("RelativeLayout").findOne(1000); //查找顶部父节点
              if (topNode && topNode.childCount() > 0) {
                //查到父节点，并且字节点大于0
                console.log("找到ddd节点", topNode.childCount() - 1);
                let node = topNode.child(topNode.childCount() - 1);
                dddckOk = utils.centerClick(node);
              } else {
                //否则点击绝对坐标
                console.log("暂无节点尝试点击坐标");
                dddckOk = click(936, 174); //群聊点点点的绝对坐标
              }
              sleep(1500);
              addTagUser(); //开始拉人
            } else {
              taskErr("进入群失败");
              return;
            }
          } else {
            let waitNode = utils.waitNode({ name: "创建一个" + strName }); //等待对应界面加载
            console.log("waitNode===>", "创建一个" + strName, !!waitNode);
            if (waitNode) {
              let ckOk = utils.centerClick(waitNode);
              sleep(1000);
              let query = click(1000, 170);
              if (query) {
                sleep(1000);
                let input = text("搜索").findOne(2000);
                input && input.setText(groupName);
                sleep(1500);
              }
              if (ckOk) {
                let waitNode = utils.waitNode({ name: "按条件筛选", mode: 1 }); //等待对应界面加载
                console.log("进入群列表");
                if (waitNode) {
                  let goGroup = utils.clickNode({
                    strName: groupName,
                    scroll: true,
                    t: 500,
                  });
                  if (goGroup) {
                    console.log("进入群详情界面");
                    addTagUser(); //开始拉人
                  } else {
                    taskErr("进入群失败");
                    return;
                  }
                } else {
                  taskErr("找不到" + "按条件筛选");
                  return;
                }
              } else {
                taskErr("无障碍失效");
                return;
              }
            } else {
              taskErr("找不到" + "企业全部" + strName);
              return;
            }
          }

          break;
        default:
          console.log(mode + "=建群拉人");
          if (textContains(strName).exists()) {
            let isOk = utils.clickNode({
              strName: "创建一个" + strName,
            });
            let waitR = utils.waitNode({ name: "群聊(1)", mode: 1 }); //等待创建完成界面
            console.log("等待群聊界面结果", !!waitR);
            if (isOk) {
              let setNameOk = false;
              if (waitR) {
                setNameOk = editGroupName(); //编辑群名称
                sleep(1500);
                console.log("修改群名完成！");
                if (setNameOk) {
                  let dddckOk = false; //点击点点点
                  let topNode = className("RelativeLayout").findOne(1000); //查找顶部父节点
                  if (topNode && topNode.childCount() > 0) {
                    //查到父节点，并且字节点大于0
                    console.log("找到ddd节点", topNode.childCount() - 1);
                    let node = topNode.child(topNode.childCount() - 1);
                    dddckOk = utils.centerClick(node);
                  } else {
                    //否则点击绝对坐标
                    console.log("暂无节点尝试点击坐标");
                    dddckOk = click(936, 174); //群聊点点点的绝对坐标
                  }
                  sleep(1500);
                  if (dddckOk) {
                    addTagUser(); //拉人
                  } else {
                    taskErr("聊天界面进入ddd失败");
                    return;
                  }
                }
              } else {
                taskErr("建群已被限制！！！");
              }
            } else {
              taskErr("找不到" + "创建一个" + strName);
              return;
            }
          }
          break;
      }
    } else {
      taskErr("找不到" + strName);
      return;
    }
  }

  //==================函数方法==========
  // 修改群名
  function editGroupName() {
    sleep(1000);
    let setNameOk = false;
    let inputNameNode = utils.waitNode({ mode: 2, name: "立即填写" }); //等待界面元素
    if (inputNameNode) {
      //找到立即填写节点
      console.log("找到立即填写，开始改群名");
      let top = inputNameNode.bounds().centerY();
      let right = inputNameNode.bounds().right - 80;
      let ckOk = click(right, top);
      if (ckOk) {
        let textInputNode = text("群名称").findOne(3000);
        if (textInputNode) {
          textInputNode.setText(groupName);
          sleep(500);
          setNameOk = click("确定");
        }
      } else {
        taskErr("无障碍失效");
        return;
      }
    }
    let waitR = utils.waitNode({ name: `${groupName}(1)`, mode: 1 }); //等待改名完成界面
    console.log("改名完成结果" + groupName, !!waitR);
    return setNameOk;
  }
  //按标签拉人
  function addTagUser() {
    let adddckOk = false;
    // 拉客服
    let lakf = false;
    if (corpUserList && corpUserList.length > 0) {
      add(); //点击添加用户按钮
    }
    if (adddckOk && corpUserList && corpUserList.length > 0) {
      sleep(500);
      let ok = utils.clickNode({
        //点击我的客户或者我的学员
        strName: "企业通讯录",
      });
      sleep(1000);
      if (ok) {
        let arr = corpUserList;
        for (let n of arr) {
          click(1000, 150);
          sleep(1500);
          let input = text("搜索").findOne(1000);
          input.setText(n);
          sleep(1500);
          let nameList = textStartsWith(n).find();
          if (nameList && nameList.size() > 0) {
            utils.centerClick(nameList.get(1));
          }
        }
        sleep(1500);
        lakf = click("确定", 0);
      }
    }
    // =============去群管理 =============
    let zhuanquanzhu = false; //转让群主是否成功
    console.log("去群管理===>", lakf, newGroupOwner);
    if (
      msgType == "send_corp_pull_group_otherB" ||
      msgType == "send_corp_pull_group"
    ) {
      sleep(1000);
      let qglNodeOk = utils.clickNode({
        strName: "群管理",
        scroll: true,
        endName: "退出群聊",
      });
      if (qglNodeOk) {
        let node = text("禁止改群名").findOne(1000);
        click(1000, node.bounds().top);
        sleep(1000);
        if (newGroupOwner) {
          let ok = click("转让群主", 0);
          sleep(1000);
          if (ok) {
            let node = textStartsWith(newGroupOwner).findOne(1000);
            let ok = false;
            if (node) {
              ok = utils.centerClick(node);
            } else {
              back();
            }
            if (ok) {
              sleep(500);
              zhuanquanzhu = click("确定", 0);
            }
          }
        } else {
          if (textContains("禁止改群名").exists()) {
            console.log("从群管理返回上一层===>");
            back();
          }
        }
      }
    }
    // ============= 拉固定客户 =============

    if (fixedTagName) {
      sleep(1500);
      add();
      if (adddckOk) {
        console.log(
          "拉固定客户===>",
          fixedTagName,
          isJyh ? "我的学员" : "我的客户"
        );
        sleep(500);
        let ok = utils.clickNode({
          //点击我的客户或者我的学员
          strName: isJyh ? "我的学员" : "我的客户",
        });
        if (ok) {
          let node = textContains("根据标签筛选").findOne(10000);
          if (node) {
            let ck = utils.centerClick(node);
            sleep(1000);
            if (ck) {
              let r = utils.clickNode({
                strName: fixedTagName,
                scroll: true,
                isBig: true,
                t: 400,
              }); //
              sleep(500);
              if (r) {
                let qdck = click("确定", 0);
                if (qdck) {
                  sleep(1000);
                  text("选择联系人").findOne(2000);
                  console.log("已在选择联系人页面");
                  let gouOk = utils.imgQuery("gou"); //获取全选坐标
                  let gouckOk = false;
                  if (gouOk) {
                    gouckOk = click(gouOk.x, gouOk.y); //点击全选
                    if (!textStartsWith("确定").findOne(2000)) {
                      console.log("使用坐标点击全选1");
                      gouckOk = click(720, 174);
                    }
                  } else {
                    console.log("使用坐标点击全选2");
                    gouckOk = click(720, 174);
                  }
                  if (gouckOk) {
                    sleep(1000);
                    textStartsWith("确定").findOne(2000);
                    let qdck = click("确定", 0);
                    console.log("qdck===>", qdck);
                    sleep(5000);
                    if (textContains("我知道了").exists()) {
                      click("我知道了", 0);
                    }
                    rOk = true;
                    // retry = task_retry + 1;
                    sleep(1000);
                    if (
                      msgType &&
                      (msgType == "send_corp_pull_group_otherB" ||
                        msgType == "send_corp_pull_group")
                    ) {
                      console.log("转移B完成发送文本提示！！！！");
                      back();
                      sleep(800);
                      let input = className("EditText").findOne(2000);
                      input.setText("建群完成！");
                      sleep(800);
                      click("发送", 0);
                    }
                  } else {
                    taskErr("无障碍失效");
                    return;
                  }
                } else {
                  taskErr("无障碍失效");
                  return;
                }
              } else {
                taskErr("未找到" + fixedTagName + "标签");
                return;
              }
            } else {
              taskErr("无障碍失效");
              return;
            }
          } else {
            taskErr("未找到根据标签筛选");
            return;
          }
        } else {
          taskErr("找不到" + isJyh ? "我的学员" : "我的客户");
          return;
        }
      } else {
        taskErr("点击添加按钮失败");
        return;
      }
    }

    // ============= 拉外部客户 =============
    console.log("拉外部客户11111===>");
    sleep(1000);
    if (tagName) {
      console.log("拉外部客户2222===>");
      sleep(1000);
      add();
      if (adddckOk) {
        sleep(500);
        let ok = utils.clickNode({
          //点击我的客户或者我的学员
          strName: isJyh ? "我的学员" : "我的客户",
        });
        if (ok) {
          let node = textContains("根据标签筛选").findOne(10000);
          if (node) {
            let ck = utils.centerClick(node);
            sleep(1500);
            if (ck) {
              let r = utils.clickNode({
                strName: tagName,
                scroll: true,
                isBig: true,
                t: 400,
              }); //
              sleep(1000);
              if (r) {
                let qdck = click("确定", 0);
                if (qdck) {
                  sleep(1000);
                  text("选择联系人").findOne(2000);
                  console.log("已在选择联系人页面");
                  let gouOk = utils.imgQuery("gou"); //获取全选坐标
                  let gouckOk = false;
                  if (gouOk) {
                    gouckOk = click(gouOk.x, gouOk.y); //点击全选
                    if (!textStartsWith("确定").findOne(2000)) {
                      console.log("使用坐标点击全选1");
                      gouckOk = click(720, 174);
                    }
                  } else {
                    console.log("使用坐标点击全选2");
                    gouckOk = click(720, 174);
                  }
                  if (gouckOk) {
                    sleep(1000);
                    textStartsWith("确定").findOne(2000);
                    let qdck = click("确定", 0);
                    console.log("qdck===>", qdck);
                    if (qdck) {
                      sleep(5000);
                      if (textContains("我知道了").exists()) {
                        click("我知道了", 0);
                      }
                      rOk = true;
                      sleep(1000);
                    } else {
                      taskErr("拉人失败没有选到用户");
                      return;
                    }
                  } else {
                    taskErr("无障碍失效");
                    return;
                  }
                } else {
                  taskErr("无障碍失效");
                  return;
                }
              } else {
                taskErr("未找到" + tagName + "标签");
                return;
              }
            } else {
              taskErr("无障碍失效");
              return;
            }
          } else {
            taskErr("未找到根据标签筛选");
            return;
          }
        } else {
          taskErr("找不到" + isJyh ? "我的学员" : "我的客户");
          return;
        }
      } else {
        taskErr("点击添加按钮失败");
        return;
      }
    }

    // ============= 退群 =============
    console.log("退群===>", autoOutGroup, zhuanquanzhu);
    if (autoOutGroup && zhuanquanzhu) {
      exitq();
    }
    // =============退群函数 =============
    function exitq() {
      let tagOk = utils.clickNode({
        strName: "退出群聊",
        scroll: true,
        endName: "退出群聊",
      });
      if (tagOk) {
        sleep(1000);
        let ok = click("退出", 1);
        if (!ok) {
          taskErr("退群失败");
        }
      } else {
        taskErr("找不到退出群聊按钮");
        return;
      }
    }
    // ============= 添加按钮点击 =============
    function add() {
      let addR = utils.imgQuery("add"); //获取添加图标坐标
      if (addR) {
        console.log("获取添加图标坐标", addR);
        adddckOk = click(addR.x, addR.y); //点击点点点
        sleep(1500);
      } else {
        console.log("添加图标找不到尝试使用节点查找");
        let topNode = className("GridView").findOne(1000);
        if (topNode && topNode.childCount() > 0) {
          let addBtn = null; //添加按钮
          let delBtn = null; //删除按钮
          for (let i = 0; i < topNode.childCount(); i++) {
            let node = topNode.child(i);
            if (!node.findOne(className("TextView")).text()) {
              //不存在文本
              if (!addBtn) {
                addBtn = node;
              } else if (!delBtn) {
                delBtn = node;
                break;
              }
            }
          }
          if (addBtn) {
            adddckOk = utils.centerClick(addBtn); //添加按钮存在点击
            sleep(1500);
          }
        } else {
          taskErr("找不到" + "添加成员图标节点");
          return;
        }
      }
    }
  }
  // 错误处理
  function taskErr(msg) {
    console.log(msg);
    utils.taskErrImg(msgId ? msgId + "_creategroup_" : "_creategroup_");
    utils.msg = msg;
    utils.code = 0;
    qw.isQwHome();
    return;
    // if (!rOk && retry >= task_retry) {
    //   console.log(msg);
    //   utils.taskErrImg(msgId ? msgId + "_creategroup_" : "_creategroup_");
    //   utils.msg = msg;
    //   utils.code = 0;
    //   qw.isQwHome();
    //   return;
    // }
    // if (!rOk && retry < task_retry) {
    //   toastLog(msg + "延迟1分钟再次尝试===>" + retry);
    //   qw.retry("createGroup", param, retry + 1);
    // }
  }
};
/**删除朋友圈
 * @param {string} startTime 开始时间
 * @param {string} endTime 结束时间 不传为从开始时间之前的所有朋友圈删除
 * @param {string} title 朋友圈标题包含的唯一字段前10个字符 (精准删除某一条朋友圈时必传)
 *  注：删除指定某条朋友圈必须同一天的朋友圈标题前10个字符内容必须包含唯一的字符
 * */
qw.delFriends = (param) => {
  let { startTime, endTime, title, corpName, retry } = param;
  retry = retry || 0;
  qw.qwInit(); //初始化
  sleep(1500);
  console.log("=============初始化结束=============");
  let gotoCorpOk = corpName ? qw.gotoCorp(corpName) : true; //切换公司
  console.log("=============切换公司结束=============！");
  if (!gotoCorpOk) {
    retry = task_retry + 1;
    taskErr("找不到指定公司！！！！");
    return;
  } else {
    console.log("=============去朋友圈=============！");
    click("工作台");
    sleep(2000);
    //进入客户群界面
    let ok = utils.clickNode({
      strName: "客户朋友圈",
    });
    sleep(1500);
    if (!ok) {
      //进入客户群界面
      ok = utils.clickNode({
        strName: "客户朋友圈",
      });
      sleep(1500);
    }
  }

  console.log("=============开始删朋友圈=============！");
  let newStartTime = ""; //是今天的话会被赋值
  let istoday = istodayFn(); //判断开始时间是否是今天
  let startObj = transformTime(startTime); //转换日期赋值
  let endObj = endTime
    ? transformTime(endTime)
    : { year: "", month: "", day: "" }; //结束日期
  // 判断是否在朋友圈并等待指定元素
  let waitJt = utils.waitNode({ name: "今天" });
  if (waitJt) {
    // 日期处理
    if (istoday) {
      //假如起始时间为今天
      newStartTime = "今天";
    }
    getMomentsNodes();
    console.log(startTime, startObj, endObj);
  }
  // 找节点
  function getMomentsNodes() {
    let startNode = null; //开始节点
    let endNode = null; //结束节点
    let today = text("今天").findOne(3000); //找到今天节点
    let tp = null; //整个列表父节点
    let isSameYear = startObj.year === endObj.year; //开启年和结束年是否一样
    let isFindEndYear = false; //当结束年和开始年不同时需要找到才会停止
    if (newStartTime === "今天") {
      //假如是今天开始节点直接赋值为今天
      startNode = today;
    }
    //查找起始的节点并滑动到起始节点界面
    if (!startNode) {
      while (!startNode) {
        if (textContains(startObj.day).exists()) {
          console.log("找到", startObj.day);
          let node = textContains(startObj.day).findOne(1000);
          if (node) {
            let theNode = node.parent().findOne(text(startObj.month));
            if (theNode) {
              startNode = node.parent();
              console.log("已找到起始日期位置界面");
            }
          }
        }
        sleep(500);
        utils.downSwipe();
      }
    }
    if (today) {
      //找到父节点
      try {
        let list = getFansList();
        if (list) {
          let listSize = list.size(); //节点数量
          console.log("listSize===>", listSize);
          let ok = false; //是否结束删除
          for (let i = 0; i < listSize; i++) {
            let node = null;
            try {
              node = list.get(i);
            } catch (error) {
              if (retry < 3) {
                toastLog("再次尝试！！！" + retry);
                qw.delFriends({ startTime, retry: retry + 1 });
              }
            }
            if (!node) {
              console.log("不存在node了");
              break;
            }
            // 找到起始点
            if (newStartTime === "今天") {
              if (node.findOne(text("今天"))) {
                console.log("找到起始节点位置", node.findOne(text("今天")));
                ok = true;
              }
            } else {
              if (
                node.findOne(text(startObj.day)) &&
                node.findOne(text(startObj.day))
              ) {
                console.log(
                  "找到起始节点位置",
                  node.findOne(text(startObj.day)).text(),
                  node.findOne(text(startObj.day)).text()
                );
                ok = true;
              }
            }
            // 结束年
            if (endObj.year && !isSameYear && !isFindEndYear) {
              //当结束年与开始年不同，并且还未遇到结束年时执行
              isFindEndYear = textContains(endObj.year + "年").exists(); //判断当前页面是否存在
            }
            // 找到结束节点
            if (
              node.findOne(text(endObj.month)) &&
              node.findOne(text(endObj.day)) &&
              (isSameYear || isFindEndYear)
            ) {
              console.log("找到结束节点");
              //找到昨天结束
              ok = false;
            }
            if (node.findOne(text("发表到客户的朋友圈"))) {
              console.log("跳过发表到客户的朋友圈节点");
              continue;
            }
            if (node.findOne(text("发表到客户的朋友圈\n客户在微信中查看"))) {
              console.log("跳过发表到客户的朋友圈客户在微信中查看节点");
              retry = 10;
              continue;
            }
            if (node.findOne(text("去发表"))) {
              console.log("跳过去发表节点");
              continue;
            }
            if (ok) {
              console.log("点击node===>");
              let isckOK = utils.centerClick(node);
              sleep(1000);
              console.log(i, listSize, isckOK);
              if (isckOK && textContains("详情").exists()) {
                console.log(i, listSize, isckOK);
                let nodeXY = false;
                try {
                  // nodeXY = utils.imgQuery("ddd");
                  console.log(nodeXY);
                  jjj;
                  sleep(1000);
                  if (nodeXY) {
                    click(nodeXY.x, nodeXY.y);
                  }
                } catch (error) {
                  let dddOk = click(998, 177);
                  if (dddOk) {
                    sleep(1000);
                    let delNode = text("删除").findOne(1000);
                    let delOk = utils.centerClick(delNode);
                    if (delOk) {
                      sleep(1000);
                      let qdOk = click("确定", 0);
                      sleep(1500);
                      console.log("删除结果===>", qdOk);
                      if (qdOk) {
                        list = getFansList();
                        i = 0;
                      }
                    }
                  }
                }
              }
              if (isckOK && textContains("消息列表").exists()) {
                back();
                sleep(1000);
              }
              if (isckOK && textContains("该内容已不可见").exists()) {
                click("确定", 0);
                sleep(1000);
              }
              if (isckOK && textContains("活动消息等").exists()) {
                click("确定", 0);
                sleep(1000);
              }
            }
          }

          toastLog("删除结束！！！" + retry);
          if (retry < 10) {
            toastLog("再次尝试！！！" + retry);
            qw.delFriends({ startTime, retry: retry + 1 });
          }
        }
      } catch (error) {
        console.log("错误===>", error);
      }
    } else {
    }
    //获取朋友圈列表
    function getFansList() {
      textContains("可将产品介绍").findOne(5000);
      // sleep(5000)
      tp = startNode.parent();
      if (tp) {
        try {
          while (
            tp.className() != "androidx.recyclerview.widget.RecyclerView"
          ) {
            tp = tp.parent();
          }
          return tp.children();
        } catch (error) {
          console.log("tp", tp.className());
          while (tp.className() != "android.view.ViewGroup") {
            tp = tp.parent();
            console.log("tp", tp.className());
          }
          return tp.children();
        }
      } else {
        return tp;
      }
    }
  }
  // 日期处理
  function zeroFill(i) {
    if (i >= 0 && i <= 9) {
      return "0" + i;
    } else {
      return String(i);
    }
  }
  //获取昨天的日期字符串
  function yesterday() {
    let zt = new Date(Date.now() - 24 * 60 * 60 * 1000); //
    let month = zt.getMonth() + 1 + "月"; //月
    let day = zeroFill(zt.getDate()); //日
    console.log("找到昨天日期", month, day);
    return { month, day };
  }
  //日期转换
  function transformTime(time) {
    let date = new Date(time);
    let year = date.getFullYear() + "年"; //年
    let month = date.getMonth() + 1 + "月"; //月
    let day = zeroFill(date.getDate()); //日
    console.log("转换后日期", year, month, day);
    return { year, month, day };
  }
  // 判断startTime是否是今天
  function istodayFn() {
    let date = new Date();
    let month = zeroFill(date.getMonth() + 1); //月
    let day = zeroFill(date.getDate()); //日
    let year = zeroFill(date.getFullYear()); //年
    let newDateStr = `${year}-${month}-${day}`;
    console.log(`今天：${newDateStr},startTime：${startTime}`);
    return newDateStr == startTime;
  }
};

module.exports = qw;
