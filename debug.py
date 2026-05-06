f = open('/Kimi/Manija Awards 2026/lib/voting.ts', 'r')
lines = f.readlines()
f.close()
for i in range(379, 384):
    print(i+1, repr(lines[i]) if i < len(lines) else 'N/A')
