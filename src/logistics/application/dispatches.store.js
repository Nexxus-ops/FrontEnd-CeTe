import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../../shared/infrastructure/base-api.js';
export const useDispatchesStore=defineStore('dispatches',()=>{
  const dispatches=ref([]),errors=ref([]),dispatchesLoaded=ref(false);
  window.addEventListener('cete:session-changed',()=>{dispatches.value=[];dispatchesLoaded.value=false;});
  async function fetchDispatches(){try{dispatches.value=(await api.get('/dispatches')).data;dispatchesLoaded.value=true;return dispatches.value;}catch(e){errors.value=[e];throw e;}}
  async function createDispatch(payload){const result=(await api.post('/dispatches',payload)).data;await fetchDispatches();return result;}
  async function updateDispatchStatus(id,status){await api.put('/dispatches/'+id,{status});await fetchDispatches();}
  return {dispatches,errors,dispatchesLoaded,fetchDispatches,createDispatch,updateDispatchStatus};
});
export default useDispatchesStore;
