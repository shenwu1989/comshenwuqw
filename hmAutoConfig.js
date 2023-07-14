let app_v = device.release;
// 无障碍点击节点中心点
mycenterClick = (node) => {
  let r = click(node.bounds().centerX(), node.bounds().centerY());
  if (!r) {
    node.click();
    toastLog("本次操作无障碍失效！！！");
  }
};
// 滑动
myswipe = (a, b, c, d, e) => {
  let r = swipe(a, b, c, d, e);
  if (!r) {
    toastLog("本次滑动操作反馈无障碍失效！！！");
  }
};
console.log("鸿蒙系统device.release", app_v, device.release);
if (app_v > 9) {
  if (["HUAWEI"].includes(device.brand)) {
    toast("3秒后即将开始自动设置，请勿操作手机，直到出现重启手机界面！！！");
    try {
      v10();
    } catch (error) {
      console.log("error===>", error);
      alert("更新错误被中断！！！");
    }
  } else {
    toast("当前品牌不支持自动设置，目前只支持华为！");
  }
} else {
  if (["HUAWEI"].includes(device.brand)) {
    toast("安卓9系列暂未支持，等待技术更新支持！");
  } else {
    toast("当前品牌不支持自动设置，目前只支持华为！");
  }
}

// ==============安卓10版本============
function v10() {
  phone_gj(); //手机管家
  sleep(1000);
  try {
    mmjd(); //APP应用
  } catch (error) {

  }
  sleep(1000);
  xtsz(); //系统设置
  sleep(1000);
  powerDialog();
}
// 手机管家
function phone_gj() {
  // =====解除管控=======
  launchApp("手机管家"); //打开手机管家
  toast("手机管家设置！");
  sleep(1000);
  let isSy =
    textContains("立即优化").exists() || textContains("一键优化").exists();
  while (!isSy) {
    sleep(500);
    isSy =
      textContains("立即优化").exists() || textContains("一键优化").exists();
    if (!isSy) {
      back();
    }
    sleep(500);
  }
  let bdcs = text("病毒查杀").findOne(5000);
  if (bdcs) {
    mycenterClick(bdcs);
    sleep(500);
    text("风险管控中心").className("TextView").findOne(2000);
    click("风险管控中心", 0);
    sleep(500);
    if (!text("管控").findOne(1000)) {
      text("秘密基地").className("TextView").findOne(2000);
      click("秘密基地", 0);
      sleep(500);
      click("解除管控", 0);
      sleep(500);
      text("解除管控").className("Button").findOne(2000).click();
      sleep(500);
    }
    back();
    sleep(500);
    back();
  }
  // =======应用启动管理设置===========
  toast("应用启动管理设置");
  sleep(1000);
  isSy = textContains("立即优化").exists() || textContains("一键优化").exists();
  while (!isSy) {
    sleep(500);
    isSy =
      textContains("立即优化").exists() || textContains("一键优化").exists();
    if (!isSy) {
      back();
    }
    sleep(500);
  }
  let yyqdgl = text("应用启动管理").findOne(5000);
  if (yyqdgl) {
    mycenterClick(yyqdgl);
    sleep(500);
    let input = text("搜索应用").findOne(3000);
    input.click();
    input.setText("秘密");
    if (text("秘密基地").findOne(1000)) {
      let switchNode = className("Switch").findOne(3000);
      if (switchNode.checked()) {
        mycenterClick(switchNode);
      }
      sleep(500);
      if (text("允许自启动").findOne(1000)) {
        let switchNodes = className("Switch").find();
        for (let s of switchNodes) {
          if (!s.checked()) {
            mycenterClick(s);
            sleep(500);
          }
        }
      }
    }
  }
}
// 秘密基地设置
function mmjd() {
  launch("com.shenwu.qw.m"); //打开App
  sleep(1000);
  text("启动前点击").findOne(5000);
  //=======设置前台保活=======
  app.startActivity("console");
  if (desc("更多选项").findOne(1000)) {
    desc("更多选项").findOne(1000).click();
    sleep(500);
    click("设置", 0);
    sleep(500);
    let switchNodes = className("Switch").find();
    if (!switchNodes[0].checked()) {
      mycenterClick(switchNodes[0]);
      sleep(500);
    }
    if (!switchNodes[4].checked()) {
      mycenterClick(switchNodes[4]);
      sleep(500);
    }
    back();
    sleep(500);
    back();
    sleep(500);
    //=======电池优化======
    var intent = new Intent();
    intent.setAction("android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS");
    app.startActivity(intent);
    if (text("不允许").findOne(5000)) {
      click("不允许", 0);
      sleep(500);
      click("所有应用", 0);
      sleep(500);
      let input = text("搜索应用").findOne(3000);
      input.click();
      sleep(500);
      input.setText("秘密");
      sleep(1000);
      if (text("允许").findOne(2000)) {
        click("秘密基地", 0);
        sleep(800);
        let cks = className("RadioButton").find();
        console.log(cks.get(1));
        mycenterClick(cks[1]);
        sleep(800);
        click("确定", 0);
        sleep(500);
      }
    }
  }
  back();
}
//系统
function xtsz() {
  launchApp("设置"); //打开设置
  goIndex(); //回到首页
  //   overUpdate(); //关闭系统更新
  //   goIndex(); //回到首页
  showM();
  goIndex(); //回到首页
  hideWifi();
  goIndex(); //回到首页
  setApp();
}
//关闭系统更新
function overUpdate() {
  let isOk = query("软件更新", "系统和更新");
  if (isOk) {
    let rNode = desc("菜单").findOne(3000);
    if (text("新版本").findOne(2000) || textContains("新版本").exists()) {
      back();
    }
    rNode = desc("菜单").findOne(3000);
    mycenterClick(rNode);
    sleep(300);
    click("本机设置", 0);
    let switchNodes = className("Switch").find();
    for (let s of switchNodes) {
      if (s.checked()) {
        mycenterClick(s);
        sleep(500);
        let gb = text("关闭").findOne(1000);
        if (gb) {
          mycenterClick(gb);
        }
        sleep(500);
      }
    }
    back();
  }
}
// 调整亮度
function showM() {
  let isOk = query("休眠", "显示和亮度");
  if (isOk) {
    sleep(1000);
    scrollDown();
    myswipe(
      device.width / 2,
      device.height * 0.9,
      device.width / 2,
      device.height * 0.5,
      500
    ); //上滑动
    sleep(500);
    text("休眠").findOne(2000);
    click("休眠", 0);
    sleep(500);
    let ck = text("30 秒").findOne(2000);
    mycenterClick(ck);
    sleep(500);
  }
}
// 休眠网络
function hideWifi() {
  let isOk = query("休眠", "休眠时始终保持网络连接");
  if (isOk) {
    sleep(1500);
    let txt = text("休眠时始终保持网络连接").findOne(3000);
    if (txt) {
      let p = txt.parent().parent();
      let s = p.child(1).findOne(className("Switch"));
      if (s && !s.checked()) {
        mycenterClick(p.child(1));
      }
    }
  }
}
// 应用
function setApp() {
  let isOk = query("应用和", "应用和服务");
  if (isOk) {
    sleep(1000);
    msg(); //通知管理
    goAppIndex(); //回调应用信息页
    qx(); //权限
    goAppIndex(); //回调应用信息页
    wifi(); //流量
    goAppIndex(); //回调应用信息页
    isSet(); //系统权限
    sleep(1000);
    toast("设置结束请重启手机后打开APP启动应用！");
  }
  //通知设置
  function msg() {
    text("应用管理").findOne(2000);
    click("应用管理", 0);
    sleep(500);
    let input = desc("搜索查询").findOne(1000);
    input.click();
    sleep(500);
    input.setText("秘密");
    sleep(500);
    click("秘密基地", 0);
    text("通知管理").findOne(2000);
    click("通知管理", 0);
    sleep(1000);
    text("允许通知").findOne(2000);
    let switchNode = className("Switch").findOne(1000);
    if (!switchNode.checked()) {
      mycenterClick(switchNode);
      sleep(500);
      let list = depth(10).find();
      for (let node of list) {
        if (node.className() === "android.widget.ImageView") {
          sleep(1000);
          mycenterClick(node);
          sleep(1000);
          let txt = text("横幅通知").findOne(3000);
          if (txt) {
            let p = txt.parent().parent();
            let s = p.child(1).findOne(className("Switch"));
            if (s && !s.checked()) {
              mycenterClick(p.child(1));
              sleep(500);
            }
          }
          back();
        }
      }
    }
  }
  //权限
  function qx() {
    text("权限").findOne(2000);
    click("权限", 0);
    sleep(1000);
    scrollUp();
    sleep(500);
    let arr = [];
    let list = className("TextView").depth(14).drawingOrder(1).find();
    forQx();
    sleep(500);
    scrollDown();
    console.log("翻页结束");
    sleep(500);
    list = className("TextView").depth(14).drawingOrder(1).find();
    forQx();
    function forQx() {
      for (let node of list) {
        let txt = node.text();
        if (arr.findIndex((i) => i == txt) === -1) {
          sleep(500);
          let newNode = text(txt).findOne(1000);
          if (newNode && newNode.visibleToUser()) {
            sleep(500);
            arr.push(txt);
            mycenterClick(newNode);
            sleep(500);
            console.log("txt===>", txt, newNode.visibleToUser());
            if (textContains("始终允许").exists()) {
              click("始终允许", 0);
              console.log("始终允许===>", txt);
            } else if (textContains("仅使用期间允许").exists()) {
              click("仅使用期间允许", 0);
              console.log("仅使用期间允许===>", txt);
            } else {
              click("允许", 0);
              console.log("允许===>", txt);
            }
            // click("禁止", 0);
            sleep(500);
          }
          if (!textContains("秘密基地权限").exists()) {
            back();
          }
        }
      }
    }
  }
  //流量
  function wifi() {
    text("流量使用情况").findOne(2000);
    click("流量使用情况", 0);
    sleep(1000);
    scrollDown();
    myswipe(
      device.width / 2,
      device.height * 0.9,
      device.width / 2,
      device.height * 0.5,
      500
    ); //上滑动
    sleep(1000);
    let switchNodes = className("Switch").find();
    for (let s of switchNodes) {
      if (!s.checked()) {
        sleep(500);
        mycenterClick(s);
        sleep(500);
      }
    }
  }
  //修改系统设置
  function isSet() {
    sleep(500);
    scrollDown();
    sleep(500);
    click("修改系统设置", 0);
    sleep(1000);
    let switchNode = className("Switch").findOne(1000);
    if (!switchNode.checked()) {
      mycenterClick(switchNode);
    }
  }
  //返回应用信息页
  function goAppIndex() {
    let isIndex = text("卸载").findOne(1000);
    while (!isIndex) {
      isIndex = text("卸载").findOne(1000);
      if (!isIndex) {
        back();
      }
    }
  }
}
//回到设置首页
function goIndex() {
  let isIndex = desc("设置").findOne(1000) || text("设置").findOne(1000);
  while (!isIndex) {
    isIndex = desc("设置").findOne(1000) || text("设置").findOne(1000);
    if (!isIndex) {
      back();
    }
  }
  sleep(1000);
}
// 搜索设置
function query(str, str1) {
  textStartsWith("设置").findOne(5000);
  let input = className("EditText").findOne(1000);
  while (!input) {
    input = className("EditText").findOne(1000);
    myswipe(
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
    let editText = className("EditText").findOne(1000);
    sleep(1000);
    editText.setText(str);
    text(str1).findOne(5000);
    click(str1, 0);
  }
  return !!input;
}
