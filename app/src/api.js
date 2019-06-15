/* eslint-disable no-undef */
// gapi defined in html
// all other files should not have to access gapi directly

const SCOPE = ['https://www.googleapis.com/auth/tasks']

const api = {
  init() {
    return gapi.client.load("tasks")
  },

  auth() {
    return gapi.auth.authorize({ client_id: process.env.VUE_APP_CLIENT_ID, scope: SCOPE })
  },

  authed() {
    return gapi.auth.getToken() && gapi.auth.getToken().status.signed_in
  },

  getTaskLists() {
    return new Promise((res, rej) => {
      gapi.client.tasks.tasklists.list().execute(responce => {
        if(responce.error) rej(responce.error)
        else res(responce.result)
      })
    })
  },

  getTasks(key) {
    return new Promise((res, rej) => {
      gapi.client.tasks.tasks.list({ tasklist: key }).execute(responce => {
        if(responce.error) rej(responce.error)
        else res(responce.result)
      })
    })
  }
}

window.api = api

export default api