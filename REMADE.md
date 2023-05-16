### 项目结构

项目有后端源码和接口文档，我只会前端所以主要看前端部分。

easybbs是项目的前端部分，其中又分为easybbs-web访客端和easy-admin管理端。

![](C:\Users\admin\AppData\Roaming\Typora\typora-user-images\image-20230516112301464.png)

* file主要用来存一些图片和附件
* `easybbs.sql`是数据库文件
* `easybbs-admin-release-1.0.jar`是管理端的jar文件，可以在命令行执行，也可以点击`start_admin.bat`文件执行
* `easybbs-web-release-1.0.jar`是访客端的jar文件，可以在命令行执行，也可以点击`start_web.bat`文件执行
* `application.properties`是后端配置文件，具体配置请看http://easybbs.wuhancoder.com/post/ReP7eDxvGflLmG2

### 项目运行

#### 访客端

进入`easybbs-web`目录

下载依赖包`npm install`

运行`npm run dev`

#### 管理端

进入`easybbs-admin`目录

下载依赖包`npm install`

运行`npm run dev`