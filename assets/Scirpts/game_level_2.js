import global from './global'
import { EAFNOSUPPORT } from 'constants';
//设置状态机
const towerState = {
    //无效的状态
    Invalid : -1,
    Null : 1,
    BuildMenu : 2,
    Tower : 3,
    UpdateMune : 4,  //升级塔

}

cc.Class({
    extends: cc.Component,

    properties: {
       
    },



    start () {

    },

});
