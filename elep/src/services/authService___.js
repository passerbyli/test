export async function login(username, password, role) {
  return await window.authApi.login({ username, password, role })
}

export async function changeRole(role) {
  return await window.authApi.changeRole({ role })
}

export async function logout() {
  return await window.authApi.logout()
}
