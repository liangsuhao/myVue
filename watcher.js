//获取更改前的值存起来，并创建一个 update 实例方法，在值被更改的时候去执行实例中的 callback 以达到视图更新

import Dep from "./dep.js";
export default class watcher {
    constructor(vm, key, cb){
        this.vm = vm;
        this.key = key;
        this.cb = cb;
        Dep.target = this;
        this.oldValue = vm[key]
        Dep.target = null;
    }

    //数据发生变化试图更新
    update() {
        let newValue = this.vm[this.key];
        if(this.oldValue === newValue){
            return;
        }
        this.cb(newValue);
    }
}