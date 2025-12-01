Add-Type -AssemblyName System.Drawing

$sourceFile = Join-Path $PSScriptRoot "logo.png"
$outputFile = Join-Path $PSScriptRoot "logo-512x512.png"

if (-not (Test-Path $sourceFile)) {
    Write-Host "Error: logo.png not found in $PSScriptRoot"
    exit 1
}

try {
    $img = [System.Drawing.Image]::FromFile($sourceFile)
    $newImg = New-Object System.Drawing.Bitmap(512, 512)
    $graphics = [System.Drawing.Graphics]::FromImage($newImg)
    
    # High quality resizing
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    # Draw the image resized to 512x512
    $graphics.DrawImage($img, 0, 0, 512, 512)
    
    # Save the resized image
    $newImg.Save($outputFile, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Cleanup
    $img.Dispose()
    $newImg.Dispose()
    $graphics.Dispose()
    
    Write-Host "SUCCESS: Created logo-512x512.png (512x512 pixels)"
    Write-Host "Location: $outputFile"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    exit 1
}
