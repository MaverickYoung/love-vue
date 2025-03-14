import { defineStore } from 'pinia';
import { FieryPoopIcon, LooseStoolIcon, NormalPoopIcon } from '@/assets';

export interface Poop {
  id: number;
  name: string;
  color: string;
  src: string;
}

const tmp: Poop[] = [
  {
    id: 1,
    color: '#7A4420',
    name: '健康便便',
    src: NormalPoopIcon,
  },
  {
    id: 2,
    color: '#d60808',
    name: '火辣便便',
    src: FieryPoopIcon,
  },
  {
    id: 3,
    color: '#66a3ff',
    name: '水样便便',
    src: LooseStoolIcon,
  },
];

export const usePoopStore = defineStore('poopStore', {
  state: () => ({
    poops: new Map<number, Poop>(),
  }),
  getters: {
    getPoop(state) {
      return (id: number | undefined): Poop | undefined => {
        return id ? state.poops.get(id) : undefined;
      };
    },
  },
  actions: {
    async getPoopsAction() {
      // const {data} = await usePoopsApi()
      // this.poops = data
      tmp.forEach((poop) => this.poops.set(poop.id, poop));
    },
  },
});
