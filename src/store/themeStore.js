import { defineStore } from 'pinia';

const PRESET_THEMES = [{
    id: 'dark',
    name: '默认1',
    color: '#313131',
    hlColor: '#28c83f',
    dark: true
}, {
    id: 'white',
    name: '默认2',
    color: '#fafafa',
    hlColor: '#28c83f',
    dark: false
}, {
    id: 'light',
    name: '浅色',
    color: '#e7e1e3',
    hlColor: '#979193',
    dark: false
}, {
    id: 'pink',
    name: '粉色1',
    color: '#e667af',
    hlColor: '#e667af',
    dark: false
}]

export const useThemeStore = defineStore('themes', {
    state: ()=> ({
        customThemes: []
    }),
    getters: {

    },
    actions: {
        getTheme(type, index) {
            index = index > 0 ? index : 0
            const allThemes = [ PRESET_THEMES, this.customThemes ]
            return allThemes[type][index]
        },
        getPresetThemes() {
            return PRESET_THEMES
        }
    }
})