# OneDrive 免费图床

**也支持音频和视频！**

上传图片到自己的 OneDrive 网盘并生成链接，[点击试用](https://harrisoff.github.io/onedrive-image-hosting)。

**纯前端页面，没有任何后端逻辑**。可以 fork 本项目建立自己的图床网站。

## 文档

本项目基本上就是 [@harrisoff/onedrive-js-sdk](https://github.com/harrisoff/onedrive-js-sdk) 的一个 webGUI。所以只要看一下它的文档，然后替换 env 文件里的值。

`access_token` 两小时过期，因为没有服务端逻辑帮助刷新，所以过期后需要手动再次授权。这表示本项目很难作为一个图片上传模块整合到比如 PicGo 等软件里。

## 隐私说明

Demo 页面使用了 Google Analytics 和百度统计收集使用数据。它们会收集页面的 url，不过：

- Google Analytics 不会收集 url hash
- Baidu Tongji 只收集 1024 字节的 url，access_token 超出了这个长度

所以无需担心 access_token 泄露。
