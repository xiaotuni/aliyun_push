export default {
  sessionSecret: 'faf7f3c8228771064d4abdd7b85ede15', // Md5(m.dev.yfarm.net)
  db: 'mongodb://Ranch:yunfarm_000@mongodb.dev.yfarm.net.cn:9011/Ranch?authSource=admin',
  mysql: { connectionLimit: 10, host: '192.168.100.25', port: '3306', user: 'yfarm', password: 'Yfarm@1234', database: 'yfarm' },
  redis: { port: 6379, host: '127.0.0.1', auth_pass: 'xiaotuni@gmail.com', },
  aliyun: {
    accessKeyId: '阿里云上的accessKeyId',
    secretAccessKey: '阿里云上的secretAccessKey',
    push: {
      version: '2016-08-01',
      format: 'JSON',
      signatureMethod: 'HMAC-SHA1',
      signatureVersion: '1.0',
      url: 'https://cloudpush.aliyuncs.com',
      apnsEnv: 'DEV',
    }
  },

};
