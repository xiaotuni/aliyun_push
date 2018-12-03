import functional from './cfg.functional';
import development from './cfg.development';
import production from './cfg.production';
import preview from './cfg.preview';

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT;
const cfg = {
  functional, development, production, preview
}[env];
cfg.env = env;

console.log('current env :', env, ' port:', port);
export default cfg;
