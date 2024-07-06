import { ref } from 'vue';
export const isLoginVisible = ref(false);//登陆组件显示

export const isLoading = ref(true);//登陆组件显示

export function ms2MMSS(ms: number) {
    const s = ms / 1000;
    const floor_s = Math.floor(s);

    const min = Math.floor(floor_s / 60);
    const second = floor_s % 60;

    const minStr = min < 10 ? '0' + min : min.toString();
    const secondStr = second < 10 ? '0' + second : second.toString();

    return `${minStr}:${secondStr}`;
}