import AppComponent from './components/App';
import IndexComponent from './components/Index';
import ProfileComponent from './components/Profile';
import SignInComponent from './components/Signin';
import WatchersComponent from './components/watchers/Watchers';
import WatcherComponent from './components/watchers/Watcher';

const routes = {
  path: '',
  component: AppComponent,
  childRoutes: [
    {
      path: '/',
      component: IndexComponent
    },
    {
      path: '/signin',
      component: SignInComponent
    },
    {
      path: '/profile',
      component: ProfileComponent
    },
    {
      path: '/watchers',
      component: WatchersComponent
    },
    {
      path: '/watchers/new',
      component: WatcherComponent
    }
  ]
};

export { routes };
