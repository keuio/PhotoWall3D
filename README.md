# PhotoWall3D
3D 球面照片墙组件 (PhotoWall3D) 这是一个基于 **GSAP** 动画库开发的 3D 照片墙组件。它能将一组图片自动排布成一个 3D 球体，支持自动旋转、鼠标/触摸拖拽交互以及点击放大查看。（A high-performance 3D photo wall component built with **GSAP**. It automatically arranges a collection of images into a 3D sphere, supporting auto-rotation, mouse/touch drag interaction, and a smooth "click-to-zoom" feature.）


## 🌟 功能特性

* **3D 球面排布**：自动计算数学坐标，将图片均匀分布在球面上。
* **交互式旋转**：
    * **自动旋转**：无需操作时，球体缓慢自转。
    * **手动拖拽**：按住鼠标左键（或手机触摸）并左右滑动，可实时平滑控制旋转角度。
* **平滑放大查看**：点击任意图片，图片会以平滑动画放大至屏幕中央，并带有模糊背板效果。
* **数据驱动**：只需传入图片 URL 数组，组件会自动循环填充球面。
* **响应式适配**：自动兼容 PC 端与移动端屏幕尺寸。

## 📂 文件结构

在使用组件前，请确保文件夹中包含以下文件：

1.  `PhotoWall3D.js` (组件逻辑)
2.  `PhotoWall3D.css` (组件样式)
3.  `index.html` (你的页面)

## 🚀 快速上手

### 1. 引入依赖
组件依赖 **GSAP** 动画库，请在 HTML 中引入：
```html
<script src="[https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js](https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js)"></script>

<link rel="stylesheet" href="PhotoWall3D.css">
```

### 2. 准备容器
在页面中放置一个用于展示照片墙的 div：
```html
<div id="myPhotoWall"></div>
```

### 3. 初始化组件
在页面底部引入 JS 文件并初始化：
```html
<script src="PhotoWall3D.js"></script>
<script>
    // 你的照片路径数组
    const myImages = [
        'img/1.jpg',
        'img/2.jpg',
        '[https://picsum.photos/200/200?random=1](https://picsum.photos/200/200?random=1)',
        // ... 更多图片
    ];

    // 初始化
    const wall = new PhotoWall3D('myPhotoWall', myImages, {
        autoPlaySpeed: 0.1, // 自转速度
        dragSensitivity: 0.1 // 拖拽灵敏度
    });
</script>
```

## ⚙️ 配置参数
在初始化时，你可以通过第三个参数对照片墙进行微调：
| 参数 | 类型 | 默认值 | 说明 |
|:----|:-----|:-------|:-----|
| `rows` | `Number` | `5` | 球面显示的行数 |
| `colsPerRow` | `Number` | `38` | 每行显示的图片数量 |
| `baseRadius` | `Number` | `700` | 球体的半径（像素） |
| `autoPlaySpeed` | `Number` | `0.1` | 自动旋转的速度（每帧增加的角度） |
| `dragSensitivity` | `Number` | `0.1` | 鼠标拖拽时的灵敏度 |
| `rowHeight` | `Number` | `-8` | 行与行之间的垂直偏移量 |

## 注意事项
图片数量：为了保证最佳的 3D 效果，组件默认会生成约 190 个卡片位。如果你传入的 myImages 数组只有 10 张图，组件会自动循环重复使用这些图片来填满球体。

图片大小：在 PhotoWall3D.css 中修改 .pw-card 的 width 和 height 即可。
