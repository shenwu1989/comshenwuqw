// // var str = "";
// // str += "屏幕宽度:" + device.width;
// // str += "\n屏幕高度:" + device.height;
// // str += "\nbuildId:" + device.buildId;  //修订版本号
// // str += "\n主板:" + device.board;
// // str += "\n制造商:" + device.brand;
// // str += "\n工业设计名称:" + device.device;
// // str += "\n产品名称:" + device.product;
// // str += "\n型号:" + device.model;
// // str += "\nbootloader版本:" + device.bootloader;
// // str += "\n硬件名称:" + device.hardware;
// // str += "\n唯一标识码:" + device.fingerprint;
// // str += "\n硬件序列号："+device.serial;
// // str += "\nIncremental："+device.incremental;
// // str += "\nAndroid系统版本号："+device.release;
// // str += "\nBaseOS："+device.baseOS;
// // str += "\n安全补丁程序级别："+device.securityPatch;
// // str += "\n开发代号："+device.codename;
// // str += "\n内存总量："+device.getTotalMem();
// // str += "\n当前可用内存："+device.getAvailMem();
// // str += "\nAndroidId: " + device.getAndroidId();
// // str += "\nMac: " + device.getMacAddress();
// // str += "\nAPI: " + device.sdkInt;
// // str += "\n电量: " + device.getBattery();
// // // str += "\nIMEI: " + device.getIMEI();  //需要读取设备信息权限
// // log(str);

// // app.startActivity("console")
utils = {};
qw = {};

// 无障碍点击节点中心点
utils.centerClick = (node) => {
  let ok = click(node.bounds().centerX(), node.bounds().centerY());
  if (!ok) {
    node.click();
    toastLog("本次操作无障碍失效！！！");
  }
  return ok;
};
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
// 滑动
utils.swipe = (a, b, c, d, e) => {
  let r = swipe(a, b, c, d, e);
  if (!r) {
    toastLog("本次滑动操作反馈无障碍失效！！！");
  }
  return r;
};
// 获取指接点的指定className的父节点
utils.getParentNode = (node, class_name) => {
  let ok = false;
  let pNode = node.parent();
  while (!ok) {
    console.log(pNode.className());
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
};
utils.clickNode = (params) => {
  let { strName, eq, t, scroll, endName } = params;
  let tagBtn = null;
  let endTagName = "";
  let i = 0;
  let sameNum = 0;
  // 查找node节点
  function getNode() {
    if (eq) {
      let btns = text(strName).find();
      if (btns) {
        tagBtn = btns.get(eq);
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
    while (!tagBtn && i < 99) {
      utils.downSwipe();
      // sleep(600);
      getNode();
      i += 1;
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
/* 模糊判断文字是否存在
 *
 * @param str 文字名称
 * */
utils.getTextName = (str, isPrecise) => {
  if (isPrecise) {
    let txtNode = textContains(str).findOne(1000);
    let txt = txtNode ? txtNode.text() : "";
    txt = String.prototype.replace.call(txt, /[\s\(\d+\+?\)]/gi, "");

    console.log("精准查找文字", str, textContains(str).exists(), txt);
    return textContains(str).exists() && txt == str.replace(/\s/gi, "");
  } else {
    console.log("模糊查找文字", str);
    return textContains(str).exists();
  }
};
/*等待指定文本存在的时候才继续执行
 *
 *
 * */
utils.waitForName = (name1) => {
  let node = text(name1).className("android.widget.TextView").findOne(1000);
  console.log("等待指定元素结束====>", name1);
  return node;
};
// 匹配图标坐标，add添加图标 ddd 三个点坐标,
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
    let imgPath =
      app.versionCode === 638
        ? `${files.cwd()}/com.shenwu.qw/img/${imgName}.png`
        : `${files.cwd()}/img/${imgName}.png`; //638是在autoxjs上的路径开发测试使用,否则就是封装的APP
    console.log(imgPath);
    // grayImg = images.grayscale(img); // 灰度化
    grayImg = images.threshold(img, 60, 255); // 灰度化

    let targetImg = images.read(imgPath); // 读取裁剪图片
    pos = images.findImage(grayImg, targetImg); // 在全图中查找坐标
    console.log(pos);
    grayImg.recycle();
    img.recycle();
  }
  return pos;
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
// 判断当前app是否是指定APP不是的话打开正确APP
utils.isApp = (name) => {
  let isOk = currentPackage() === name || packageName(name).exists();
  if (!isOk) {
    log("重新打开===>" + name);
    app.launchPackage(name);
    sleep(10000);
  } else {
    log("当前APP已是" + name);
  }
};
//初始化initAPP
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
  app.launchPackage("com.shenwu.qw.m");
};
// 返回首页
qw.goIndexPage = () => {
  console.log("判断是否在首页,不在返回首页===>");
  // 判断界面是否存在消息文字
  let isIndexPage = utils.getTextName("消息", true);
  // 不存在在内层番返回到主页消息
  while (!isIndexPage) {
    let packageName = currentPackage();
    if (packageName != "com.tencent.wework") {
      console.log("不在企业微信！！重新打开企微");
      app.launchPackage("com.tencent.wework");
      sleep(1000);
    }
    if (utils.getTextName("消息", true)) {
      isIndexPage = true;
    } else {
      console.log("当前不是首页,返回上级");
      back();
    }
    sleep(500);
  }
  utils.waitForName("消息", true);
  // 若没选中消息点击
  utils.isChecked("消息", true);
};
// 回首页并去指定菜单
qw.isQwHome = (name) => {
  sleep(1000);
  console.log(
    1111111,
    textContains("消息").exists(),
    packageName("com.tencent.wework").exists()
  );
  let btn1 = textContains("消息").exists();
  let btn2 = textContains("邮件").exists();
  let btn3 = textContains("文档").exists();
  let btn4 = textContains("工作台").exists();
  let btn5 = textContains("通讯录").exists();
  let isHome = btn1 && btn2 && btn3 && btn4 && btn5;
  let focusName = "";
  console.log("首页条件结果===>", btn1, btn2, btn3, btn4, btn5);
  if (isHome) {
    console.log("在首页");
    getFocusName();
  } else {
    utils.isApp("com.tencent.wework");
    console.log("不在首页");
    back();
    sleep(500);
    focusName = qw.isQwHome(name);
  }
  return focusName;
  function getFocusName() {
    sleep(2000);
    let node = text("通讯录").findOne(1000);
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
  }
};
// // 返回企微首页
// qw.isQwHome = (name) => {
//   let btn1 = textContains("消息").exists();
//   let btn2 = textContains("邮件").exists();
//   let btn3 = textContains("文档").exists();
//   let btn4 = textContains("工作台").exists();
//   let btn5 = textContains("通讯录").exists();
//   let isHome = btn1 && btn2 && btn3 && btn4 && btn5;
//   let focusName = "";
//   console.log("首页条件结果===>", btn1, btn2, btn3, btn4, btn5);
//   if (isHome) {
//     console.log("在首页");
//     sleep(1000);
//     getFocusName();
//   } else {
//     utils.isApp("com.tencent.wework");
//     console.log("不在首页");
//     back();
//     sleep(500);
//     focusName = qw.isQwHome(name);
//   }
//   return focusName;
//   function getFocusName() {
//     let node = text("消息").findOne(1000);
//     let pNode = utils.getParentNode(node, "android.view.ViewGroup");
//     console.log(pNode);
//     if (pNode) {
//       for (let n of pNode.children()) {
//         let txtNode = n.findOne(className("TextView").selected());
//         if (txtNode) {
//           focusName = txtNode.text();
//           console.log("当前选中页面为===>", focusName);
//           if (name && name != focusName) {
//             console.log("准备切换到===>", name);
//             let btn = text(name).findOne(1000);
//             let ok = false;
//             if (btn) {
//               ok = utils.centerClick(btn);
//             }
//             console.log("切换结果===>", ok);
//             sleep(500);
//           }
//           break;
//         }
//       }
//     }
//   }
// };
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
    qw.isQwHome("消息");
    qw.openSidebar(b);
  }
};
// // const utils = require("./common/utils");

// // let node = depth(12).findOne(10000).parent().parent();
// // // console.log(node)
// // let collection = node.children();
// // let count = collection.size();
// // console.log('111',depth(12).findOne(10000).text());
// // for (let i = 0; i <= count - 1; i++) {
// //     let obj = null;
// //     try {
// //       obj = collection.get(i);
// //       console.log("obj===>", obj);
// //       let a = obj.findOne(className("android.widget.TextView"));

// //       console.log(a.text(),  String.prototype.replace.call(a.text(), /\(\d+\+?\)/gi, "") ==  "思思姣");
// //     } catch (error) {
// //       console.log(error);
// //       break;
// //     }
// // }

// // var path = "/sdcard/uiautomator/uiautomator-stub.jar";
// // var url = "https://github.com/x8b/uiautomator/releases/download/1.0/uiautomator-stub.jar";

// // files.ensureDir("/sdcard/uiautomator/");
// // var r = http.get(url);
// // if (r.statusCode == 200) {
// //   files.writeBytes(path, r.body.bytes());
// //   engines.execScriptFile(path);
// // }
// // scrollUp()//上划
// // scrollDown()//下滑
// // scrollLeft()
// // scrollRight()

// // let node = className("ListView").findOne(1000);
// // console.log("node===>", node.bounds().top);
// // let collection = node.children();
// // let count = collection.size();
// // let isOk = false;
// // // 循环群发列表节点∏
// // for (let i = 0; i <= count - 1; i++) {
// //   let obj = null;
// //   try {
// //     obj = collection.get(i);
// //     if (obj.depth() === 10 && obj.id()) {
// //       console.log(
// //         "群发节点===>",
// //         i,
// //         obj.depth(),
// //         obj.bounds().centerX(),
// //         obj.bounds().centerY(),
// //         obj.bounds().top,
// //         obj.bounds().height() - node.bounds().top,
// //         obj.id()
// //       );
// //       // 点击进入详情
// //       if (i === 0) {
// //         console.log("最后一个群发消息节点");
// //         click(obj.bounds().centerX(), obj.bounds().top);
// //       }
// //       if (i === count - 1 && obj.bounds().height() - node.bounds().top < 100) {
// //         console.log("最后一个群发消息节点");
// //         click(obj.bounds().centerX(), obj.bounds().top + 150);
// //       } else {
// //         click(obj.bounds().centerX(), obj.bounds().centerY());
// //       }
// //       //   查到发送按钮
// //       let senBtn = text("发送").findOne(1000);
// //       if (senBtn) {
// //         console.log("找到可发送群发！！！");
// //         isOk = true;
// //         click(senBtn.bounds().centerX(), senBtn.bounds().centerY());
// //         if (text("企业群发助手").findOne(1000)) {
// //           back();
// //           console.log("发送完成");
// //         }
// //         if (text("群发助手").findOne(1000)) {
// //           back();
// //           console.log("回到主页");
// //         }
// //         break; //退出循环
// //       } else {
// //         if (text("企业群发助手").findOne(1000)) {
// //           back();
// //           sleep(1000);
// //           console.log("当前没有发送按钮判断为已发送，查找下一个");
// //         }
// //       }
// //     }
// //   } catch (error) {
// //     console.log("群发节点操作错误", error);
// //     utils.msg = "群发节点操作错误";
// //     utils.code = 0;
// //     break;
// //   }
// // }
// // if (!isOk) {
// //   if (text("群发助手").findOne(1000)) {
// //     back();
// //     console.log("回到主页");
// //   }
// //   utils.msg = "未找到可发送的群发！";
// //   utils.code = 0;
// // }

// // utils.imgsToText()
// // function abc() {
// //   try {
// //     if (!requestScreenCapture()) {
// //       console.log("截图授权");
// //     }
// //     let img = captureScreen(); // 截取当前屏幕
// //     console.log("img====>", img);
// //     let text = "";
// //     if (img) {
// //       text = paddle.ocr(img); // 进行OCR文字识别
// //       text = gmlkit.ocr(img, "zh"); // 进行OCR文字识别
// //     }
// //     Object.keys(text).keys(ket=>{
// //         console.log(key)
// //     })
// //     return text.children;
// //   } catch (err) {
// //     console.log("err===>",err);
// //         utils.imageAuth();
// //         try {
// //           let img = captureScreen(); // 截取当前屏幕
// //           console.log("img====>", img);
// //           let text = "";
// //           if (img) {
// //             text = gmlkit.ocr(img); // 进行OCR文字识别
// //           }
// //           return text;
// //         } catch (err) {
// //           toast("截图权限未开启！");
// //           utils.msg = "截图权限未开启，导致任务失败！";
// //           utils.code = 0;
// //         }
// //   }
// // }
// // console.log("开始截图文字识别！！！！！", abc());

// // var packageName = "com.shenwu.qw.m";
// // var scriptPath = files.cwd();
// // console.log("scriptPath===>", scriptPath);
// // // 检查进程是否存在
// // function checkProcess() {
// //   var command = "ps | grep " + packageName;
// //   var result = shell(command, true);
// //   console.log("1111",command);
// //   return result.code === 0;
// // }

// // // 重启脚本
// // function restartScript() {
// //   console.log("3333");
// //   engines.stopAll(); // 停止所有脚本
// //   engines.execScriptFile(scriptPath + "/main.js"); // 重新执行脚本
// // }

// // // 检查进程状态并重启脚本
// // function checkAndRestart() {
// //     console.log("2222")
// //   if (!checkProcess()) {
// //     console.log("进程被杀死，正在重启脚本...");
// //     restartScript();
// //   } else {
// //     console.log("进程正常运行");
// //   }
// // }

// // 每隔一段时间检查进程状态并重启脚本
// // setInterval(checkAndRestart, 5000); // 每隔5秒检查一次
// // let switchNode= className("Switch").findOne(3000)
// // if(switchNode.checked()){
// //     click(switchNode.bounds().centerX(), switchNode.bounds().centerY());
// // }
// // let switchNodes= className("Switch").find()
// // for(let s of switchNodes){
// //     if(!s.checked()){
// //         click(s.bounds().centerX(), s.bounds().centerY());
// //         sleep(500)
// //     }
// // }
// // launchApp("手机管家");
// // console.log(switchNodes.size())

// //忽略电池优化设置
// // var intent = new Intent();
// // intent.setAction("android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS");
// // app.startActivity(intent);
// // if (text("不允许").findOne(5000)) {
// //   click("不允许", 0);
// //   sleep(500);
// //   click("所有应用", 0);
// //   let input = text("搜索应用").findOne(3000);
// //   input.click();
// //   input.setText("秘密");
// //   sleep(500);
// //   if (text("允许").findOne(2000)) {
// //     click("秘密基地", 0);
// //     sleep(500);
// //     let cks = className("RadioButton").find();
// //     click(cks[1].bounds().centerX(), cks[1].bounds().centerY());
// //     sleep(500);
// //     click("确定", 0);
// //     sleep(500)
// //   }
// // }
// // back();

// // launchApp("设置"); //打开手机管家
// // desc("设置").findOne(5000)
// // let input = text("搜索设置项").findOne(1000);
// // while(!input){
// //     input = text("搜索设置项").findOne(1000);
// //     swipe(
// //         device.width / 2,
// //         device.height * 0.5,
// //         device.width / 2,
// //         device.height * 0.9,
// //         500
// //       ); //上滑动
// // }
// // if(input){
// //     input.click()
// //     text("搜索历史").findOne(5000)
// //     let editText = desc("搜索查询").findOne(1000);
// //     sleep(500);
// //     editText.setText("软件更新");
// //     text("系统和更新").findOne(5000)
// //     click("系统和更新",0)
// //     text("软件更新").findOne(5000)
// //     let rNode = desc("菜单").findOne(3000)
// //     click(rNode.bounds().centerX(), rNode.bounds().centerY());
// //     sleep(300)
// //     click("本机设置",0)
// //     let switchNodes= className("Switch").find()
// //     for(let s of switchNodes){
// //         if(s.checked()){
// //             click(s.bounds().centerX(), s.bounds().centerY());
// //             sleep(500)
// //             let gb = text("关闭").findOne(1000)
// //             if(gb){
// //                 click(gb.bounds().centerX(), gb.bounds().centerY());
// //             }
// //             sleep(500)
// //         }
// //     }
// //     back()
// // }
// // let isIndex =desc("设置").findOne(1000)
// // while(!isIndex){
// //     isIndex =desc("设置").findOne(1000)
// //     if(!isIndex){
// //         back()
// //     }
// // }

// // text("应用管理").findOne(2000);
// // click("应用管理", 0);
// // sleep(500);
// // let input = desc("搜索查询").findOne(1000);
// // input.click();
// // sleep(500);
// // input.setText("秘密");
// // sleep(500);
// // click("秘密基地", 0);
// // text("通知管理").findOne(2000);
// // click("通知管理", 0);
// // sleep(1000)
// // text("允许通知").findOne(2000);
// // let switchNode = className("Switch").findOne(1000);
// // if (!switchNode.checked()) {
// //   click(switchNode.bounds().centerX(), switchNode.bounds().centerY());
// //   sleep(500);
// //   let list = depth(10).find();
// //   for (let node of list) {
// //     if (node.className() === "android.widget.ImageView") {
// //       sleep(1000);
// //       click(node.bounds().centerX(), node.bounds().centerY());
// //       sleep(1000);
// //       let txt = text("横幅通知").findOne(3000);
// //       if (txt) {
// //         let p = txt.parent().parent();
// //         let s = p.child(1).findOne(className("Switch"));
// //         if (s && !s.checked()) {
// //           click(p.child(1).bounds().centerX(), p.child(1).bounds().centerY());
// //           sleep(500);
// //         }
// //       }
// //       back();
// //     }
// //   }
// // }

// // console.log("arr==>");

// // text("流量使用情况").findOne(2000);
// // click("流量使用情况", 0);
// // sleep(1000);
// // scrollDown();
// // sleep(1000);
// // let switchNodes = className("Switch").find();
// // for (let s of switchNodes) {
// //   if (!s.checked()) {
// //     sleep(500);
// //     click(s.bounds().centerX(), s.bounds().centerY());
// //     sleep(500);
// //   }
// // }

// // click("软件更新",1)

// // log(textContains("登录华为").exists())
// // console.log(id("notification_title").drawingOrder(1).find())

// //  click(864,488);
// device.wakeUp();
// // sleep(1000);
// // swipe(device.width / 2, device.height - 100, device.width / 2, 0, 500); // 上滑解锁

// //权限
// function qx() {
//   text("权限").findOne(2000);
//   click("权限", 0);
//   sleep(1000);
//   scrollUp();
//   sleep(500);
//   let arr = [];
//   let list = className("TextView").drawingOrder(1).find();
//   forQx();
//   sleep(500);
//   scrollDown();
//   console.log("翻页结束");
//   sleep(500);
//   list = className("TextView").drawingOrder(1).find();
//   forQx();
//   function forQx() {
//     for (let node of list) {
//       let txt = node.text();
//       if (txt && txt != "已允许" && txt != "已禁止") {
//         console.log(txt);
//         if (arr.findIndex((i) => i == txt) === -1) {
//           sleep(500);
//           let newNode = text(txt).findOne(1000);
//           if (newNode && newNode.visibleToUser()) {
//             sleep(500);
//             arr.push(txt);
//             click(newNode.bounds().centerX(), newNode.bounds().centerY());
//             sleep(500);
//             console.log("txt===>", txt, newNode.visibleToUser());
//             if (textContains("始终允许").exists()) {
//               click("始终允许", 0);
//               console.log("始终允许===>", txt);
//             } else if (textContains("仅使用期间允许").exists()) {
//               click("仅使用期间允许", 0);
//               console.log("仅使用期间允许===>", txt);
//             } else {
//               click("允许", 0);
//               console.log("允许===>", txt);
//             }
//             // click("禁止", 0);
//             sleep(500);
//           }
//           if (!textContains("秘密基地权限").exists()) {
//             back();
//           }
//         }
//       }
//     }
//   }
// }
// // qx();
// // let list = className("TextView").drawingOrder(1).find();
// // for (let n of list) {
// //   console.log(n.text());
// //   // let t = n.findOne(className("TextView"))
// //   // if(t && t.text() != "已允许" && t.text() != "已禁止"){
// //   //     console.log(t.text())
// //   // }
// // }
// function msg() {
//   text("应用管理").findOne(2000);
//   click("应用管理", 0);
//   sleep(500);
//   let input = desc("搜索查询").findOne(1000);
//   input.click();
//   sleep(500);
//   input.setText("秘密");
//   sleep(500);
//   click("秘密基地", 0);
//   text("通知管理").findOne(2000);
//   click("通知管理", 0);
//   sleep(1000);
//   text("允许通知").findOne(2000);
//   let switchNode = className("Switch").findOne(1000);
//   if (!switchNode.checked()) {
//     switchNode.click();
//     click(switchNode.bounds().centerX(), switchNode.bounds().centerY());
//     sleep(500);
//     childAction();
//   } else {
//     childAction();
//   }
//   function childAction() {
//     let list = id("notification_title").drawingOrder(1).find();
//     for (let node of list) {
//       sleep(1000);
//       click(node.bounds().centerX(), node.bounds().centerY());
//       sleep(1000);
//       let txt = text("通知管理").findOne(3000);
//       let sw = className("Switch").findOne(1000);
//       if (!sw.checked()) {
//         click(sw.bounds().centerX(), sw.bounds().centerY());
//         sleep(500);
//       }
//       let txt1 = text("横幅通知").findOne(3000);
//       if (txt1) {
//         let p = txt1.parent().parent();
//         let s = p.child(2).findOne(className("Switch"));
//         if (s && !s.checked()) {
//           s.click();
//           click(p.child(1).bounds().centerX(), p.child(1).bounds().centerY());
//           sleep(500);
//         }
//       }
//       back();
//     }
//   }
// }
// //   msg()
// console.log(textContains("Android").exists());
// console.log(textStartsWith("HarmonyOs").findOne(1000));

// // click("秘密基地", 0);
// // sleep(500)
// // if (textContains("解除管控").exists()) {
// //   click("解除管控", 0);
// //   sleep(500);
// //   let btn = className("Button").text("解除管控").drawingOrder(3).findOne(1000)
// //   if (btn) {
// //     console.log(btn.drawingOrder());
// //     btn.click();
// //   }
// // }
// // let node = id("title").text("关于手机").find()
// // // log(node)
// // for(let n of node){
// //     console.log(n.drawingOrder())
// // }
// // let android = textContains("Android").exists();
// // if (android) {
// //   log("安卓");
// // } else {
// //   log("鸿蒙");
// // }
// // let t = text("版本号").findOne(1000);
// // let tp = t.parent().parent();
// // let tc = tp.find(className("TextView"));
// // for (let n of tc) {
// //   let txt = n.text();
// //   if (txt != "版本号") {
// //     console.log(txt);
// //     break;
// //   }
// // }
// // click(node.bounds().centerX(),node.bounds().centerY())
// // let txt1 = text("横幅").findOne(3000);
// // if (txt1) {
// //   let p = txt1.parent().parent();
// //   let s = p.child(2).findOne(className("Switch"));
// //   console.log(s)
// //   if (s && !s.checked()) {
// //     s.click();
// //     click(p.child(1).bounds().centerX(), p.child(1).bounds().centerY());
// //     sleep(500);
// //   }
// // }
// // sleep(500);
// // scrollDown();
// // sleep(500);
// // click("修改系统设置", 0);
// // sleep(1000);
// // let switchNode = className("Switch").findOne(1000);
// // if (!switchNode.checked()) {
// //   switchNode.click();
// //   click(switchNode.bounds().centerX(), switchNode.bounds().centerY());
// // }
// // 无障碍点击节点中心点
// mycenterClick = (node) => {
//     let r = click(node.bounds().centerX(), node.bounds().centerY());
//     if (!r) {
//       node.click();
//       toastLog("本次操作无障碍失效！！！");
//     }
//   };
//   // 滑动
//   myswipe = (a, b, c, d, e) => {
//     let r = swipe(a, b, c, d, e);
//     if (!r) {
//       toastLog("本次滑动操作反馈无障碍失效！！！");
//     }
//   };
//   if (text("不允许").findOne(5000)) {
//     click("不允许", 0);
//     sleep(500);
//     click("所有应用", 0);
//     let input = text("搜索").findOne(3000);
//     input.click();
//     input.setText("秘密");
//     sleep(500);
//     if (text("允许").findOne(2000)) {
//       click("秘密基地", 0);
//       sleep(500);
//       let cks = className("RadioButton").find();
//       mycenterClick(cks[1]);
//       sleep(500);
//       click("确定", 0);
//       sleep(500);
//     }
//   }

// var packageName = currentPackage();

// console.log("当前应用程序包名为：" + packageName);
// 判断当前是否存在软件更新

// click("工作台");
// sleep(1000);
// click("群发助手");
// sleep(1000);
// let btn = className("TextView").textEndsWith("企业消息待发送").findOne(5000);
// let ok = null;
// if (btn) {
//   console.log("存在企业消息待发送按钮");
//   ok = btn.click();
//   if (!ok) {
//     console.log("b2");
//     ok = click(btn.text(),0)
//     if (!ok) {
//       console.log("b3");
//       ok = utils.centerClick(btn);
//     }
//   }
//   //进入后等待3秒
//   sleep(3000)
//   let list = className("TextView").textMatches(/(刚刚)|(\d+分钟前)|(\d+:\d+)/).find();
//   if (list) {
//     let num = list.size();
//     console.log("共找到" + num + "条匹配的朋友圈");
//     for (let i = 0; i < num; i++) {
//       let node = list.get(i);
//       if (node) {
//         console.log("当前为"+node.text()+"的群发消息！")
//         let tp = node.parent().parent();
//         function getP(node) {
//           if (node) {
//             let tbtn = node.findOne(
//               className("TextView").textStartsWith("发送")
//             );
//             return tbtn;
//           }
//         }
//         let tbtn = getP(tp);
//         if (!tbtn) {
//           tbtn = getP(tp.parent());
//         }
//         if (tbtn) {
//           let ok = tbtn.click();
//           if (!ok) {
//             utils.centerClick(tbtn);
//           }
//           sleep(1000);
//         }
//       }
//     }
//     if(num === 0){

//     }
//   } else {
//     console.log("找不到列表,尝试点击第一条发表任务！！！")
//     click("发表", 0);
//   }
// }

// events.observeNotification();
// events.on("notification", function (n) {
//   try {
//     if (n.packageName === "com.tencent.wework") {
//       log(n.title + ":" + n.text);
//       let arr = n.text.split(": ")
//       let gs = ""
//       let name = ""
//       let msg = ""
//       if(arr.length === 2){
//          gs = n.title
//          name = arr[0]
//          msg = arr[1]
//       }else{
//         name = n.title
//         msg = n.text
//       }
//       console.log(arr,n)
//       if (msg.indexOf("呼叫宝珠") !== -1) {
//         if (!device.isScreenOn()) {
//           device.wakeUp();
//           // sleep(1000);
//           swipe(
//             device.width / 2,
//             device.height - 100,
//             device.width / 2,
//             0,
//             500
//           );
//           sleep(800);
//         }
//         n.click();
//         sleep(3000)
//         goUserSendMsg(name,msg,name === "沈武"?"臣在！！！":"叫姐姐干嘛！有话就说有屁就放！")
//         n.delete();
//       } else {
//         n.delete();
//       }
//       n.delete();
//     }
//   } catch (error) {}
// });
// function goUserSendMsg(name,msg,sendMsg){
//     click("通讯录",0)
//     sleep(1000)
//     let node = depth(11).drawingOrder(2).findOne(1000)
//     let ok = false
//     if(node){
//         ok = node.click()
//         if(!ok){
//            ok = click(node.bounds().centerX(), node.bounds().centerY());
//         }
//         if(ok){
//             sleep(1000)
//             let edit = className("EditText").findOne(2000)
//             if(edit){
//                 edit.setText(name)
//                 sleep(1000)
//                 click(name,1)
//                 sleep(1000)
//                 let btn = text("发消息").findOne(2000)
//                 if(btn){
//                     btn.click()
//                     sleep(1500)
//                     let txt = text(msg).findOne(3000)
//                     if(txt){
//                         let msgEdit = className("EditText").findOne(2000)
//                         if(msgEdit){
//                             msgEdit.setText(sendMsg)
//                             sleep(1000)
//                             click("发送",0)
//                         }
//                         sleep(500)
//                         back();
//                         sleep(500)
//                         back();
//                         sleep(500)
//                         home();
//                     }
//                 }
//             }
//         }
//         console.log(ok)
//     }
// }

// let a = swipe(device.width / 2, device.height - 100, device.width / 2, 0, 500);
// console.log(a)
//朋友圈评论
qw.comment = (data) => {
  retry = retry || 0;
  let isOk = false;
  toastLog(`第${retry + 1}次执行任务！`);
  let { corpName, msgId } = data;
  // 错误处理
  function taskErr(msg) {
    if (!isOk && retry >= task_retry) {
      console.log(msg);
      utils.taskErrImg(msgId ? msgId + "_comment_" : "comment_");
      utils.msg = msg;
      utils.code = 0;
      qw.goIndexPage();
      return;
    }
    if (!isOk && retry < task_retry) {
      toastLog("延迟1分钟再次尝试===>", retry);
      qw.retry("comment", data, retry + 1);
    }
  }
  qw.qwInit(corpName); //初始化
  let ok = qw.gotoCorp(corpName); //切换公司
  if (!ok) {
    retry = task_retry + 1;
    taskErr("找不到指定公司！！！！");
    return;
  } else {
    //新方式走工作台
    try {
      click("工作台");
      sleep(1000);
      click("客户朋友圈");
      sleep(1000);
      qw.setComment(data, taskErr);
    } catch (error) {
      taskErr("执行朋友圈评论程序中途出错！！！");
    }
  }
};
/**
 * 等待节点时间
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
// 去朋友圈评论
qw.setComment = (data, cb) => {
  let { comment_title, comment_like, comment_content, comment_time } = data;
  if (comment_title || comment_content || comment_time) {
  } else {
    toastLog("缺少条件！！");
  }
  //   if (comment_title || comment_content) {
  //     if (utils.getTextName(comment_title)) {
  //       console.log("在朋友圈界面");
  //       click(comment_title, 0);
  //       sleep(500);
  //       let node = depth(15).findOne(2000);
  //       if (comment_like && node) {
  //         console.log("点赞一下！");
  //         node.parent().child(0).click();
  //       }
  //       if (comment_content && textContains("评论").exists()) {
  //         console.log("开始评论");
  //         //点击评论按钮
  //         click("评论", 0);
  //         sleep(300);
  //         // 查找输入框
  //         let input = className("android.widget.EditText").findOne(2000);
  //         // 输入文本
  //         input.setText(comment_content);
  //         // 点击输入框
  //         depth(9).findOnce(5).click();
  //         qw.goIndexPage();
  //       } else {
  //         utils.code = 0;
  //         utils.msg = "找不到评论按钮或点击失败";
  //       }
  //     } else {
  //       console.log("找不到指定朋友圈内容");
  //       utils.code = 0;
  //       utils.msg = "找不到对应朋友圈内容";
  //       qw.goIndexPage();
  //     }
  //   } else {
  //     console.log("不需要评论");
  //   }
};
// 获取需要操作的朋友圈列表节点
qw.getMomentsNodes = (startTime, endTime) => {
  let today = text("今天").findOne(5000);
  if (today) {
    function zeroFill(i) {
      if (i >= 0 && i <= 9) {
        return "0" + i;
      } else {
        return String(i);
      }
    }
    let zt = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let month = zt.getMonth() + 1 + "月"; //月
    let day = zeroFill(zt.getDate()); //日
    console.log("找到今天,开始查找今天父节点", month, day);
    let tp = today.parent().parent();
    while (tp.className() !== "androidx.recyclerview.widget.RecyclerView") {
      tp = tp.parent();
    }
    let list = tp.children();
    let nodeArr = [];
    let ok = false;
    for (let node of list) {
      // 开始范围
      let startTxt = node.findOne(text("今天"));
      // 结束范围
      let endTxtD = node.findOne(text(day));
      let endTxtM = node.findOne(text(month));
      if (startTxt) {
        //找到今天开始
        ok = true;
      }
      if (endTxtD && endTxtM) {
        //找到昨天结束
        ok = false;
      }
      if (ok) {
        nodeArr.push(node);
      }
    }
    return nodeArr;
  } else {
    console.log("找不到今天！！");
  }
};

// let comment_title = "杨洛来了",
//   comment_time = "",
//   comment_content = "测试";
// let nodeArr = qw.getMomentsNodes()
// console.log(nodeArr)
// if (nodeArr.length !== 0) {
//   for (let node of nodeArr) {
//     if (comment_title && comment_time) {
//       console.log("标题和时间同时存在");
//     } else if (comment_time) {
//       console.log("只存在发布时间,查找所有朋友圈发布时间并对比");
//     } else if (comment_title) {
//       let txt = node.findOne(className("TextView").textContains(comment_title));
//       if (txt) {
//         txt.click();
//         sleep(1000);

//         console.log("只存在发布标题,按标题查找", txt);
//         break;
//       }
//     }
//   }
// } else {
//   toastLog("没有今天的朋友圈");
// }
// console.log(today)

// findOne(className("LinearLayout").depth(12))

// 删除指定好友
// 删除指定好友
qw.delFriend = (params) => {
  let {
    userName, //好友名称
    verify, //是否需要进入聊天窗核实
    friendEq, //第几个好友再多好友时验证使用
    addTime, //好友添加时间
  } = params;
  friendEq = friendEq || 0;
  log("开始执行删除好友", params);
  //判断是否在企微首页
  qw.isQwHome("通讯录");
  sleep(1000);
  //进入我的客户
  if (textContains("我的客户").exists()) {
    click("我的客户");
    sleep(1000);
  }
  if (textContains("我的学员").exists()) {
    click("我的学员");
    sleep(1000);
  }
  let wxUserList = queryUser();
  let wxUserListNum = wxUserList ? wxUserList.size() : 0;
  let result = {
    state: false,
    desc: "未找到该好友聊天窗口中存在单向好友证明，请人工验证！！",
  };
  log("有" + wxUserListNum + "个用户满足条件===>", "S");
  // //查看查找结果
  if (wxUserListNum > 0) {
    result.state = ckUser(wxUserList.get(friendEq)); //进入客户
  } else {
    result.desc = "未找到该好友，请人工验证！";
    back();
    sleep(500);
    back();
  }
  console.log(
    "删除结果==========================================>",
    result.state
  );
  return result;
  //=============== 方法函数===========
  //搜索客户
  function queryUser() {
    textContains("支持加微信").findOne(6000); //防手机卡最多等6秒
    let queryBtn = className("RelativeLayout").depth(9).drawingOrder(2).find();
    if (queryBtn) {
      queryBtn = queryBtn.get(1);
      if (queryBtn) {
        let ok = utils.centerClick(queryBtn);
        if (ok) {
          //点击成功
          let input = className("EditText").findOne(2000); //查找输入框
          if (input) {
            //输入框存在
            input.setText(userName); //输入要搜索的用户名称
            sleep(1000);
            let wxUsers = text("＠微信").find(); //查找微信联系人字段列表
            return wxUsers;
          }
        }
      }
    }
  }
  //进入客户
  function ckUser(node) {
    let ok = utils.centerClick(node) && text("客户信息").findOne(2000); //等待客户信息字段
    let delOk = false;
    if (ok) {
      let timeok = timeContrast(); //时间匹配结果
      // 时间匹配
      if (timeok) {
        //是否需要进入聊天框核实
        if (verify) {
          console.log("核实后再删除===>");
          let isOk = isOneWay(); //验证是否是单向好友
          if (isOk) {
            console.log("单向好友删除处理");
            delOk = deleteUser();
          }
        } else {
          // 不需要去核实
          console.log("无需核实直接单向好友删除处理");
          delOk = deleteUser();
        }
      } else {
        console.log("添加时间匹配不上换下一个用户");
      }
    } else {
      console.log("未找到客户信息字段");
    }
    return delOk;
  }
  // 验证一次用户是否是单向好友
  function isOneWay() {
    console.log("核实是否需要删除!");
    let isOk = false;
    let btn = text("发消息").findOne(2000); //查找发消息按钮
    if (btn) {
      let ok = utils.centerClick(btn); //点击发消息按钮进入聊天界面
      if (ok) {
        text(userName).findOne(2000);
        let isStr =
          textMatches(/.*被对方拒收了.*|.*联系人验证.*/).findOne(1000);
        console.log("是否找到单向好友证明！", !!isStr);
        if (isStr) {
          sleep(1000);
          isOk = chatGoUser();
          result.desc = isStr.text();
        } else {
          if (wxUserListNum > friendEq + 1) {
            log("查下一个用户", friendEq + 1);
            back();
            let newObj = params;
            newObj["friendEq"] = friendEq + 1;
            isOk = delFriend(newObj);
          } else {
            log("没有符合的单向好友", userName);
            back();
          }
        }
      }
    }
    return isOk;
  }
  //点击删除好友操作
  function deleteUser() {
    console.log("单向好友删除处理");
    let node = text("客户信息").findOne(2000);
    let isOk = false;
    if (node) {
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
                // isOk = utils.centerClick(okBtn); //点击确认删除
                // isOk && clearChatLog(); //清空聊天记录
              }
            }
          }
        }
      }
    }
    return isOk;
  }
  // 从聊天界面进入客户信息界面
  function chatGoUser() {
    console.log("回到客户信息界面", userName);
    let isOk = false;
    let node = text(userName).findOne(2000);
    console.log("node", node);
    let pNode = utils.getParentNode(node, "android.widget.RelativeLayout"); //查找节点的父节点
    console.log("pNode", pNode);
    if (pNode) {
      //拿到父节点
      let pNodeNum = pNode.children().size();
      let btn = pNode.child(pNodeNum - 1); //找进入个人信息界面的按钮
      if (btn) {
        let ok = utils.centerClick(btn);
        if (ok) {
          //进入到个人信息界面
          text("聊天信息").findOne(2000); //等待聊天信息字段2秒
          let userNode = text(userName).findOne(2000); //找到用户名称节点
          if (userNode) {
            isOk = click(userName, 0);
            sleep(1000);
          }
        }
      } else {
        console.log("chatGoUser未找到btn");
      }
    }
    return isOk;
  }
  // 好友时间匹配
  function timeContrast() {
    let newTime = addTime.slice(0, 16);
    let node = text("添加时间").findOne(2000);
    let ok = false;
    if (node) {
      let pNode = utils.getParentNode(node, "android.widget.RelativeLayout");
      if (pNode) {
        let pNodeNum = pNode.children().size();
        let timeNode = pNode.child(pNodeNum - 1).findOne(className("TextView"));
        if (timeNode) {
          console.log(
            "原始时间:" + addTime,
            ",处理后时间:" + newTime,
            ",查找到时间:" + timeNode.text()
          );
          ok = newTime === timeNode.text();
        }
      }
    }
    if (ok) {
      console.log("时间匹配成功,找到单向好友用户!");
    }
    return ok;
  }
  // 清空聊天记录
  function clearChatLog() {
    text("聊天信息").findOne(2000); //等待聊天信息字段2秒
    let delChatLogBtn = text("清空聊天记录").findOne(2000); //找到清空聊天记录按钮
    if (delChatLogBtn) {
      let ok = utils.centerClick(delChatLogBtn);
      if (ok) {
        let clearLogBtn = text("清空").findOne(2000);
        if (clearLogBtn) {
          sleep(500);
          let ok = click("清空", 0);
          if (!ok) {
            ok = utils.centerClick(clearLogBtn);
            console.log(ok);
          }
        }
      }
    }
  }
};
let obj = [
  {
    userName: "yiye",
  },
  {
    userName: "S",
  },
];
// let d = Date.now();
// for (let i of obj) {
//   let isR = delFriend(i);
//   i = Object.assign(i, isR);
// }
// console.log(
//   (Date.now() - d) / 1000,
//   "=====================================>",
//   obj
// );
// qw.delFriend(
//   {
//     userName: "S",
//     verify:true,
//     addTime:"2023-05-30 14:32:25"
//   }
// )
// let packageName = currentPackage();
// console.log(packageName("com.tencent.wework").exists())
// utils.isApp("com.tencent.wework")

// qw.openSidebar(true)
// qw.isQwHome("消息");

// 好友时间匹配
function timeContrast() {
  let newTime = addTime.slice(0, 16);
  let node = text("添加时间").findOne(2000);
  let ok = false;
  if (node) {
    let pNode = utils.getParentNode(node, "android.widget.RelativeLayout");
    if (pNode) {
      let pNodeNum = pNode.children().size();
      let timeNode = pNode.child(pNodeNum - 1).findOne(className("TextView"));
      if (timeNode) {
        console.log(
          "原始时间:" + addTime,
          ",处理后时间:" + newTime,
          ",查找到时间:" + timeNode.text()
        );
        ok = newTime === timeNode.text();
      }
    }
  }
  if (ok) {
    console.log("时间匹配成功,找到单向好友用户!");
  }
  return ok;
}
// //进入客户
// function ckUser(node) {
//   let ok = utils.centerClick(node) && text("客户信息").findOne(2000); //等待客户信息字段
//   let delOk = false;
//   if (ok) {
//     let timeok = timeContrast(); //时间匹配结果
//     // 时间匹配
//     if (timeok) {
//       //是否需要进入聊天框核实
//       if (verify) {
//         console.log("核实后再删除===>");
//         let isOk = isOneWay(); //验证是否是单向好友
//         if (isOk) {
//           console.log("单向好友删除处理");
//           delOk = deleteUser();
//         }
//       } else {
//         // 不需要去核实
//         console.log("无需核实直接单向好友删除处理");
//         // delOk = deleteUser();
//         delOk = true;
//       }
//     } else {
//       console.log("添加时间匹配不上换下一个用户");
//     }
//   } else {
//     console.log("未找到客户信息字段");
//   }
//   sleep(1000);
//   back();
//   sleep(1000);
//   return delOk;
// }
// let allList = []; //所有列表节点距离顶部距离来识别过滤滚动时获取到的重复节点
//滚动获取列表节点
// function getListNode() {
//   let wxUsers = textStartsWith("＠微信").find(); //查找微信联系人字段列表
//   let wxUsersLen = 0; //列表的个数
//   if (wxUsers) {
//     //假如用户列表存在
//     wxUsersLen = wxUsers.size(); //获取列表个数
//   }
//   for (let i = 0; i < wxUsersLen; i++) {
//     //循环列表
//     let userNode = wxUsers.get(i); //获取到节点
//     if (userNode) {
//       console.log("获取到节点",userNode.bounds().top)
//       //假如节点存在
//       // 判断此节点是否已存在被查询过
//       let is_exist = allList.every((s) => s != userNode.bounds().top);
//       console.log(is_exist)
//       if (is_exist) {
//         let delOk = ckUser(userNode);//进入客户识别并操作
//         if(delOk){
//           console.log("已找到用户并删除成功！")
//           allList=[]
//           break
//         }
//         if(i+1 === wxUsersLen){

//         }
//         console.log("delOk====>", i,wxUsersLen);
//         //假如不存在开始匹配并加入到allList列表
//         allList.push(userNode.bounds().top);
//       }
//     }
//   }

// }
// let addTime = "2023-06-29 10:49:25",verify=false
// getListNode();
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
/**
 *
 * @param {number} count  已删除多少个好友
 * @param {number} num 已重试多少次
 */
qw.delTagFriend = (count, num) => {
  let delNum = count; //本次操作删除个数
  let isShowLog = true; //本次结果是否打印
  let isTop = false; //是否通讯录顶部，以我的客户我的学员判断
  //判断是否在企微首页
  qw.isQwHome("通讯录");
  sleep(1000);
  // 判断是否在通讯录顶部并进入
  while (!isTop) {
    //进入我的客户
    if (textContains("我的客户").exists()) {
      isTop = true;
      click("我的客户");
      sleep(1000);
    }
    if (textContains("我的学员").exists()) {
      isTop = true;
      click("我的学员");
      sleep(1000);
    }
    if (!isTop) {
      utils.upSwipe();
      sleep(500);
    }
  }
  //进入客户
  function ckUser(node) {
    let ok = utils.centerClick(node) && text("客户信息").findOne(2000); //等待客户信息字段
    let delOk = false;
    if (ok) {
      console.log("单向好友删除处理");
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
    let dxhy = textContains("单向好友").exists();
    sleep(1000);
    let isOk = false;
    if (node && dxhy) {
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
  let ok = utils.clickNode({ strName: "标签" });
  //进入指定标签
  ok && utils.clickNode({ strName: "单向好友", scroll: true });
  //开始删用户
  sleep(1000);
  let wxUsers = text("＠微信").find(); //查找微信联系人字段列表
  while (wxUsers && wxUsers.size() > 0 && delNum < 100) {
    //循环操作用户
    let ok = ckUser(wxUsers.get(0));
    if (ok) {
      delNum += 1;
    } else {
      if (num < 3) {
        console.log("退出循环重新进入！", num);
        isShowLog = false;
        qw.delTagFriend(delNum, num + 1);
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
  isShowLog && console.log("已清完本次共删除", delNum, "重试次数", num);
};

// qw.createGroup({ groupName: "正规群02", mode: 1 });

// 关闭后台APP
utils.closeApp = (appName) => {
  toastLog("唤起后台关闭" + appName);
  recents(); //唤起后台
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
    toastLog("找到===>" + appName + "并关闭");
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
  home(); //回到桌面
};
// utils.closeApp("手机管家");
// let qywx = text("企业微信").visibleToUser(true).findOne(1000);
// console.log(qywx, qywx.bounds().centerX() < device.width / 2);
// let result= shell("am force-stop com.tencent.wework")
// console.log(result)
// utils.getDayStr = (time) => {
//   function zeroFill(i) {
//     if (i >= 0 && i <= 9) {
//       return "0" + i;
//     } else {
//       return String(i);
//     }
//   }
//   let date = time ? new Date(time) : new Date();
//   let y = date.getFullYear();
//   let m = zeroFill(date.getMonth());
//   let d = zeroFill(date.getDate());
//   return y + "-" + m + "-" + d;
// };
// 回首页并去指定菜单
qw.isQwHome = (name) => {
  // 判断当前是否是企微
  qw.isApp();
  let btn1 = textContains("消息").exists();
  let btn2 = textContains("邮件").exists();
  let btn3 = textContains("文档").exists();
  let btn4 = textContains("工作台").exists();
  let btn5 = textContains("通讯录").exists();
  let isHome = btn1 && btn2 && btn3 && btn4 && btn5;
  let isqywx =
    currentPackage() === "com.tencent.wework" ||
    packageName("com.tencent.wework").exists(); //再次验证当前是否是企微
  let focusName = "";
  console.log(isqywx, "首页条件结果===>", btn1, btn2, btn3, btn4, btn5);
  if (isHome && isqywx) {
    //判断是否是企微并且在首页
    console.log("在首页");
    name && getFocusName();
  } else {
    if (!isqywx) {
      console.log("当前不在企微准备重新开启企微", isqywx);
      utils.closeApp("企业微信");
      sleep(1000);
    } else {
      console.log("在企微返回上级", isqywx);
      //在企微就返回上级
      back();
      sleep(500);
    }
    focusName = qw.isQwHome(name);
  }
  return focusName;
  function getFocusName() {
    sleep(2000);
    let node = text("通讯录").findOne(1000);
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
  }
};

// let topNode = className("GridView").findOne(1000);
// if (topNode) {
//   let addBtn = null;//添加按钮
//   let delBtn = null;//删除按钮
//   for (let i = 0; i < topNode.childCount(); i++) {
//     let node = topNode.child(i);
//     if (!node.findOne(className("TextView")).text()) {
//       //不存在文本
//       if (!addBtn) {
//         addBtn = node;
//       } else if (!delBtn) {
//         delBtn = node;
//       }
//     }
//   }
//   addBtn && utils.centerClick(addBtn);//添加按钮存在点击
// }

// utils.clickNode = (params) => {
//   let { strName, eq, t, scroll, endName } = params;
//   let tagBtn = null;
//   let endTagName = "";
//   let i = 0;
//   // 查找node节点
//   function getNode() {
//     if (eq) {
//       let btns = text(strName).find();
//       if (btns) {
//         tagBtn = btns.get(eq);
//       }
//     } else {
//       tagBtn = text(strName).visibleToUser(true).findOne(t || 1000);
//     }
//     let texts = className("TextView").visibleToUser(true).find();
//     if (texts) {
//       let totalNum = texts.size();
//       if (totalNum > 0) {
//         let newEndTagName = texts.get(totalNum - 2).text();
//         if (endTagName != newEndTagName) {
//           endTagName = newEndTagName;
//         }else{
//           console.log("到底部了")
//           i = 100;
//         }
//       }
//     }
//     if (endName) {
//       if (textContains("查看更多标签").exists()) {
//         toastLog("找到" + endName + "已到底部");
//         i = 100;
//       }
//     }
//   }
//   getNode(); //进入后先查询一次
//   //滑动查找
//   if (scroll && !tagBtn) {
//     console.log("开始滑动查询");
//     while (!tagBtn && i < 99) {
//       utils.downSwipe();
//       sleep(600);
//       getNode();
//       i += 1;
//     }
//     !tagBtn && console.log("滑动" + i + "次没找到" + strName);
//   }
//   console.log("endTagName",endTagName,i,scroll,tagBtn)
//   let ok = false; //点击是否成功
//   if (tagBtn) {
//     ok = utils.centerClick(tagBtn);
//     if (!ok) {
//       ok = click(strName, 0);
//     }
//     sleep(t || 1000);
//   }
//   return ok;
// };

// qw.delFriends = (param) => {
//   let { startTime, endTime, title, corpName } = param;
//   qw.qwInit(); //初始化
//   sleep(1500);
//   console.log("=============初始化结束=============");
//   let gotoCorpOk = qw.gotoCorp(corpName); //切换公司
//   console.log("=============切换公司结束=============！");
//   if (!gotoCorpOk) {
//     retry = task_retry + 1;
//     taskErr("找不到指定公司！！！！");
//     return;
//   } else {
//     console.log("=============去朋友圈=============！");
//     click("工作台");
//     sleep(2000);
//     //进入客户群界面
//     let ok = utils.clickNode({
//       strName: "客户朋友圈",
//     });
//     sleep(500);
//     if (!ok) {
//       //进入客户群界面
//       ok = utils.clickNode({
//         strName: "客户朋友圈",
//       });
//       sleep(500);
//     }
//   }

//   console.log("=============开始删朋友圈=============！");
//   let newStartTime = ""; //是今天的话会被赋值
//   let istoday = istodayFn(); //判断开始时间是否是今天
//   let startObj = transformTime(startTime); //转换日期赋值
//   let endObj = endTime
//     ? transformTime(endTime)
//     : { year: "", month: "", day: "" }; //结束日期
//   // 判断是否在朋友圈并等待指定元素
//   let waitJt = utils.waitNode({ name: "今天" });
//   if (waitJt) {
//     // 日期处理
//     if (istoday) {
//       //假如起始时间为今天
//       newStartTime = "今天";
//     }
//     getMomentsNodes();
//     console.log(startTime, startObj, endObj);
//   }
//   // 找节点
//   function getMomentsNodes() {
//     let startNode = null; //开始节点
//     let endNode = null; //结束节点
//     let today = text("今天").findOne(3000); //找到今天节点
//     let tp = null; //整个列表父节点
//     let isSameYear = startObj.year === endObj.year; //开启年和结束年是否一样
//     let isFindEndYear = false; //当结束年和开始年不同时需要找到才会停止
//     if (newStartTime === "今天") {
//       //假如是今天开始节点直接赋值为今天
//       startNode = today;
//     }
//     //查找起始的节点并滑动到起始节点界面
//     if (!startNode) {
//       while (!startNode) {
//         if (textContains(startObj.day).exists()) {
//           console.log("找到", startObj.day);
//           let node = textContains(startObj.day).findOne(1000);
//           if (node) {
//             let theNode = node.parent().findOne(text(startObj.month));
//             if (theNode) {
//               startNode = node.parent();
//               console.log("已找到起始日期位置界面");
//             }
//           }
//         }
//         sleep(500);
//         utils.downSwipe();
//       }
//     }
//     if (today) {
//       //找到父节点
//       try {
//         let list = getFansList();
//         if (list) {
//           let listSize = list.size(); //节点数量
//           let ok = false; //是否结束删除
//           for (let i = 0; i < listSize; i++) {
//             let node = list.get(i);
//             if (!node) {
//               console.log("不存在node了");
//               break;
//             }
//             // 找到起始点
//             if (newStartTime === "今天") {
//               if (node.findOne(text("今天"))) {
//                 console.log("找到起始节点位置", node.findOne(text("今天")));
//                 ok = true;
//               }
//             } else {
//               if (
//                 node.findOne(text(startObj.day)) &&
//                 node.findOne(text(startObj.day))
//               ) {
//                 console.log(
//                   "找到起始节点位置",
//                   node.findOne(text(startObj.day)).text(),
//                   node.findOne(text(startObj.day)).text()
//                 );
//                 ok = true;
//               }
//             }
//             // 结束年
//             if (endObj.year && !isSameYear && !isFindEndYear) {
//               //当结束年与开始年不同，并且还未遇到结束年时执行
//               isFindEndYear = textContains(endObj.year + "年").exists(); //判断当前页面是否存在
//             }
//             // 找到结束节点
//             if (
//               node.findOne(text(endObj.month)) &&
//               node.findOne(text(endObj.day)) &&
//               (isSameYear || isFindEndYear)
//             ) {
//               console.log("找到结束节点");
//               //找到昨天结束
//               ok = false;
//             }
//             if (node.findOne(text("发表到客户的朋友圈"))) {
//               console.log("跳过今天发表节点");
//               continue;
//             }
//             if (ok) {
//               console.log("点击node===>");
//               let isckOK = utils.centerClick(node);
//               sleep(1000);
//               console.log(i, listSize, isckOK);
//               if (isckOK && textContains("详情").exists()) {
//                 console.log(i, listSize, isckOK);
//                 let nodeXY = false;
//                 try {
//                   // nodeXY = utils.imgQuery("ddd");
//                   jjjjj;
//                   console.log(nodeXY);
//                   sleep(1000);
//                   if (nodeXY) {
//                     click(nodeXY.x, nodeXY.y);
//                   }
//                 } catch (error) {
//                   let dddOk = click(998, 177);
//                   if (dddOk) {
//                     sleep(500);
//                     let delNode = text("删除").findOne(1000);
//                     let delOk = utils.centerClick(delNode);
//                     if (delOk) {
//                       sleep(500);
//                       let qdOk = click("确定", 0);
//                       console.log("删除结果===>", qdOk);
//                       if (qdOk) {
//                         list = getFansList();
//                         i = 1;
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       } catch (error) {
//         console.log("错误===>", error);
//       }
//     } else {
//     }
//     //获取朋友圈列表
//     function getFansList() {
//       textContains("可将产品介绍").findOne(5000);
//       // sleep(5000)
//       tp = startNode.parent();
//       if (tp) {
//         while (tp.className() !== "androidx.recyclerview.widget.RecyclerView") {
//           tp = tp.parent();
//         }
//         return tp.children();
//       } else {
//         return tp;
//       }
//     }
//   }
//   // 日期处理
//   function zeroFill(i) {
//     if (i >= 0 && i <= 9) {
//       return "0" + i;
//     } else {
//       return String(i);
//     }
//   }
//   //获取昨天的日期字符串
//   function yesterday() {
//     let zt = new Date(Date.now() - 24 * 60 * 60 * 1000); //
//     let month = zt.getMonth() + 1 + "月"; //月
//     let day = zeroFill(zt.getDate()); //日
//     console.log("找到昨天日期", month, day);
//     return { month, day };
//   }
//   //日期转换
//   function transformTime(time) {
//     let date = new Date(time);
//     let year = date.getFullYear() + "年"; //年
//     let month = date.getMonth() + 1 + "月"; //月
//     let day = zeroFill(date.getDate()); //日
//     console.log("转换后日期", year, month, day);
//     return { year, month, day };
//   }
//   // 判断startTime是否是今天
//   function istodayFn() {
//     let date = new Date();
//     let month = zeroFill(date.getMonth() + 1); //月
//     let day = zeroFill(date.getDate()); //日
//     let year = zeroFill(date.getFullYear()); //年
//     let newDateStr = `${year}-${month}-${day}`;
//     console.log(`今天：${newDateStr},startTime：${startTime}`);
//     return newDateStr == startTime;
//   }
// };

// qw.delFriends({
//   startTime: "2023-07-05",
//   corpName: "姜丛杨",
//   // endTime: "2003-04-24",
// });

// let nodeList = className("LinearLayout").depth(12).find();
// let nodeSize = nodeList.size();
// for (let i = 0; i < nodeSize; i++) {
//   let node = nodeList.get(i);
//   if (node.findOne(text("发表到客户的朋友圈"))) {
//     console.log("跳过今天发表节点");
//     continue;
//   }
//   let ok = utils.centerClick(node);
//   console.log(ok);
// }

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
            let waitNode = utils.waitNode({
              name: isJyh ? "我的学员群" : "企业全部" + strName,
            }); //等待对应界面加载
            console.log(
              "waitNode===>",
              isJyh ? "我的学员群" : "企业全部" + strName,
              !!waitNode
            );
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
              eq: 1,
            });
            if (goGroup && !textStartsWith("快捷回复").exists()) {
              console.log("11111");
              let nodes = text("0028转移1").find();
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
            let waitNode = utils.waitNode({
              name: isJyh ? "我的学员群" : "企业全部" + strName,
            }); //等待对应界面加载
            console.log(
              "waitNode===>",
              isJyh ? "我的学员群" : "企业全部" + strName,
              !!waitNode
            );
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
              let setNameOk = editGroupName(); //编辑群名称
              sleep(1000);
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
    if (lakf) {
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
          back();
        }
      }
    }
    // ============= 拉固定客户 =============

    if (fixedTagName) {
      console.log(5555);
      sleep(1500);
      add();
    }
    if (adddckOk && fixedTagName) {
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
            }); //
            sleep(500);
            if (r) {
              let qdck = click("确定", 0);
              if (qdck) {
                sleep(1000);
                let gouOk = false; // utils.imgQuery("gou"); //获取全选坐标
                let gouckOk = false;
                if (gouOk) {
                  gouckOk = click(gouOk.x, gouOk.y); //点击全选
                } else {
                  console.log("使用坐标点击全选");
                  gouckOk = click(720, 174);
                }
                if (gouckOk) {
                  sleep(1000);
                  let qdck = click("确定", 0);
                  console.log("qdck===>", qdck);
                  sleep(5000);
                  if (textContains("拒绝加入").exists()) {
                    if (textContains("我知道了").exists()) {
                      click("我知道了", 0);
                    }
                  }
                  rOk = true;
                  // retry = task_retry + 1;
                  sleep(1000);
                  if (msgType && msgType == "send_corp_pull_group_otherB") {
                    console.log("转移A完成发送文本提示！！！！");
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
    }
    // ============= 拉外部客户 =============
    console.log("拉外部客户11111===>");
    sleep(1500);
    if (tagName) {
      console.log("拉外部客户2222===>");
      sleep(1500);
      add();
    }
    if (adddckOk && tagName) {
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
              strName: tagName,
              scroll: true,
            }); //
            sleep(500);
            if (r) {
              let qdck = click("确定", 0);
              if (qdck) {
                sleep(1000);
                let gouOk = false; // utils.imgQuery("gou"); //获取全选坐标
                let gouckOk = false;
                if (gouOk) {
                  gouckOk = click(gouOk.x, gouOk.y); //点击全选
                } else {
                  console.log("使用坐标点击全选");
                  gouckOk = click(720, 174);
                }
                if (gouckOk) {
                  sleep(1000);
                  let qdck = click("确定", 0);
                  console.log("qdck===>", qdck);
                  sleep(5000);
                  if (textContains("拒绝加入").exists()) {
                    if (textContains("我知道了").exists()) {
                      click("我知道了", 0);
                    }
                  }
                  rOk = true;
                  // retry = task_retry + 1;
                  sleep(1000);
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
      console.log("11111111");
      let addR = false; // utils.imgQuery("add"); //获取添加图标坐标
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
    // utils.taskErrImg(msgId ? msgId + "_creategroup_" : "_creategroup_");
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

// qw.createGroup({
//   mode: '1',
//   tagName: 'QC_0042转移_2',
//   groupName: '0042转移2',
//   corpName: '思思姣',
//   msgType:'send_corp_pull_group_otherA'
// });

// let r = utils.clickNode({
//   strName: "QC_杨洛官方推书群_53",
//   scroll: true,
// });
// { mode: '1',
//   tagName: 'QC_杨洛官方推书群_53',
//   groupName: '杨洛官方推书群53',
//   corpName: '姜丛杨',
//   msgType: 'send_corp_pull_group_otherA' }

// utils.clickNode({
//   strName: "QC_七七学马斯_2",
//   scroll: true,
//   t:100
// })
// groupName = "78应急1"
// let queryNode = className("RelativeLayout").depth(11).drawingOrder(2).find();
// utils.centerClick(queryNode.get(1));
// // click(800,180)
// sleep(1000);
// let input = text("搜索").findOne(2000);
// input && input.setText(groupName);
// sleep(1500);
// let goGroup = utils.clickNode({
//   strName: groupName,
//   scroll: true,
//   t: 100,
//   endName: "查看更多群",
//   eq: 1,
// });

// console.log(textStartsWith("确定").findOne(3000))