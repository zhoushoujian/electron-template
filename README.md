# electron-template

## 诞生背景

本仓库诞生的目的是解决从web网站搬到到电脑应用程序的问题,可打包windows,mac和linux,且操作简单

## 操作说明

1. 把package.json和main.js里面的electron-template全部替换成你需要的名字,把public目录下的图标全部换成你的图标,注意图片格式

2. 安装依赖环境: ```npm --registry https://registry.npm.taobao.org install```  
如果遇到安装失败或者打包后闪退的问题,请重新安装electron  

3. 把你需要打包的网站静态文件放到public目录下,网站静态文件的入口是index.html,一定要覆盖public目录下原来的index.html文件

4. 不建议使用网络加载的模式引入应用程序内容,如果非要通过url加载内容,需要在main.js里将```mainWindow.loadURL(`file://${__dirname}/public/index.html`);```替换成```mainWindow.loadURL("put your url here");```.
注意:如果对方没有网络,那么你的应用程序打开就会白屏

5. 打包,不同平台的包只能去不同平台去打包,比如打mac版本的包,需要在mac电脑上打包,打linux包需要在linux系统上打包,但linux的包同时使用ubuntu和redHat两个linux分支版本  
打包号后的文件在当前目录的out文件夹下  

```windows```

```shell
npm run dist:win
```

```mac```  

```shell
npm run dist:mac
```

```linux```  

```shell

npm run dist:linux
```

## electron应用案例

[Visual Studio Code](https://www.electronjs.org/apps/visual-studio-code)  
[postman](https://www.electronjs.org/apps/postman)  
[GitHub Desktop](https://www.electronjs.org/apps/github-desktop)  
[GitBook](https://www.electronjs.org/apps/gitbook)
[MongoDB Compass](https://www.electronjs.org/apps/mongodb-compass)  
[Atom](https://www.electronjs.org/apps/atom)  
[更多案例](https://www.electronjs.org/apps)

## electron官网

[https://www.electronjs.org/](https://www.electronjs.org/)

## License

[MIT](./LICENSE)
