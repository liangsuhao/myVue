import Dep from './dep.js'

export default class Observer {

    constructor(data){
        this.traverse(data);
    }

    //遍历data中的所有变量属性 添加观察
    traverse(data){
        if(!data || typeof data !== 'object'){
            return;
        }
        Object.keys(data).forEach((key)=>{
            this.defineReactive(data, key, data[key]);
        })
    }

    defineReactive(obj, key, val){
        const that = this;
        this.traverse(val); //递归调用

        const dep = new Dep();
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            get(){
                console.log(Dep.target)
                Dep.target && dep.addSub(Dep.target)  //收集依赖
                return val;
            },
            set(newValue){
                if(newValue === val) {
                    return;
                }
                val = newValue;
                that.traverse(); //newVal可能是个对象
                dep.notify();  //通知watcher数据更新了，要进行相应的响应式变化
            }
        })
    }
}