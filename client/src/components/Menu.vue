<template>
    <div :style="{ display: hideMenu ? 'none' : 'block'}" style="width: 250px; height: 100vh; background: rgb(0 12 22);">
      <!-- <a-button type="primary" style="margin-bottom: 16px" @click="toggleCollapsed">
        <MenuUnfoldOutlined v-if="state.collapsed" />
        <MenuFoldOutlined v-else />
      </a-button> -->
      <a-menu
        v-model:openKeys="state.openKeys"
        v-model:selectedKeys="state.selectedKeys"
        mode="inline"
        theme="dark"
        @click="clickMenu"
        :inline-collapsed="state.collapsed"
        :items="items"
      ></a-menu>
    </div>
</template>

<script setup>
import { reactive, watch, h, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
  AppstoreOutlined,
} from '@ant-design/icons-vue';

  const router = useRouter();
  const route = useRoute();
  const hideMenu = ref(false);
  const state = reactive({
    collapsed: false,
    selectedKeys: ['1'],
    openKeys: ['sub1'],
    preOpenKeys: ['sub1'],
  });
  const items = reactive([
    {
      key: '1',
      icon: () => h(PieChartOutlined),
      label: 'Option 1',
      title: 'Option 1',
    },
    {
      key: '2',
      icon: () => h(DesktopOutlined),
      label: 'Option 2',
      title: 'Option 2',
    },
    {
      key: 'sub1',
      icon: () => h(MailOutlined),
      label: 'Navigation One',
      title: 'Navigation One',
      children: [
        {
          key: '/nav1/gesture',
          label: '手势密码',
          title: '手势密码',
          hideMenu: true
        },
        {
          key: '/nav1/largescreenvisual',
          label: '大屏可视化',
          title: '大屏可视化',
          hideMenu: true
        },
        {
          key: '/nav1/watermark',
          label: '水印',
          title: '水印',
          // hideMenu: true
        },
        {
          key: '/nav1/font',
          label: '字体',
          title: '字体',
        },
        {
          key: '/nav1/raf',
          label: 'raf分片优化',
          title: 'raf分片优化',
        },
      ],
    },
    {
      key: 'sub2',
      icon: () => h(AppstoreOutlined),
      label: 'Navigation Two',
      title: 'Navigation Two',
      children: [
        {
          key: '9',
          label: 'Option 9',
          title: 'Option 9',
        },
        {
          key: 'sub3',
          label: 'Submenu',
          title: 'Submenu',
          children: [
            {
              key: '11',
              label: 'Option 11',
              title: 'Option 11',
            },
          ],
        },
      ],
    },
  ]);
  
  const toggleCollapsed = () => {
    state.collapsed = !state.collapsed;
    state.openKeys = state.collapsed ? [] : state.preOpenKeys;
  };

  const clickMenu = ({ item, key, keyPath }) => {
    console.log(item, key);
    if (item.hideMenu) {
      // window.open(`${window.location.host}${key}?hideMenu=true`, '_blank')
      router.push(`${key}?hideMenu=true`);
    } else {
      router.push(key);
    }
  }

  onMounted(() => {
    // console.log(router.currentRoute.value)
    // const pathname = window.location.pathname;
    // state.selectedKeys = [pathname];
  })

  watch(
    [ () => route.path, () => route.query.hideMenu, () => state.openKeys ],
    [ (_val, oldVal) => {
        state.selectedKeys = [_val[0]];
      },
      (_val, oldVal) => {
        hideMenu.value = _val[1] === 'true' ? true : false;
      },
      (_val, oldVal) => {
        state.preOpenKeys = oldVal;
      }
    ]
  );
  </script>