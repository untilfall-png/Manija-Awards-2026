import re

with open('C:/Kimi/Manija Awards 2026/components/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "type AdminTab = 'dashboard' | 'categories' | 'results' | 'voters' | 'charts' | 'maintenance'",
    "type AdminTab = 'dashboard' | 'categories' | 'results' | 'voters' | 'charts' | 'maintenance' | 'conclusion'"
)

content = content.replace(
    "              { id: 'maintenance' as AdminTab, label: 'Mantenimiento', shortLabel: 'Mant', icon: Settings },",
    "              { id: 'maintenance' as AdminTab, label: 'Mantenimiento', shortLabel: 'Mant', icon: Settings },\n              { id: 'conclusion' as AdminTab, label: 'Conclusión', shortLabel: 'Concl', icon: Trophy },"
)

content = content.replace(
    "{activeTab === 'maintenance' && (",
    "{activeTab === 'conclusion' && (<AdminConclusionVideo />)}\n              {activeTab === 'maintenance' && ("
)

content = content.replace(
    'import { AdminLogin } from \'./AdminLogin\'\nimport { getSystemConfig, setVotingEnabled } from \'@/lib/voting\'',
    'import { AdminLogin } from \'./AdminLogin\'\nimport { getSystemConfig, setVotingEnabled } from \'@/lib/voting\'\nimport { AdminConclusionVideo } from \'./AdminConclusionVideo\''
)

with open('C:/Kimi/Manija Awards 2026/components/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ AdminDashboard updated successfully')
