import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

type RefreshType = {
    action:'update',
    id:any
    path:string,
    value:any
}| {
    action:'delete'|'add',
    id:any
}
/**
 * 该store用于判断是否需要更新当前页面，作为flag
 */
export const useRefreshStore = defineStore('refresh', () => {
    const userAddress = ref(false)
    const loginVisible = ref(false)
    const rightsLoaded = ref(false)

    const asset = ref(false)//更新个人资产

    const thread = reactive<{
        recommend:RefreshType[]
        official:RefreshType[]
        new:RefreshType[]
    }>({
        recommend:[],
        official:[],
        new:[]
    })
    const favor = reactive({
        remind:true,
        plan:true,
        topic:true
    })

    return {
        userAddress,
        loginVisible,
        rightsLoaded,
        asset,
        thread,
        addThread(data:RefreshType,channel?:string){
            if(!channel||channel=='recommend') {
                thread.recommend.push(data)
            }
            if(!channel||channel=='official') {
                thread.official.push(data)
            }
            if(!channel||channel=='new') {
                thread.new.push(data)
            }

        },
        favor
    }
})
