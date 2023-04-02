const http = require('http')
const fs = require('fs')
const formidable = require('formidable')
const path = require('path')
let result = null

/**
 * 创建服务器
 */
const server = http.createServer((req, res) => {
  const { method, url } = req
  result = res
  if (method === 'POST' && url === '/upload') {
    // 创建表单解析对象
    const form = formidable({ multiples: false })
    //console.log(form)
    /**
     * 解析表单
     * req 请求信息
     * err 解析报错信息
     * fields string字段属性集合 例：{name: '', type: ''} 字段为自定义的，必须要前端发起请求的字段一致
     * files file文件属性集合 例：{file: File, doc: File} 字段为自定义的，必须要前端发起请求的字段一致
     */
    form.parse(req, (err, fields, files) => {
      if (err) {
        responseEnd(err)
      }
      const file = files.f1
      //console.log(file)
      saveFile(file)
    })
  }
})

/**
 * 监听端口
 */
server.listen(3000, () => {
  console.log('http server running at port: 3000')
})

/**
 * 保存文件
 */
function saveFile(file) {
  // 读文件
  fs.readFile(file.filepath, (err, data) => {   //为什么file里的path拿不到  file.path
    if (err) {
      responseEnd(err)
    }
    const basePath = '../public/files'
    // 创建目录
    createDir(basePath)
    // 写入文件
    fs.writeFile(path.join(basePath, file.originalFilename), data, async (err) => {
      if (err) {
        responseEnd(err)
      }
      responseEnd()
    })
  })
}

/**
 * 判断目录是否存在，不存在则创建
 * { recursive: true } 表示多层目录时递归创建
 */
function createDir(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  }
}

/**
 * 服务器响应
 */
function responseEnd(err) {
  if (err) {
    console.log(err)
    result.statusCode = 500
    result.end('fail')
  } else {
    result.statusCode = 200
    result.end('success')
  }
}