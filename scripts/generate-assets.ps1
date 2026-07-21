Add-Type -AssemblyName System.Drawing

$products = @(
    @{ Name = 'Hospital_KPI_Dashboard_Pro'; Color1 = '#0B2545'; Color2 = '#1a4a7a'; Label = 'Hospital KPI Dashboard' },
    @{ Name = 'NGO_Grant_System'; Color1 = '#2d5a27'; Color2 = '#4a8c42'; Label = 'NGO Grant System' },
    @{ Name = 'School_Admin_Dashboard'; Color1 = '#5b2d8e'; Color2 = '#8b5cf6'; Label = 'School Admin Dashboard' },
    @{ Name = 'Church_Finance_System'; Color1 = '#7c3a12'; Color2 = '#b85c1a'; Label = 'Church Finance System' }
)

$placeholders = @(
    @{ Name = 'placeholder-financial'; Color1 = '#1e3a5f'; Color2 = '#3b82f6'; Label = 'Financial Model' },
    @{ Name = 'placeholder-dashboard'; Color1 = '#0f766e'; Color2 = '#14b8a6'; Label = 'Dashboard Preview' },
    @{ Name = 'placeholder-chart'; Color1 = '#7c3aed'; Color2 = '#a78bfa'; Label = 'Chart Preview' },
    @{ Name = 'placeholder-report'; Color1 = '#b45309'; Color2 = '#f59e0b'; Label = 'Report Preview' },
    @{ Name = 'placeholder-data'; Color1 = '#1e40af'; Color2 = '#60a5fa'; Label = 'Data View' }
)

function New-ProductImage {
    param($Name, $Color1, $Color2, $Label, $Index)

    $w = 800; $h = 600
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = 'HighQuality'

    # Parse colors
    $c1 = [System.Drawing.ColorTranslator]::FromHtml($Color1)
    $c2 = [System.Drawing.ColorTranslator]::FromHtml($Color2)

    # Gradient background
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        (New-Object System.Drawing.Point(0,0)),
        (New-Object System.Drawing.Point($w,$h)),
        $c1, $c2
    )
    $g.FillRectangle($brush, 0, 0, $w, $h)

    # Decorative circles
    $r = New-Object System.Random
    for ($i = 0; $i -lt 12; $i++) {
        $x = $r.Next(0, $w); $y = $r.Next(0, $h)
        $size = $r.Next(20, 120)
        $alpha = [System.Drawing.Color]::FromArgb(25, 255, 255, 255)
        $g.FillEllipse((New-Object System.Drawing.SolidBrush($alpha)), $x, $y, $size, $size)
    }

    # Grid lines
    $gridPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(20, 255, 255, 255))
    for ($x = 0; $x -lt $w; $x += 60) { $g.DrawLine($gridPen, $x, 0, $x, $h) }
    for ($y = 0; $y -lt $h; $y += 60) { $g.DrawLine($gridPen, 0, $y, $w, $y) }

    # Label
    $font = New-Object System.Drawing.Font('Segoe UI', 36, [System.Drawing.FontStyle]::Bold)
    $fontSmall = New-Object System.Drawing.Font('Segoe UI', 16)
    $white = [System.Drawing.Brushes]::White
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = 'Center'; $sf.LineAlignment = 'Center'

    $g.DrawString($Label, $font, $white, ($w/2), ($h/2 - 40), $sf)
    $g.DrawString("TrueWorks", $fontSmall, $white, ($w/2), ($h/2 + 40), $sf)

    if ($Index) {
        $g.DrawString("View $Index", $fontSmall, $white, ($w/2), ($h/2 + 80), $sf)
    }

    # Accent bar at top
    $barBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 201, 162, 39))
    $g.FillRectangle($barBrush, 0, 0, $w, 6)

    $path = Join-Path (Get-Location) "public\images\products\${Name}.png"
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
    Write-Host "Created: $path"
}

# Generate product images
foreach ($p in $products) {
    New-ProductImage -Name $p.Name -Color1 $p.Color1 -Color2 $p.Color2 -Label $p.Label -Index $null
}

# Generate multi-view product images
$views = @(
    @{ Name = 'Hospital_KPI_Dashboard_Pro_01'; Color1 = '#0B2545'; Color2 = '#1a4a7a'; Label = 'Executive Overview' }
    @{ Name = 'Hospital_KPI_Dashboard_Pro_02'; Color1 = '#0B2545'; Color2 = '#2a5a9a'; Label = 'Bed Occupancy' }
    @{ Name = 'Hospital_KPI_Dashboard_Pro_03'; Color1 = '#0B2545'; Color2 = '#3a6aba'; Label = 'Financial Metrics' }
    @{ Name = 'Hospital_KPI_Dashboard_Pro_04'; Color1 = '#0B2545'; Color2 = '#4a7ada'; Label = 'Staff Dashboard' }
    @{ Name = 'NGO_Grant_System_01'; Color1 = '#2d5a27'; Color2 = '#4a8c42'; Label = 'Grant Overview' }
    @{ Name = 'NGO_Grant_System_02'; Color1 = '#2d5a27'; Color2 = '#5a9c52'; Label = 'Budget vs Actual' }
    @{ Name = 'School_Admin_Dashboard_01'; Color1 = '#5b2d8e'; Color2 = '#8b5cf6'; Label = 'Student Overview' }
    @{ Name = 'School_Admin_Dashboard_02'; Color1 = '#5b2d8e'; Color2 = '#9b6cff'; Label = 'Fee Tracking' }
    @{ Name = 'Church_Finance_System_01'; Color1 = '#7c3a12'; Color2 = '#b85c1a'; Label = 'Tithe Tracker' }
    @{ Name = 'Church_Finance_System_02'; Color1 = '#7c3a12'; Color2 = '#c86c2a'; Label = 'Expense Mgmt' }
)

foreach ($v in $views) {
    New-ProductImage -Name $v.Name -Color1 $v.Color1 -Color2 $v.Color2 -Label $v.Label -Index $null
}

# Generate placeholder images
foreach ($p in $placeholders) {
    New-ProductImage -Name $p.Name -Color1 $p.Color1 -Color2 $p.Color2 -Label $p.Label -Index $null
}

# Generate dummy template files
$templates = @(
    'Hospital_KPI_Dashboard_Pro.xlsx',
    'NGO_Grant_System.xlsx',
    'School_Admin_Dashboard.xlsx',
    'Church_Finance_System.xlsx',
    'User_Guide.pdf',
    'Installation_Notes.txt',
    'Setup_Guide.pdf',
    'Quick_Start_Guide.pdf',
    'Compliance_Templates.zip'
)

$dummyDir = Join-Path (Get-Location) "public\dummy-templates"
foreach ($t in $templates) {
    $path = Join-Path $dummyDir $t
    # Create actual content based on file type
    if ($t -match '\.xlsx$') {
        # Create a minimal valid ZIP (which .xlsx is)
        $bytes = [System.Text.Encoding]::UTF8.GetBytes("PK`u{0003}`u{0004}") # Minimal ZIP header
        [System.IO.File]::WriteAllBytes($path, [byte[]]@(0x50, 0x4B, 0x05, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00))
    } elseif ($t -match '\.pdf$') {
        # Minimal valid PDF
        $pdf = "%PDF-1.4%`0`0`0`0" + "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobjxref0 4 0000000000 65535 f 0000000009 00000 n 0000000058 00000 n 0000000115 00000 n trailer<</Size 4/Root 1 0 R>>"
        $utf8 = [System.Text.Encoding]::UTF8.GetBytes($pdf)
        [System.IO.File]::WriteAllBytes($path, $utf8)
    } elseif ($t -match '\.txt$') {
        Set-Content -Path $path -Value "TrueWorks Template - Installation Notes`r`n`r`n1. Extract the template file to your preferred folder`r`n2. Enable macros in Excel: File > Options > Trust Center > Trust Center Settings > Macro Settings > Enable all macros`r`n3. Open the template and click 'Enable Editing'`r`n4. Follow the setup guide to configure for your organization`r`n`r`nFor support: hello@trueworks.ug"
    } elseif ($t -match '\.zip$') {
        [System.IO.File]::WriteAllBytes($path, [byte[]]@(0x50, 0x4B, 0x05, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00))
    }
    Write-Host "Created: $path"
}

Write-Host "`nAll assets generated successfully!" -ForegroundColor Green

