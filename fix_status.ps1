$path = "d:\ReactJS PRO-jects\DrDesignProject\Mawahib\mawahib-3D\resume.jsx"
$content = [System.IO.File]::ReadAllText($path)
$old = 'if (s === "Reviewed") return "cv-status-reviewed";'
$new = 'if (s === "Invited") return "cv-status-reviewed";' + "`r`n" + '  if (s === "Rejected") return "cv-status-rejected";'
$content = $content.Replace($old, $new)
[System.IO.File]::WriteAllText($path, $content)
Write-Host "Done"
