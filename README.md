借助 Vercel 部署 Geetest 过码验证，供公主连结B服玩家手动过码使用。

# 部署方式
0. Fork本项目到你的仓库
1. 注册并登录[Vercel](https://vercel.com/)
2. 点击[此处](https://vercel.com/new)以在Vercel中Import你Fork后的项目。项目此时很可能未出现在列表中，请点击`Adjust GitHub App Permissions`进行设置，授权Vercel访问你Fork后的项目。设置成功后，点击`Import`。
3. 在新页面中，不需要调整任何设置，直接点击`Deploy`。稍等片刻，Vercel部署完毕后会跳转页面。点击`Continue to Dashboard`进入项目面板。
4. 点击导航栏中`Storage`，点击最下方的`Browse Database Integrations`，在新页面中找到`Upstash - Serverless Redis and Kafka`并点击。
5. 在新页面中点击`Add Integration`，在悬浮窗中选择（步骤1中注册的）Vercel账户，点击`Continue`后，选择`Specific Projects`，选择（步骤3中）部署好的项目，点击`Continue`，点击`Add Integration`。
6. 在新页面中出现一个表格。点击下方的`Upstash`框中的`Redis`栏，点击`Create new database...`。
7. 在新页面中出现一个表格，`Name`栏填入任意名字，Type选择Global，勾选`TLS (SSL) Enabled`，点击`Create Database`。
8. 回到步骤6中的表格，在`Project`栏中选择（步骤3中）部署好的项目，在`Redis`栏中选择（步骤7中）创建好的数据库，点击`Save`。
9. 在步骤8完成后，Vercel会将你重定向至你的Dashboard。点击导航栏中的`Overview`，进入（步骤3中）部署好的项目。
10. 在项目面板中，点击导航栏中的`Settings`。在左侧菜单栏中点击`Integrations`后，应看到Upstash；点击`Environment Variables`后，应看到由Upstash为你注册的三条记录。
11. 在项目面板中，点击导航栏中的`Deployments`，找到下方记录中最右侧的设置（图标尾三圆点），点击`Redeploy`，在悬浮窗中再次点击`Redeploy`。

## 验证是否部署成功
（临时说明）

可以参考[此文件](https://github.com/watermellye/HoshinoBot/blob/lei/hoshino/modules/query/_bili_game_sdk.py#L191)底部被注释掉的`TestEllyeManual()`测试函数。

将print()中的域名改为你的vercel项目域名，触发`StartCaptcha()`函数后，访问第一个print中的url。过码完毕后，访问第二或第三个url。若出现了一个dict样式的结果，说明部署成功。

请注意，如果你（或你的服务器）在境内，vercel提供的域名（很可能）无法访问。如有需要，请参考下方说明绑定您自己的（境内可访问的）域名。

# 绑定域名（可选）
Vercel提供的默认访问Url需科学上网访问。若需能让境内用户直连访问，请按照以下步骤绑定你的域名。
1. 在项目面板中，点击导航栏中的`Settings`，在左侧菜单栏中点击`Domains`，在右侧输入你准备好的（二级）域名，点击`Add`。
2. 此时，Vercel会提示配置失败，并告知您需如何操作。以CNAME方式为例，您需登录您的域名提供商的解析面板，添加一条CNAME记录并保存使其生效。回到Vercel的配置页面后，即可看到配置成功。

# 提供的API说明
- 展示一张待过码图片：`/?captcha_type=1&challenge={challenge}&gt={gt}&userid={userid}&gs=1`
  - 需传入的`challenge`, `gt`, `userid`字段的生成方式可参考[此文件](https://github.com/watermellye/AutoPCR_Archived/blob/master/query/_bili_game_sdk.py#L83)中的`StartCaptcha()`函数
- 用户过码完毕后，获取过码结果：`/api/block?userid={userid}/`或`/api/get?userid={userid}/`
  - `userid`为上述生成的字段
  - `/block`方式会阻塞请求直到用户过码完毕获得过码结果。阻塞时长最长`30`秒，超时返回504状态码。
  - `/get`方式会直接响应，若有过码结果则返回，若尚无结果则返回204状态码。
  - 使用`/block`或`/get`API时，过码结果均只会返回一次，随后删除。再次访问会返回204状态码。
  - 项目集成方式可参考[此文件](https://github.com/watermellye/HoshinoBot/blob/lei/hoshino/modules/query/_captcha_verifier.py#L97)中的`EllyeManualCaptchaVerifier()`和`EllyeManualCaptchaResultListening()`函数
