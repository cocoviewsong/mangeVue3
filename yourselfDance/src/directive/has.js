import pinia from '@/stores';
import useUserStore from '@/stores/modules/user';
const userStore = useUserStore(pinia);

export const isHasButton = (app) => {
  app.directive('has', {
    // .挂载完毕执行
    mounted(el, options) {
      console.log(userStore.buttons);
      if (!userStore.buttons.includes(options.value)) {
        el.parentNode.removeChild(el);
      }
    },
  });
};
