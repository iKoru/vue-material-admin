import Vue from 'vue';
import Router from 'vue-router';
import paths from './paths';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import store from '@/store';

Vue.use(Router);
const router =  new Router({
  base: '/',
  mode: 'history',
  linkActiveClass: 'active',
  routes: paths
});

// router gards
router.beforeEach((to, from, next) => {
  NProgress.start();
  
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/signin'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = store.getters.accessToken;

  if (authRequired && !loggedIn) {
    return next('/signin');
  }
  
  next();
});

router.afterEach((to, from) => {
  // ...
  NProgress.done();
});

export default router;
