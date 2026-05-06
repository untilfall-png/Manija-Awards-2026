$path = 'C:\Kimi\Manija Awards 2026\lib\voting.ts'
$text = [System.IO.File]::ReadAllText($path)
$text = $text -replace 'import { db } from ''./firebase''', 'import { db, isFirebaseConfigured } from ''./firebase'''
[System.IO.File]::WriteAllText($path, $text)
Write-Host 'Done'
