// 公共设置key
let commonSettingKey = [
    { key: 'debugModel', type: "开关" },
    { key: 'debugSleep', type: "输入框" },
    { key: 'webSocketLog', type: "开关" },
	{ key: 'showRemtoeExecScriptContent', type: "开关" },
    { key: 'autoRun', type: "开关" },
    /* { key: '文字识别插件', type: "单选框" }, */
    { key: 'otherClickText', type: "输入框" },
    { key: 'standardWidth', type: "输入框" },
    { key: 'standardHeight', type: "输入框" },
    { key: 'standardConvert', type: "开关" },
    { key: 'phone_number', type: "输入框" },
	{ key: 'phone_holder', type: "输入框" },
]

/* let 文字识别插件列表 = [ { id: 1, name: '浩然' },{ id: 2, name: 'tomato' }, { id: 3, name: '谷歌' }] */

var constant = {
    'commonSettingKey': commonSettingKey
    /* ,
    '文字识别插件列表': 文字识别插件列表 */
}
module.exports = constant