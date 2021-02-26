/* 
这是一个koa 的简单模板
package.js
 "dependencies": {
    "koa": "^2.11.0",
    "koa-bodyparser": "^4.2.1",
    "koa-router": "^7.4.0",
    "koa-static": "^5.0.0"
  },
*/

const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

app.use(require('koa-static')(path.join(__dirname, 'static')));
// app.use(require('koa-static')(__dirname + '/static'))
// app.use(require('koa-static')('./static'))
// app.use(require('koa-static')('static'))

//全局配置，所有的接口都会先进来
app.use(async (ctx, next)=> {
  // ctx.body = 'Hello World';
  console.log('先到我这来');

  await next();
});


/* 
 axios.get('/getUser', {params: {id:'111'}})
 axios.get('/getUser?id=111')
*/
router.get('/getUser', async ctx => {
  //请求的url ：    localhost:3000/getUser?id=222
  console.log(ctx.request.query); //[Object: null prototype] { id: '111' }
  console.log(ctx.request.query.id); //获取get url 上的参数的 111
  ctx.body= user;
})

/* 
 axios.get('/getUser/111')
*/
router.get('/getUser/:id', async ctx => {
  console.log(ctx.params.id); //获取restful风格接口
  ctx.body= user;
})

/* 
 axios.post('/getUser'，{name：'aaaa'})
*/
router.post('/getUser', async ctx => {
  console.log(ctx.request.body);
  ctx.body= user;
})


/* 
axios.put('/getUser'，{name：'aaaa'})
*/
router.put('/getUser', async ctx => {
  console.log(ctx.request.body);
  ctx.body= user;
})

/* 
axios.put('/getUser/111')
*/
router.put('/getUser/:id', async ctx => {
  console.log(ctx.params.id);
  ctx.body= user;
})


/* 
axios.delete('/getUser/111')
*/
router.delete('/getUser/:id', async ctx => {
  console.log(ctx.params.id);
  ctx.body= user;
})


/* 
 axios.delete('/getUser', {params: {id:'111'}})
 axios.delete('/getUser?id=111')
*/
router.delete('/getUser', async ctx => {
  console.log(ctx.request.query);
  ctx.body= user;
})




app.use(router.routes()).use(router.allowedMethods())
// 以上为官方推荐方式，allowedMethods用在routes之后，作用是根据ctx.status设置response header.

app.listen(3000);

/* 
总结：

url?id=1&name=aaa
使用：ctx.request.query

url/111
使用：ctx.params.id

在http：body 中的
使用 ctx.request.body

get：查
post：增
put： 改
delete：删
*/