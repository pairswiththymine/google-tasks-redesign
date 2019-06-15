/* eslint-disable no-undef */
// gapi defined in html
// all other files should not have to access gapi directly

const SCOPE = ['https://www.googleapis.com/auth/tasks']

export default {
  init() {
    gapi.client.load("tasks")
  },

  auth() {
    return gapi.auth.authorize({ client_id: process.env.VUE_APP_CLIENT_ID, scope: SCOPE })
  }
}