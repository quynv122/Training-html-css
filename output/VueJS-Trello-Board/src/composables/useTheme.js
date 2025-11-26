import { ref, onMounted } from 'vue'

export function useTheme() {
  const theme = ref('light')
  const applyTheme = (newTheme) => {
    const html = document.documentElement
    if (newTheme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    localStorage.setItem('user-theme', newTheme)
    theme.value = newTheme
  }

  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light'
    applyTheme(newTheme)
  }


  onMounted(() => {
    const savedTheme = localStorage.getItem('user-theme')
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (savedTheme) {
      applyTheme(savedTheme)
    } else if (systemDark) {
      applyTheme('dark')
    } else {
      applyTheme('light')
    }
  })

  return { theme, toggleTheme }
}