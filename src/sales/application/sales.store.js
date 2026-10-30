import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../../shared/infrastructure/base-api.js';
export const useSalesStore = defineStore('sales', () => {
  const sales=ref([]), errors=ref([]), salesLoaded=ref(false);
  window.addEventListener('cete:session-changed',()=>{sales.value=[]; salesLoaded.value=false;});
  async function fetchSales(){try {sales.value=(await api.get('/sales')).data; salesLoaded.value=true; return sales.value;}catch(e){errors.value=[e];throw e;}}
  async function registerSale(sale){const saved=(await api.post('/sales',sale)).data; await fetchSales(); return saved;}
  async function cancelSale(id){const result=(await api.patch('/sales/'+id+'/cancel')).data; await fetchSales(); return result;}
  return {sales,errors,salesLoaded,fetchSales,registerSale,cancelSale};
});
export default useSalesStore;
