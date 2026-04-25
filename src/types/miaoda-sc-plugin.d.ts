declare module 'miaoda-sc-plugin' {
  import { Plugin } from 'vite';
  const plugin: () => Plugin;
  export default plugin;
}