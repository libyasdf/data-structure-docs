ReactDom.render = function render(jsxOBJ, container, callback) {
    let { type, props } = jsxOBJ;

    // 创建DOM元素
    if (typeof type === "string") {
        // 创建DOM元素对象（真实DOM）
        let element = document.createElement(type);
        // 给创建的DOM设置属性
        for (let key in props) {
            if (!props.hasOwnProperty(key)) break;

            // 样式特殊处理
            if (key === "className") {
                element.setAttribute("class", props[key]);
                continue;
            }

            // 行内样式特殊处理
            if (key === "style") {
                let styleOBJ = props["style"];
                for (const attr in styleOBJ) {
                    if (!styleOBJ.hasOwnProperty(attr)) break;
                    element.style[attr] = styleOBJ[attr];
                }
                continue;
            }

            // 子元素特殊处理
            if (key === "children") {
                let children = props["children"];
                if (!Array.isArray(children)) {
                    children = [children];
                }
                // 循环子元素
                children.forEach(item => {
                    // 如果，子元素是文本，直接赋值给element
                    // 如果，是新的虚拟DOM对象，调用render方法，将新创建的DOM对象增加给element（递归）
                    if (typeof item === "string") {
                        element.appendChild(document.createTextNode(item));
                        return;
                    }
                    render(item, element);
                });
                continue;
            }

            element.setAttribute(key, props[key]);
        }

        // 增加到指定容器中
        container.appendChild(element);

        // 触发回调函数
        callback && callback();
    }

}