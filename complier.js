import watcher from "./watcher.js";

export default class Complier {
    constructor(vm) {
        this.el = vm.$el;
        this.vm = vm;
        this.methods = vm.$methods;
        this.compile(vm.$el);
    }

    //预编译模板
    compile(el) {
        let childNodes = el.childNodes;
        Array.from(childNodes).forEach((node)=>{
            if(this.isTextNode(node)){
                this.compileText(node);
            } else if(this.isElementNode(node)){
                this.compileElement(node);
            }

            //如果还有子节点，递归调用
            if(node.childNodes && node.childNodes.length > 0){
                this.compile(node)
            }
        })

    }

    //编译元素节点，处理指令
    compileElement(node){
        if(node.attributes.length){
            Array.from(node.attributes).forEach(attr=>{
                let attrName = attr.name;
                if(this.isDirective(attrName)){
                    attrName = attrName.indexOf(':') > -1 ? attrName.substr(5) : attrName.substr(2); //获取v-后面的值
                    let key = attr.value;
                    this.update(node, key, attrName)
                }
            })
        }
    }

    update(node, key, attrName){
        const updateFn = this[attrName + 'Updater'];
        updateFn && updateFn.call(this, node, this.vm[key], key, attrName);
    }

    //解析v-text
    textUpdater(node, value, key){
        node.textContent = value
        new watcher(this.vm, key, (newValue) => {
            node.textContent = newValue;
        })
    }

    //解析v-model
    modelUpdater(node, value, key){
        node.value = value;
        new watcher(this.vm, key, (newValue) => {
            node.value = newValue;
        })

        //双向绑定
        node.addEventListener('input', () => {
            this.vm[key] = node.value;
        })
    }

    //解析 v-html
    htmlUpdater(node, value, key) {
        node.innerHTML =  value;
        new watcher(this.vm, key, (newValue) => {
            node.innerHTML = newValue;
        })
    }

    //解析v-on:click
    clickUpdater(node, value, key, attrName) {
        node.addEventListener(attrName, this.methods[key])
    }

    //编辑文本节点，处理mastache语法 {{ }}
    compileText(node) {
        let reg = /\{\{(.+?)\}\}/;
        let value = node.textContent;
        if(reg.test(value)){
            let key = RegExp.$1.trim();
            node.textContent = value.replace(reg, this.vm[key]);
            new watcher(this.vm, key, (newValue) => {
                node.textContent = newValue;
            })
        }
    }

    //判断该元素属性是否是指令
    isDirective(attrName){
        return attrName.startsWith("v-");
    }

    //判断是否是文本节点
    isTextNode(node){
        return node.nodeType === 3;
    }

    //判断是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1;
    }
}