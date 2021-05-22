# 基于 OneDrive API 的图床

## 0. 前言

### online demo

https://harrisoff.github.io/onedrive.html

### 几个地址

- [OneDrive主页](https://onedrive.live.com/)
- [应用程序申请和管理页](https://apps.dev.microsoft.com/)
- [官方中文文档](https://docs.microsoft.com/zh-cn/onedrive/developer/)

> 官方中文文档的目录比较乱。
> 左侧的导航栏里，并没有列出每个父选项的所有子选项，可能还有一部分子选项列在了父选项所在页面中。
> 比如 **“REST API - 概念”**这一项，左侧导航栏里有一部分，页面中有另一部分。

### 大致流程

1. 注册 Microsoft 账户，创建应用程序并配置
2. 在授权页登录，跳转并提取 `access_token`
3. 上传文件到 OneDrive，返回文件 `id`
4. 通过文件 `id` 请求 `ShareId`
5. 拼接 URL 得到可嵌入 img 标签的图片链接

### 其他

OneDrive 在墙外，但是分享生成的图片链接是可以正常访问的。

> 上传速度感人。

API 所在的域名为 `https://graph.microsoft.com/v1.0/`，官方文档里好像没有明确提到，找了好久。

## 1. 注册和创建应用程序

注册 Microsoft 账户后，在 [My Application](https://apps.dev.microsoft.com/#/appList) 页创建一个应用程序。

> Guided Setup 项勾选后，会多一个页面，提供一些帮助文档和 Demo 的链接。
> 不过其中有些页面已经不存在了，目测挺久没有更新过了。

创建完成后，进入应用程序注册页。“平台”一项选择Web，“重定向URL”中添加要跳转的地址。
就算是 `localhost` 也要添加，比如 `http://localhost:8001/test`。

保存。

## 2. 授权

[官方文档 - 支持的身份验证流](https://docs.microsoft.com/zh-cn/onedrive/developer/rest-api/getting-started/graph-oauth#supported-authentication-flows)

两个最常见的验证方式：

- 令牌流，一小时内有效
- 代码流，长期有效

**代码流不支持单页应用**，会发生跨域错误，见 [https://github.com/OneDrive/onedrive-explorer-js/issues/6](https://github.com/OneDrive/onedrive-explorer-js/issues/6)。

这里使用**令牌流**。访问以下 url：
```
https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id={clientId}&response_type=token&redirect_uri={redirectUrl}&scope=openid%20https://graph.microsoft.com/Files.ReadWrite.All
```

> `scope` 的类型参考[官方文档 - OneDrive API 的权限](https://docs.microsoft.com/zh-cn/onedrive/developer/rest-api/concepts/permissions_reference)
>
> `scope` 的值会影响生成的 `access_token` 的权限。比如想要上传文件，至少要有写权限。
> 这里使用的权限为 `Files.ReadWrite.All`，其他的不再详细研究。

**重要的一点**：如果参数有错，可能仍然可以正常访问登录页，只是登陆后跳转会失败，但是页面不会显示错误的详细信息。
**详细信息在 URL 里。**如 `client_id` 错误，`scope` 类型错误等。

跳转后，会在跳转后链接中附加四个参数：

- `access_token`
- `token_type`
- `expires_in` 3600，也就是一小时内有效
- `scope`

**另一个重要的地方**
这四个参数并不是 URL 参数，不是用 `?` 连接的，而是用 `#`。

提取 `access_token`。

## 3. 小文件上传

提供了两种接口用来上传文件。这里介绍适用于 4Mb 以下小文件上传的接口。

> 上传前若能判断一下文件大小是极好的。

[官方文档 - 小文件上传](https://docs.microsoft.com/zh-cn/onedrive/developer/rest-api/api/driveitem_put_content)

官方文档列出了 5 个接口，分别是 `/drives`，`/groups`，`/me/drive/items`，`/sites`，`/users`。
`/me/drive/items` 指的应该就是自己的网盘了。其他 4 项还没有仔细研究过。

> [官方文档 - 路径的正确写法](https://docs.microsoft.com/zh-cn/onedrive/developer/rest-api/concepts/addressing-driveitems)

总之，是用 URL 指定目标路径，请求正文中挂载文件内容，请求头中设置 `access_token` 和 `Content-Type` 等。

官方文档中说，[请求正文的内容应该是要上载文件的二进制流](https://docs.microsoft.com/zh-cn/onedrive/developer/rest-api/api/driveitem_put_content#request-body)。
但是对于 `FileReader`，需要调用的是 `readAsArrayBuffer` 方法，而不是 `readAsBinaryString`。直接将 `result` 作为请求正文。

请求头中，设置 `Authorization` 值为 "Bearer" + 一个空格 + `access_token` 字符串。

> 貌似不用设置 `Content-Type`

发送请求，获取返回值中的文件 `id`，下一步将会用到。

示例：

```js
var reader = new FileReader();
reader.readAsArrayBuffer(file);
reader.onloadend = function (e) {
  $.ajax({
    method: "PUT",
    url: 'https://graph.microsoft.com/v1.0/me/drive/root:/file.ext:/content',
    data: reader.result,
    processData: false,
    headers: {
      'Authorization': 'Bearer ' + token,
    },
    success: function (data) {
      console.log(data.id)
    },
    error: function (error) {
      console.log(error);
    }
  })
}
```

## 4. 大文件上传

指 4Mb 以上，60Mb 以下的文件。

先调用 `createUploadSession` 接口，获取真正的上传 URL，再使用返回的 URL 上传文件。

不再展开讲。代码中已经实现。

## 5. 获取 ShareId

[官方文档 - 创建共享链接](https://docs.microsoft.com/zh-cn/onedrive/developer/rest-api/api/driveitem_createlink)里已经写得比较清楚了，不再赘述。

有这么几点发现：

- 关于 API 中文件位置的参数，实际上有两种方式：
  - 使用文件或目录的 `id` 作为参数，官方文档的写法
  - 使用文件路径作为参数，意外发现的写法

  官方文档里，创建共享链的5个接口都是以 `id` 作为参数的，实际上**官方文档正式给出的**也只有以 `id` 作为参数的 API。

  但是前面在上传文件时，使用了文件路径作为参数，所以**猜测**在这里说不定也可以。   
  试了一下确实是可以的。比如：官方写法 `/me/drive/items/{itemId}/createLink` 改为使用路径的写法 `/me/drive/root:/file.ext:/createLink`

  同理，其他接口**可能**也适用，不过暂时还没有试验过。

  **但是！**还是使用 `id` 更合适，因为文件名、目录名都是可以修改的，改了之后路径就不同了，而 `id` 是不会变的。而且毕竟是官方文档提供的方法，用路径做参数的方法以后会失效也说不定。

- 关于请求正文中的参数
  - `scope`：个人用户只能使用 `anonymous`。使用 `organization` 会报错
  - `type`：`view` 和 `embed` 的效果貌似是一样的。

请求成功后，返回值中会有一个 `webUrl`，但是打开后发现，文件是显示在 OneDrive 页面里的。
所以如果文件是图片，这个接口的返回值是不能直接拿来作为页面里 img 标签的 `src` 属性的。

[https://github.com/OneDrive/onedrive-api-docs/issues/622](https://github.com/OneDrive/onedrive-api-docs/issues/622) 提供了一个方法。

仍然使用上面的 API，不过不使用返回值里面的 `webUrl`，而是使用 `ShareId`。
把 `ShareId` 替换到以下 URL 中，就能够作为 img 标签的 `src` 属性了：

```
https://api.onedrive.com/v1.0/shares/{shareId}/root/content
```

根据该 Issue 里的回复，拼接而成的这个 URL 的有效性与对应文件以 `type=embed` 参数创建的共享链接的有效性相同。
即，如果以参数 `type=view` 或 `type=edit` 创建了一个文件的共享链接，那么使用返回的 `ShareId` 拼接成 URL，这个 URL 是无效的，只有 `type=embed` 时才可以。

> 但是经过试验，`view` 和 `embed` 效果是一样的。`edit` 还没有试过。

同时，如果正确创建了共享链接，后来取消了共享，那么由这个 `ShareId` 拼接成的 URL 也同时失效了。

> 还没有试验过。

到这里，就实现了上传图片返回可用链接的目的。

## 6. 其他

如果上传的文件名与已有文件重复，会覆盖原有文件，并且文件的 id 是相同的。
所以有以下情况：
如果上传了一张图片 a.jpg 并且生成了分享链接，然后上传了同名的另一张图片 a.jpg。就算后面的图片仅仅是上传，并没有分享，依然**会继承被覆盖文件的分享状态**，使用第一图片的分享链接也可以看到第二张图片。
