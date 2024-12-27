export default {
methods: {
loadScript(url) {
return new Promise((resolve, reject) => {
const script = document.createElement('script');
script.type = 'text/javascript';
script.src = url;

// 脚本加载完成
script.onload = () => {
console.log(`Script loaded: ${url}`);
resolve();
};

// 脚本加载失败
script.onerror = () => {
console.error(`Failed to load script: ${url}`);
reject(new Error(`Failed to load script: ${url}`));
};

document.head.appendChild(script);
});
}
},
mounted() {
// 在组件挂载时动态加载 JavaScript 文件
this.loadScript('https://example.com/some-library.js')
.then(() => {
console.log('Library ready to use!');
})
.catch((error) => {
console.error(error);
});
}
};