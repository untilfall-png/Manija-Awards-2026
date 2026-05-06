import re

path = '/Kimi/Manija Awards 2026/components/Voting.tsx'
with open(path, 'r') as f:
    content = f.read()

# Agregar onSnapshot al import de firebase
content = content.replace(
    \"import { motion } from 'framer-motion'\",
    \"import { motion } from 'framer-motion'\\nimport { doc, onSnapshot, serverTimestamp } from 'firebase/firestore'\"
)

# Reemplazar el useEffect con listener en tiempo real
old_useEffect = r'''  useEffect\(\) \{
    let mounted = true

    getCategories\(\)\s+\.then\(\(fetched\) => \{
      if \(!mounted\) return
      setCategories\(fetched\)
    \}\)
    \.catch\(\(err\) => \{
      console\.error\('Error loading categories:', err\)
      setCategoryError\('No se pudieron cargar las categorías'\)
    \}\)
    \.finally\(\(\) => \{
      if \(mounted\) setLoadingCategories\(false\)
    \}\)

    getSystemConfig\(\)\s+\.then\(\(config\) => \{
      if \(!mounted\) return
      setVotingDisabled\(!config\?\.votingEnabled\)
    \}\)
    \.catch\(\(err\) => \{
      console\.error\('Error loading system config:', err\)
    \}\)

    return \(\) => \{
      mounted = false
    \}
  \}, \[]\)'''

new_useEffect = '''  useEffect(() => {
    let mounted = true

    getCategories()
      .then((fetched) => {
        if (!mounted) return
        setCategories(fetched)
      })
      .catch((err) => {
        console.error('Error loading categories:', err)
        setCategoryError('No se pudieron cargar las categorías')
      })
      .finally(() => {
        if (mounted) setLoadingCategories(false)
      })

    // Escuchar cambios en tiempo real del estado de votación
    const configRef = doc(db, 'system_config', 'system_config')
    const unsubscribe = onSnapshot(configRef, (docSnap) => {
      if (!mounted) return
      if (docSnap.exists()) {
        const data = docSnap.data()
        setVotingDisabled(!data.votingEnabled)
      } else {
        // Si no existe, crear con votación habilitada
        setDoc(configRef, {
          votingEnabled: true,
          updatedAt: serverTimestamp(),
        })
        setVotingDisabled(false)
      }
    }, (err) => {
      console.error('Error listening to voting status:', err)
      // Si falla, usar polling
      const interval = setInterval(async () => {
        try {
          const config = await getSystemConfig()
          if (!mounted) return
          setVotingDisabled(!config?.votingEnabled)
        } catch (e) {
          console.error('Error polling voting status:', e)
        }
      }, 5000)
      return () => clearInterval(interval)
    })

    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])'''

content = re.sub(old_useEffect, new_useEffect, content, flags=re.DOTALL)

with open(path, 'w') as f:
    f.write(content)

print('Voting.tsx actualizado correctamente')
