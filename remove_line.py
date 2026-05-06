f = open('/Kimi/Manija Awards 2026/lib/voting.ts', 'r')
lines = f.readlines()
f.close()
# Quitar línea 382 (index 381)
new_lines = lines[:381] + lines[382:]
f = open('/Kimi/Manija Awards 2026/lib/voting.ts', 'w')
f.writelines(new_lines)
f.close()
print('Línea 382 eliminada')
