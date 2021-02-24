export default {
  sessionSecret: 'e732bfde03c4441940ce9aa962033dd5', //
  db: '',
  mysql: { connectionLimit: 10, host: '127.0.0.1', port: '3306', user: 'user', password: 'pwd@1234', database: 'test' },
  redis: { port: 6379, host: '127.0.0.1', auth_pass: 'xiaotuni@gmail.com', },
  aliyun: {
    accessKeyId: '阿里云上的accessKeyId',
    secretAccessKey: '阿里云上的secretAccessKey',
    push: {
      version: '2016-08-01',
      format: 'JSON',
      signatureMethod:'HMAC-SHA1',
      signatureVersion:'1.0',
      apnsEnv: 'DEV',
    }
  },
};