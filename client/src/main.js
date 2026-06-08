import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

import { createWebHistory, createRouter } from 'vue-router';

import HomePage from './pages/Home.vue';
import AboutPage from './pages/About.vue';

import GesturePage from './pages/nav1/Gesture.vue';
import LargeScreenVisualPage from './pages/nav1/LargeScreenVisual.vue';
import WaterMark from './pages/nav1/WaterMark.vue';
import Font from './pages/nav1/Font.vue';
import RafPage from './pages/nav1/Raf.vue';

import { Menu, Button } from 'ant-design-vue';

// 大文件分片上传、ffmpeg音视频录播、分片优化;
// 简历todo：npm->pnpm、eslint/prettier/husky/lint-stage、create-app-cli

let abc = 'dsds';

const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage },
  {
    path: '/nav1',
    children: [
      {
        path: 'gesture',
        component: GesturePage,
      },
      {
        path: 'largescreenvisual',
        component: LargeScreenVisualPage,
      },
      {
        path: 'watermark',
        component: WaterMark,
      },
      {
        path: 'font',
        component: Font,
      },
      {
        path: 'raf',
        component: RafPage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.component('a-menu', Menu);
app.component('a-button', Button);

app.use(router).mount('#app');
