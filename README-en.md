# 3D Spherical Photo Wall Component (PhotoWall3D)

A high-performance 3D photo wall component built with **GSAP**. It automatically arranges a collection of images into a 3D sphere, supporting auto-rotation, mouse/touch drag interaction, and a smooth "click-to-zoom" feature.

## 🌟 Features

* **3D Spherical Layout**: Mathematically calculates coordinates to distribute images evenly across a spherical surface.
* **Interactive Rotation**:
    * **Auto-Play**: The sphere rotates slowly on its own when there is no user interaction.
    * **Manual Drag**: Users can click and drag (or swipe on mobile) to manually rotate the sphere with smooth momentum.
* **Smooth Zooming**: Clicking any image triggers a seamless animation that zooms the photo to the center of the screen with a blurred background overlay.
* **Data-Driven**: Simply pass an array of image URLs; the component handles the rest, including looping images if the count is low.
* **Responsive Design**: Automatically adapts to different screen sizes (Desktop, Tablet, and Mobile).

## 📂 File Structure

To use this component, ensure the following files are in your project:

1.  `PhotoWall3D.js` (Component Logic)
2.  `PhotoWall3D.css` (Component Styles)
3.  `index.html` (Your implementation page)

## 🚀 Quick Start

### 1. Include Dependencies
The component requires the **GSAP** library. Include it in your HTML:

```html
<script src="[https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js](https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js)"></script>

<link rel="stylesheet" href="PhotoWall3D.css">
```

### 2. Create a Container
Add a div where the photo wall will be rendered:
```html
<div id="myPhotoWall"></div>
```

### 3. Initialize the Component
Include the JS file and initialize the class with your image array:
```html
<script src="PhotoWall3D.js"></script>
<script>
    // Your image URL array
    const myImages = [
        'img/1.jpg',
        'img/2.jpg',
        '[https://picsum.photos/200/200?random=1](https://picsum.photos/200/200?random=1)',
        // ... more images
    ];

    // Initialization
    const wall = new PhotoWall3D('myPhotoWall', myImages, {
        autoPlaySpeed: 0.1, // Rotation speed
        dragSensitivity: 0.1 // Mouse drag sensitivity
    });
</script>
```

## ⚙️ Configuration Options
You can customize the component by passing an options object as the third argument:
| Option | Type | Default | Description |
|:----|:-----|:-------|:-----|
| `rows` | `Number` | `5` | Number of horizontal rows in the sphere. |
| `colsPerRow` | `Number` | `38` | Number of images per row.|
| `baseRadius` | `Number` | `700` | The radius of the sphere in pixels. |
| `autoPlaySpeed` | `Number` | `0.1` | Increment of rotation angle per frame. |
| `dragSensitivity` | `Number` | `0.1` | Multiplier for rotation speed when dragging. |
| `rowHeight` | `Number` | `-8` | Vertical offset between rows. |

## 🛠️ FAQ
* What if I have very few images? The component will automatically loop through your provided array to fill the predefined slots (default is 190 slots: 5 rows x 38 columns) to maintain the spherical shape.

* How can I change the size of individual photos? Modify the width and height properties of the .pw-card class in the PhotoWall3D.css file.
