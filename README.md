# Free OneDrive Image Hosting

**Audio and Video are supported too!**

![deploy status](https://github.com/harrisoff/onedrive-image-hosting/workflows/deploy/badge.svg)

[Online Demo](https://harrisoff.github.io/onedrive-image-hosting)

Upload images to your OneDrive driver and generate their links.

**Just some static files, completely free from server**. You can fork and build your own image hosting site.

[中文文档](./README.zh-cn.md)

## Document

Please check [@harrisoff/onedrive-js-sdk](https://github.com/harrisoff/onedrive-js-sdk) (because this is basically it's webGUI) then replace env files' values with yours.

### Integration

After authenticating you'll get an `access_token` which has a lifetime of 2 hours.

Every time the token is expired you'll have to manually re-authenticate because there is no backend logics helping us to refresh it, which means, it's hard to be integrated as an image uploading module to other systems, for example, PicGo.

## Privacy

Online demo uses [Google Analytics](https://analytics.google.com/analytics/web/#/) and [Baidu Tongji](https://tongji.baidu.com/web/welcome/login) to track the usage. As you may know, they will collect the url however:

- Google Analytics does not collect url hash
- Baidu Tongji only collects 1024 bytes of the url, which is not enough to store the access token

So don't worry about leaking the access token.
