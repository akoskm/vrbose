import AppComponent from './components/App';
import IndexComponent from './components/Index';
import RegisterComponent from './components/site/Register';
import ProfileComponent from './components/Profile';
import ActivationComponent from './components/site/Activation';
import SignInComponent from './components/Signin';
import Page from './components/page/Page';

const routes = {
  path: '',
  component: AppComponent,
  childRoutes: [
    {
      path: '/',
      component: IndexComponent
    },
    {
      path: '/signup',
      component: RegisterComponent
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
      path: '/activation/:token',
      component: ActivationComponent
    },
    {
      path: '/page/:nameslug',
      component: Page
    }
  ]
};

export { routes };
