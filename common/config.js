var appConfig = {
  phone_version: device.release, //系统版本
  phone_version_long:"",//完整
  phone_system:"",//系统
  dev_ws_url: "ws://47.99.91.240:8090", //socket地址
  // pro_ws_url: "ws://api.zanxiangwl.com/corpSendMsg/api/ws/phone", //socket地址
  pro_ws_url: "ws://47.96.158.150:10080/corpSendMsg/api/ws/phone", //socket地址
  my_ws_url: "", //自定义socket地址
  ws_url_yk: "ws://47.99.157.216:8090", //云控ws47.99.157.216
  // ws_url_yk: "ws://192.168.2.50:8090", //云控ws47.99.157.216
  http_url_yk: "http://47.99.157.216:8089", //云控ws
  phone_width: device.width, //设备宽度
  phone_height: device.height, //设备高度
  phone_model: device.model, //设备型号
  phone_brand: device.brand, //厂商品牌
  phone_number: "", //手机背后贴纸编号
  phone_holder: "", //手机持有者
  phone_cell: device.getBattery(), //手机电量
  qw_name: "", //客服名称
  qw_corp_list: [], //当前手机企微客服中的企微号列表
  app_version: "2.2.8", //辅助版本号 新版本请同步修改
  app_mode: "pro",
};
//=======================判断版本获取唯一ID=======================
if (device.sdkInt >= 28) {
  appConfig.uuid = device.getAndroidId();
} else {
  appConfig.uuid = device.getIMIE();
}

// =======================公共储存对象=======================
var commonStorage = storages.create("shenwu1989@gmail.com" + "ui");
//获取本地存储中的企微客服名称，存在放入全局配置变量
if (commonStorage.get("qw_name")) {
  appConfig.qw_name = commonStorage.get("qw_name");
}
//获取本地存储中的企微列表，存在放入全局配置变量
if (commonStorage.get("qw_corp_list")) {
  appConfig.qw_corp_list = JSON.parse(commonStorage.get("qw_corp_list"));
}
commonStorage.put("appConfig", JSON.stringify(appConfig));

module.exports = appConfig;
