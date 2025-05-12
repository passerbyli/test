// defaultForm.js（可独立一个文件）
export const defaultForm = {
  global: {
    isLogin: false,
    theme: 'light',
    language: 'zh_CN',
    notify: { disable: false },
  },
  modules: {
    module2: {
      cronJobs: {
        cronJob1: '',
        cronJob2: '',
      },
      type: 'PI',
    },
    module3: {
      accounts: {
        beta: { username: '', password: '', cookies: [] },
        pord: { username: '', password: '', cookies: [] },
      },
      currentEnv: 'beta',
    },
  },
}
