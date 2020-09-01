:<<EOF
    本项目自动打包部署的shell脚本，
    # 依赖: 
      1). mac系统，win系统还没测...
      2). ssh 公钥免密登录，具体步骤如下：
          1. 检查本地 [~/.ssh] 文件夹下面是否有id_rsa(私钥) 和 id_rsa.pub(公钥)两个文件，如果有执行第三步，没有执行第二步
          2. 本地生成ssh秘钥 [ssh-keygen -C "victor@qq.com"]   -C是添加注释信息，一般是个人的邮箱，就会在本地的~/.ssh目录下生成以上两个文件，会提示输入两次密码，这个密码是ssh 的密码，可以不输入直接回车
          3. 将自己的id_rsa.pub 公钥上传到服务器[ssh-copy-id -i .ssh/id_rsa.pub root@101.132.109.40] , 有时候(ssh需要输入密码的时候)可能需要在ssh-copy-id之前执行[eval "$(ssh-agent -s)"]
          4. 测试: 通过[ssh root@服务器ip]  测试是否能连上服务器，没有密码的话直接就连上了；，如果有shh密码，需要输入
    # 配置 
      1). 只需要给第一个shell变量[local_project_port]，往数组中添加新的项目就可以了，不需要部署就删掉 格式 "项目名:端口号" 相邻项目用空格割开(shell数组语法)
      2). 服务器发生变化，请修改[server_name] 变量
      3). 服务器部署路径变化修改[server_deploy_root]变量
EOF

# 所有要部署的项目名称
local_project_port=("sys-analysor:3001" "sys-dashboard:3002" "sys-plans-man:3003" "sys-report-form:3004")

# 本地build后的文件包名，本项目统一都是都是在build下
local_build_root=build

# 服务器名称
server_name=root@192.168.1.224

# 服务器部署目录
server_deploy_root=/home/hadoop/front-end-show

#打包上传函数

buildScp(){
# 生成ecosystem.config.js文件的前缀
echo "" > ecosystem.config.js
echo 'module.exports = {
  apps: ['>> ecosystem.config.js
# 根据要打包的文件循环，主要做两件事，1.打包后上传到服务器，2.往ecosystem.config.js添加启动信息
    for project in ${local_project_port[@]}
    do
        # 遍历的信息，根据冒号:分割,0是项目名称，1是端口号
        arr_temp=(${project//:/ })
        p_name=${arr_temp[0]}
        p_port=${arr_temp[1]}
        echo ">>------即将执行:p_name:${p_name}--p_port:${p_port}------"
        # 键入本地项目内部
        cd ${p_name} &&
        echo ">>------开始build:${p_name}项目------"
        # 执行build打包操作
        yarn build &&
        echo ">>------项目:${p_name}打包完成------"
        # 新建一个临时文件夹，是为了将整个文件夹传到服务器，省去了压缩在mv移动的过程
        mkdir ${p_name} &&
        echo ">>------创建临时文件夹${p_name}文件夹成功------"
        # 将本地build 的包内容copy到新的临时文件夹
        cp -r ${local_build_root}/* ${p_name} &&
        echo ">>------复制build文件成功------"
        echo ">>------${p_name} 开始上传......------"
        # 将临时文件夹上传到服务器
        scp -r ${p_name} ${server_name}:${server_deploy_root} &&
        echo ">>------${p_name} 上传完成------"
        # 本地移除临时文件夹
        rm -rf ${p_name}
        # 本地移除build文件夹, 为了减少手动移除的尴尬，这里直接移除了，也可以不移除
        rm -rf ${local_build_root}
        echo ">>------删除临时文件夹------"
        # 返回到根目录， 准备开始下一个项目的打包
        cd .. 
        echo ">>------即将:写入pm2 文件------"

        # 下面操作是给ecosystem.config.js添加启动信息 ##################
        echo '    {
            name: "'${arr_temp[0]}-${arr_temp[1]}'",
            script: "serve",
            watch: true, 
            env: {
                "PM2_SERVE_PATH": "./'${arr_temp[0]}'",
                "PM2_SERVE_PORT": '${arr_temp[1]}'
            }
        },'>> ecosystem.config.js 
        echo ">>------完成:写入pm2 文件------"
    done
# 对应for循环的上面，给ecosystem.config.js添加结束后缀   
echo '  ]
};'>> ecosystem.config.js
}

# 第一步 执行 yarn setup 目的类似于  yarn install
yarn setup 
echo "yarn setup  执行完成" && 

# 第二部 核心内容
buildScp &&

echo "全部上传成功"

# 第三部，将pm2启动文件上传到服务器，
scp -r ecosystem.config.js ${server_name}:${server_deploy_root} 

# 远程执行 pm2启动文件
ssh ${server_name} "cd ${server_deploy_root}; pm2 start ecosystem.config.js"

# 删除本地临时的pm2启动文件， 远程的pm2启动文件还在，要删除的话就在ssh语句后面添加
rm -f ecosystem.config.js
