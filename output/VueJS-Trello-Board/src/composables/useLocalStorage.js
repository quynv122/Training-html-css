import { ref, watch } from 'vue'

export function useLocalStorage(key, initialValue = {}) {
  const data = ref(initialValue)

  const saved = localStorage.getItem(key)
  if (saved) data.value = JSON.parse(saved)

  
  watch(
    data,
    (val) => {
      localStorage.setItem(key, JSON.stringify(val))
    },
    { deep: true }
  )

  return data   
}
