import re

path = '/Kimi/Manija Awards 2026/components/Voting.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if i == 3:
        lines[i] = "import { motion } from 'framer-motion'\nimport { doc, onSnapshot, serverTimestamp } from 'firebase/firestore'\n"
        break

full = ''.join(lines)

old = r'useEffect\(\) \{\s+let mounted = true\s+getCategories\(\)\s+\.then\(\(fetched\) => \{\s+if \(!mounted\) return\s+setCategories\(fetched\)\s+\}\)\s+\.catch\(\(err\) => \{\s+console\.error\(\'Error loading categories:\', err\)\s+setCategoryError\(\'No se pudieron cargar las categorías\'\)\s+\}\)\s+\.finally\(\(\) => \{\s+if \(mounted\) setLoadingCategories\(false\)\s+\}\)\s+getSystemConfig\(\)\s+\.then\(\(config\) => \{\s+if \(!mounted\) return\s+setVotingDisabled\(!config\?\.votingEnabled\)\s+\}\)\s+\.catch\(\(err\) => \{\s+console\.error\(\'Error loading system config:\', err\)\s+\}\)\s+return \(\) => \{\s+mounted = false\s+\}\s+\}, \[]\)'

new = '''useEffect(() => {
    let mounted = true
    getCategories()
      .then((fetched) => {
        if (!mounted) return
        setCategories(fetched)
      })
      .catch((err) => {
        console.error('Error loading categories:', err)
        setCategoryError('No se pudieron cargar las categorias')
      })
      .finally(() => {
        if (mounted) setLoadingCategories(false)
      })
    const configRef = doc(db, 'system_config', 'system_config')
    const unsubscribe = onSnapshot(configRef, (docSnap) => {
      if (!mounted) return
      if (docSnap.exists()) {
        const data = docSnap.data()
        setVotingDisabled(!data.votingEnabled)
      } else {
        setDoc(configRef, { votingEnabled: true, updatedAt: serverTimestamp() })
        setVotingDisabled(false)
      }
    }, (err) => {
      console.error('Error listening to voting status:', err)
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

full = re.sub(old, new, full, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(full)

print('OK')
