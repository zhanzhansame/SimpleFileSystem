var Express = require('express');
var App = Express();
var Path = require('path');
var Formidable = require('formidable');
var FS = require('fs');
 
App.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});
 
App.post('/upload', function(req, res){     // 创建一个表单对象
    var form = new Formidable.IncomingForm();
    //  开启该功能，当调用form.parse()方法时，回调函数的files参数将会是一个file数组，数组每一个成员是一个File对象，此功能需要html5中multiple特性支持
    form.multiples = true;
    // 设置当前上传的文件存储到,当前文件的/uploads文件夹下
    form.uploadDir = Path.join(__dirname, '/uploads');
    var dirUrl
    // 监听上传的文件数据
    form.on('file', function(field, file) {
        var newName = file.name;
        // 重命名
        FS.rename(file.path, Path.join(form.uploadDir,newName),function(err) {
            if(err){
                throw err;
            }
        });
        // 得到当前上传文件的存储路径
        dirUrl = Path.join(form.uploadDir,newName)
    });
    // 监听报错
    form.on('error', function(err) {
        console.log('An error: \n' + err);
    });
    // 当接受数据完成时,将当前上传的文件的目录返回给前台
    form.on('end', function() {
        res.send(dirUrl);
    });
    // 解析请求中携带的数据
    form.parse(req);
  });
 
  // 启动服务设置端口
  var server = App.listen(3000, function(){
      console.log('Files Server listening on port 3000');
  })