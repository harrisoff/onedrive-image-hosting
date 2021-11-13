# OneDrive 免费图床

上传图片到自己的 OneDrive 网盘，并生成可以用于 `<img>` 标签的链接。

在 github pages 上部署了一份，[点击试用](https://harrisoff.github.io/onedrive-image-hosting)。你也可以 fork 本项目**建立自己的图床服务**。

## 开发

本项目基本上就是 [@harrisoff/onedrive-api](https://github.com/harrisoff/onedrive-api) 的一个 webGUI。

启动本地服务器之前，先在根目录创建 `env.development` 文件，参考 `env.production` 文件填写，不过要把值替换为你自己的。
