f = open('/Kimi/Manija Awards 2026/lib/voting.ts', 'r', encoding='utf-8')
lines = f.readlines()
f.close()

# Borrar línea 382 (index 381) que tiene solo '}' extra
new_lines = []
for i, line in enumerate(lines):
    if i == 381 and line.strip() == '}' and i > 0:
        # Verificar que la línea anterior ya termina el array
        prev = lines[i-1].strip()
        if prev.endswith('},') or prev.endswith('}'):
            continue  # Saltar esta línea
    new_lines.append(line)

f = open('/Kimi/Manija Awards 2026/lib/voting.ts', 'w', encoding='utf-8')
f.writelines(new_lines)
f.close()
print('Corregido')
