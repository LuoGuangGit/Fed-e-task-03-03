/**
 * 登录后不能访问的页面
 */
 export default function ({ store, redirect }) {
  if (store.state.user) {
    return redirect('/');
  }
}