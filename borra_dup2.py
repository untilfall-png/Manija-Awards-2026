f = open('/Kimi/Manija Awards 2026/lib/voting.ts', 'r')
ls = f.readlines()
f.close()
del ls[385:398]
f = open('/Kimi/Manija Awards 2026/lib/voting.ts', 'w')
f.writelines(ls)
f.close()
print('OK')
