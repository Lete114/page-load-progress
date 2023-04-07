# Page-Load-Progress

Let traditional ordinary websites have page loading progress when clicking a tag to jump pages

## Installation

Add [page-load-progress.js](https://cdn.jsdelivr.net/npm/page-load-progress.min.js) to your project.

```html
<script src="https://cdn.jsdelivr.net/npm/page-load-progress.min.js"></script>
```

Or

```bash
npm install page-load-progress
```

## Basic usage

Just listen to `progress:start` and `progress:end` to control the progress

```js
// Triggered when the a tag on the page is clicked
document.addEventListener('progress:start', () => {
  console.log('start')
})

// Triggered when the html file for the a tag is loaded
document.addEventListener('progress:end', () => {
  console.log('end')
})

// Triggered when the html file of the a tag is loaded incorrectly
document.addEventListener('progress:error', () => {
  console.log('error')
})

// When you need to filter some links that don't need a progress bar
pageLoadProgress({ ignoreKeywords: ['/logout'] })
```

## Add progress bar

Use [NProgress.js](https://github.com/rstacruz/nprogress/)

```js
// Triggered when the a tag on the page is clicked
document.addEventListener('progress:start', () => {
  NProgress.start()
})

// Triggered when the html file for the a tag is loaded
document.addEventListener('progress:end', () => {
  NProgress.done()
})
```

Here's a simple example of a progress bar

```js
const style = document.createElement('style')
style.textContent = `
.progress{
    top: 0; 
    left: 0;
    position: fixed;
    width: 10%;
    height: 2px;
    z-index: 103;
    background-color: #e58a8a;
    transition: width 0.4s ease 0s;
}`
document.body.appendChild(style)

document.addEventListener('progress:start', () => {
  var progress = 10
  var div = document.createElement('div')
  div.className = 'progress'
  document.body.prepend(div)
  var max = 10,
    mini = 3
  var result = max - mini
  setInterval(function () {
    var num = parseInt(Math.random() * result)
    var randomResult = num + mini
    progress += randomResult
    if (progress > 95) progress = 95
    document.getElementsByClassName('progress')[0].style.width = progress + '%'
  }, 500)
})

document.addEventListener('progress:end', () => {
  var progress = document.getElementsByClassName('progress')
  progress[0].style.width = '100%'
  setTimeout(function () {
    progress[0].parentNode.removeChild(progress[0])
  }, 700)
})
```
