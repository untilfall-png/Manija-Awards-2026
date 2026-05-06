with open('C:/Kimi/Manija Awards 2026/components/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    # Update AdminTab type
    if "type AdminTab = 'dashboard' | 'categories' | 'results' | 'voters' | 'charts' | 'maintenance'" in line:
        line = line.replace(
            "type AdminTab = 'dashboard' | 'categories' | 'results' | 'voters' | 'charts' | 'maintenance'",
            "type AdminTab = 'dashboard' | 'categories' | 'results' | 'voters' | 'charts' | 'maintenance' | 'conclusion'"
        )
    # Add conclusion tab
    if "{ id: 'maintenance' as AdminTab, label: 'Mantenimiento'" in line and 'Concl' not in ''.join(new_lines[-5:]):
        new_lines.append(line)
        new_lines.append("              { id: 'conclusion' as AdminTab, label: 'Concl', shortLabel: 'Concl', icon: Trophy },\n")
        continue
    # Add conclusion render condition
    if "{activeTab === 'maintenance' && (" in line and 'conclusion' not in ''.join(new_lines[-5:]):
        new_lines.append("              {activeTab === 'conclusion' && (<AdminConclusionVideo />)}\n")
        new_lines.append(line)
        continue
    # Update import
    if "from '@/lib/voting'" in line and "AdminConclusionVideo" not in ''.join(new_lines[-5:]):
        new_lines.append(line.rstrip() + "\nimport { AdminConclusionVideo } from '@/components/AdminConclusionVideo'\n")
        continue
    new_lines.append(line)

with open('C:/Kimi/Manija Awards 2026/components/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print('Dashboard updated')
