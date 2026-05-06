f = open('/Kimi/Manija Awards 2026/lib/voting.ts', 'r')
lines = f.readlines()
f.close()

# Borrar las líneas 386-398 (indices 385-397)
del lines[385:398]

f = open('/Kimi/ Manija Awards 2026/lib/voting.ts', 'w')
f.writelines(lines)
f.close()
print('Borrado duplicado')
