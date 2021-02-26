const path = require('path');
const Koa = require('koa');
// const router = require('koa-router')();
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');


const app = new Koa();
const router = new Router();

app.use(bodyParser());

// 静态资源配置
// app.use(require('koa-static')('static'))

// or
// app.use(require('koa-static')('./static'))

// or
// app.use(require('koa-static')(__dirname + '/static'))

// or 使用path.join() 的时候，static前面的/可加可不加，该方法会内部会做处理
app.use(require('koa-static')(path.join(__dirname, 'static')));

/* 
  全局过滤器
*/
app.use(async (ctx, next)=> {
  // ctx.body = 'Hello World';
  // console.log(ctx);
  // ctx.set('Accept','application/json');
  // ctx.set('Content-Type','application/json');
  console.log('先到我这来');
  await next();                //从这来去执行下面的一系列，执行完了在返回到这里，相当于切面
  console.log('最后到我这');
});


const user ={
  name:'ljh',
  age:26
}

router.get('/getUser', async ctx => {
  //请求的url ：    localhost:3000/getUser?id=222
  console.log(ctx.request.query); //[Object: null prototype] { id: '222' }
  console.log(ctx.request.querystring); //id=222 字符串
  console.log(ctx.request.query.id); //获取get url 上的参数的
  ctx.body= user;
})


router.get('/getUser/:id', async ctx => {
   //请求的url ：    http://localhost:3000/getUser/333
  console.log(ctx.request.query); //[Object: null prototype] {}， url上没有参数
  console.log(ctx.params.id); //333 通过restful风格获取参数
  ctx.body= user;
})

router.post('/getUser', async ctx => {
  //请求的url ：    http://localhost:3000/getUser  post请求
  console.log(ctx.request.body);
  ctx.body= user;
})

router.post('/getUser/row', async ctx => {
  //请求的url ：    http://localhost:3000/getUser/row
  //console.log(ctx.request); //undefined
 console.log(ctx.request.body); //{ firstName: 'Fred', lastName: 'Flintstone' }
 ctx.body= user;
})


router.put('/getUser', async ctx => {
  //请求的url ：    http://localhost:3000/getUser  post请求
  console.log(ctx.request.body);
  ctx.body= user;
})
router.put('/getUser/:id', async ctx => {
  //请求的url ：    http://localhost:3000/getUser  post请求
  console.log(ctx.params.id);
  console.log(ctx.request.body);
  ctx.body= user;
})

router.delete('/getUser/:id', async ctx => {
  //请求的url ：    http://localhost:3000/getUser  post请求
  console.log(ctx.params.id);
  ctx.body= user;
})

router.delete('/getUser', async ctx => {
  //请求的url ：    http://localhost:3000/getUser  post请求
  console.log(ctx.request.query);  //[Object: null prototype] { name: 'ljh' }
  console.log(ctx.request.query.name);
  console.log(ctx.request.body);  //{id:'1111'}
  ctx.body= user;
})


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



// router
//   .get('/api/apples',async(ctx,next) => {
//     let data = await Sql.queryAll(tbName,ctx.request.query);
//     ctx.body = data;
//   })
//   .get('/api/apples/:id',async(ctx,next) => {
//     let data = await Sql.query(tbName,ctx.params.id);
//     ctx.body = data;
//   })
 
//   .post('/api/apples',async(ctx,next) => {
//     let data = await Sql.insert(tbName,ctx.request.body);
//     ctx.body = data;
//   })
//   .post('/api/apples/rows',async(ctx,next) => {
//     let data = await Sql.insertRows(tbName,ctx.request.body);
//     ctx.body = data;
//   })
 
//   .put('/api/apples/:id',async(ctx,next) => {
//     let data = await Sql.update(tbName,ctx.params.id,ctx.request.body);
//     ctx.body = data;
//   })
//   .put('/api/apples',async(ctx,next) => {
//     console.log(ctx.request.body);
//     let data = await Sql.updateRows(tbName,ctx.request.body);
//     ctx.body = data;
//   })
 
//   .del('/api/apples/:id',async(ctx,next) => {
//     let data = await Sql.delete(tbName,ctx.params.id);
//     ctx.body = data;
//   })
  // .del('/api/apples',async(ctx,next) => {
  //   let data = await Sql.deleteRows(tbName,ctx.request.body);
  //   ctx.body = data;
  // })





// app.use(async (ctx, next)=> {
//   ctx.body = 'Hello World';
//   console.log(ctx);
//   await next();
// });

app.use(router.routes()).use(router.allowedMethods())
// 以上为官方推荐方式，allowedMethods用在routes之后，作用是根据ctx.status设置response header.

app.listen(3000);