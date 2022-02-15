/*
 * @Descripttion: 
 * @version: 
 * @Author: 曾利锋[阿牛]
 * @Date: 2022-01-02 14:18:17
 * @LastEditors: 曾利锋[阿牛]
 * @LastEditTime: 2022-02-15 16:19:06
 */
// 生命周期执行顺序
// initializing -- 初始化方法（检查状态、获取配置等）
// prompting -- 获取用户交互数据（this.prompt()）
// configuring -- 编辑和配置项目的配置文件
// default -- 如果generator内部还有不符合任意一个任务队列任务名的方法，将会被放在default这个任务下进行运行
// writing -- 填充预置模板
// conflicts -- 处理冲突（仅限内部使用）
// install -- 进行依赖的安装（eg：npm，bower）
// end -- 最后调用，做一些clean工作

const Generator = require("yeoman-generator");
const yosay = require('yosay');
// const download = require("download-git-repo"); //获取git 仓库地址
const path = require('path');
const fs = require('fs');
const shell = require('shelljs');
module.exports = class extends Generator {
    initializing() {
        // 打印欢迎语
        this.log(
            yosay(`Welcome to the shining  generator!`)
        )
    }
    //命令行
    prompting(){
       return this.prompt([ 
            {
                type:"input",
                name:"name",
                message:"请输入创建项目名称",
                default:this.appname,
            },
            {
                type:"list",
                name:"apply",
                message:"请选择应用类型", 
                default:"",
                choices:['PC','H5','MPAPP','APP']
            },
            {
                type:"list",
                name:"subapply",
                message:"请选择子应用类型", 
                choices:(name) => {   
                    return this._subApply(name.apply)
                },
            }
        ]).then(aws=>{ 
            this.aws = aws  
        })
    }
    //编辑和配置项目的配置文件
    configuring(){

    }
    //如果generator内部还有不符合任意一个任务队列任务名的方法，将会被放在default这个任务下进行运行
    default () {  
        const objUrl = path.resolve() + "/" + this.aws.name // 创建项目目录的当前路径
        console.log('objUrl',objUrl)
        // 判断当前的目录是否存在，如果存在，提示当前用户的
        this.getStat(objUrl).then(res=>{
            console.log("aniu",res)
            let gitUrl = this._gitUrl(this.aws.subapply) 
            let objName = this.aws.name  
            if(shell.exec(`cd ${path.resolve()} && git clone ${gitUrl} ${objName} && cd ${objName} && npm i`).code == 0){
                console.log("已完成")
            }else{
                console.log("未完成")
            }

            //处理项目业务逻辑 
           
            // this.download(gitUrl,objUrl).then(res=>{
            //     console.log("已完成")
            // }).catch(err=>{
            //     console.log("err")
            // }) 
        }).catch(err=>{
            console.log(this.aws.name + "已存在")  
        })  
    }

    writing() {
        console.log("writing")
        //创建文件和脚本
        // this.fs.write(
        //     this.destinationPath('temp.txt'),
        //     Math.random.toString()
        // )
        // const templ = this.templatePath('./index.html');
        // const output = this.destinationPath('index.html');
        // const context = this.aws
        // this.fs.copyTpl(templ,output,context)
    }
    //处理冲突（仅限内部使用）
    conflicts () {

    }
    //进行依赖的安装（eg：npm，bower）
    install () {
        console.log("install")
        // Generator.npmInstall() 
    }
    //最后调用，做一些clean工作
    end () {
        console.log("end")
        this.log("end")
    }
    /**
   * 读取路径信息
   * @param {string} filepath 路径
   */
    getStat(filepath) {
        if(!filepath){
            return
        } 
        return new Promise((resolve, reject) => {  
         if(!fs.existsSync(filepath)){
          resolve(true) 
         }else{
            reject(false)
         }   
        }) 
  }
  /**
   * 
   * @param {*} giturl git 仓库地址
   * @param {*} filepath 当前项目路径
   * @returns 
   */
//   download (giturl,filepath) {
//     return new Promise((resolve, reject) => {
//         download("direct:"+giturl,filepath,{ clone: true },function (err) {
//             console.log("download",err)
//             err ? reject("下载失败") : resolve()
//         })
//     }) 
//   }

  // 用户选择哪些模式进行处理
  /**
   * 
   * @param {*} gitUrl git URL 
   * @param {*} filePath object URL
   * @returns 
   */
//   projectSelect(subapply,filePath){ 
//     let gitUrl = this._gitUrl(subapply)
//     return this.download(gitUrl,filePath)
//   }

  //获取子应用类型展示
  _subApply (name) {
      console.log(this.aws)
      const objname = name || this.aws.apply
      const obj = {
          'PC':['adminLayout'],
          'H5':['cci','zlb'],
          'MPAPP':['wx','alipay'],
          'APP':[]
      }
      return obj[objname]
  }
   
  // 自应用模版对应的git仓库地址 
  _gitUrl (name) { 
      const obj = {
          'adminLayout':'ssh://git@git.citycloud.com.cn:3022/yueqing/park-mph5.git',
          'cci':'ssh://git@git.citycloud.com.cn:3022/yueqing/park-mph5.git',
          'zlb':'ssh://git@git.citycloud.com.cn:3022/yueqing/park-mph5.git',
          'wx':'ssh://git@git.citycloud.com.cn:3022/yueqing/park-mph5.git',
          'alipay':'ssh://git@git.citycloud.com.cn:3022/yueqing/park-mph5.git'
      }
      return obj[name]
  }


}