import re

path = '/Kimi/Manija Awards 2026/components/AdminDashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Agregar import de AdminMaintenance
content = content.replace(
    'const AdminVoters = lazy(() => import(\'./AdminVoters\').then(mod => ({ default: mod.AdminVoters })))',
    'const AdminVoters = lazy(() => import(\'./AdminVoters\').then(mod => ({ default: mod.AdminVoters })))\nconst AdminMaintenance = lazy(() => import(\'./AdminMaintenance\').then(mod => ({ default: mod.AdminMaintenance })))'
)

# Agregar maintenance al tipo AdminTab
content = content.replace(
    "type AdminTab = 'dashboard' | 'categories' | 'results' | 'voters' | 'charts'",
    "type AdminTab = 'dashboard' | 'categories' | 'results' | 'voters' | 'charts' | 'maintenance'"
)

# Agregar maintenance al array de tabs
content = content.replace(
    """              { id: 'charts' as AdminTab, label: 'Gráficos', shortLabel: 'Grá', icon: BarChart3 },\n            ].map(({ id, label, shortLabel, icon: Icon }) => (""",
    """              { id: 'charts' as AdminTab, label: 'Gráficos', shortLabel: 'Grá', icon: BarChart3 },\n              { id: 'maintenance' as AdminTab, label: 'Mantenimiento', shortLabel: 'Mant', icon: Settings },\n            ].map(({ id, label, shortLabel, icon: Icon }) => ("""
)

# Agregar el renderizado del tab maintenance
content = content.replace(
    """            {activeTab === 'charts' && (
              <Suspense fallback={<LoadingFallback />}>
                <AdminCharts />
              </Suspense>
            )}
          </motion.div>
        </div>)""",
    """            {activeTab === 'charts' && (
              <Suspense fallback={<LoadingFallback />}>
                <AdminCharts />
              </Suspense>
            )}
            {activeTab === 'maintenance' && (
              <Suspense fallback={<LoadingFallback />}>
                <AdminMaintenance />
              </Suspense>
            )}
          </motion.div>
        </div>)"""
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('AdminDashboard actualizado')
