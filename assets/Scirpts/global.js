//定义一个全局变量
import EventListener from './event_lisitent'  // 引入监听事件
const global = global || {};   //global:全局变量
global.event = EventListener({});
export default global;