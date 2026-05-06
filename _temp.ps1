$c = [System.IO.File]::ReadAllLines("C:\Kimi\Manija Awards 2026\components\AdminCategories.tsx")
for ($i = 295; $i -le 316; $i++) {
    Write-Host "$i : $($c[$i-1])"
}
