

cc.Class({
    extends: cc.Component,

    properties: {

        audio_bgmusic : cc.AudioClip,
        audio_select : cc.AudioClip,    
    },

    onLoad:function(){
        //设置声音大小
        cc.audioEngine.setEffectsVolume(0.2);
        //背景音乐，循环播放
        cc.audioEngine.playMusic(this.audio_bgmusic,true);
    },

    on_click_go:function(){    
        cc.audioEngine.playMusic(this.audio_select,false);
        cc.director.loadScene("game_world")
    },

    start () {

    },

    // update (dt) {},
});
