$ScriptDir = Split-Path $script:MyInvocation.MyCommand.Path
Write-Host "Current script directory is $ScriptDir"
Set-Location $ScriptDir 
Set-Location ..
$escScriptDir = $ScriptDir -replace "\\", "\\\\"
$nodeArgs = "var path = require('path');  process.chdir('$escScriptDir'); process.chdir('../');console.log('Working directory: ' + process.cwd())"   
node -e $nodeArgs 
node "utils\dist.js"
Write-Host -NoNewLine 'Press any key to continue...';
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown');
# SIG # Begin signature block
# MIIFuQYJKoZIhvcNAQcCoIIFqjCCBaYCAQExCzAJBgUrDgMCGgUAMGkGCisGAQQB
# gjcCAQSgWzBZMDQGCisGAQQBgjcCAR4wJgIDAQAABBAfzDtgWUsITrck0sYpfvNR
# AgEAAgEAAgEAAgEAAgEAMCEwCQYFKw4DAhoFAAQU2J/gbZSmoBG1FREpk+CUQ6js
# Z7qgggNCMIIDPjCCAiqgAwIBAgIQGsiUXUJoaZdKLp+Snus5WjAJBgUrDgMCHQUA
# MCwxKjAoBgNVBAMTIVBvd2VyU2hlbGwgTG9jYWwgQ2VydGlmaWNhdGUgUm9vdDAe
# Fw0xOTA5MTUwMTE0MzFaFw0zOTEyMzEyMzU5NTlaMBoxGDAWBgNVBAMTD1Bvd2Vy
# U2hlbGwgVXNlcjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAL0+es3J
# C5TSN8FLAbp/SgU9j6e0rcobGpxHaHFvHzkhAHk826+mEsi8L3DyywrBeN8DPmIc
# SSl7hTqCzYHHvEOBoLDAoPtXyKZl159+oMUzHJrNp1xQ0rx71N8JhhHbquJtoxA/
# oqw60JrGi7ii4kHrIbnKno46paHOoOtuJPFZIuHUxknhl4fbFdoPD/f1b//zUhqN
# IL3jATcu/SwDgyqQdqX5TZ6/LD/Bt+nw6V4zBPkwogkz7Z/zYAjTSUJBYqQRGJ4f
# H4HhbMeEw31Ed83bYbXjylqYNN103JdiZKbzH0oM7+O3QWNQGpP0DLYyCX9LjQ3V
# hlfr1ugEcEsoS7ECAwEAAaN2MHQwEwYDVR0lBAwwCgYIKwYBBQUHAwMwXQYDVR0B
# BFYwVIAQNzVBJIsI9vKH2NMdFImxBKEuMCwxKjAoBgNVBAMTIVBvd2VyU2hlbGwg
# TG9jYWwgQ2VydGlmaWNhdGUgUm9vdIIQI3kga5hb8YBBoOGSubzqcjAJBgUrDgMC
# HQUAA4IBAQBUU1dtsBS7vIxzbTXieyfOIDcwGG+vaFJQgGNAn4mIXDndq23oi2Eb
# pgsDLvwspSeqm7isRPNtAfh7fshHIhUDNyfqMvdSpTeWH4kiTqt9vd4Ymh433AKT
# Hb6Lu63WoFhanWTkcMdfr5mlrVFuTcEqv/mhocrj5zZ20nG3xZXkHtiYqtB/eqFj
# QD5mJAliQxVpkm4NsO8Ay+W2D1T23n4yFC65ZleT4nNsGcxfZUeNnyu+N/4EG50M
# wwnuCe2zuSq3vX2eMw+x569y6baOwhaCBES1ESxEa4sMcQafkYuRoRFQmmjN9Kjf
# LOzIVL/Qw1516UANo+NPkGmD1dxY57wUMYIB4TCCAd0CAQEwQDAsMSowKAYDVQQD
# EyFQb3dlclNoZWxsIExvY2FsIENlcnRpZmljYXRlIFJvb3QCEBrIlF1CaGmXSi6f
# kp7rOVowCQYFKw4DAhoFAKB4MBgGCisGAQQBgjcCAQwxCjAIoAKAAKECgAAwGQYJ
# KoZIhvcNAQkDMQwGCisGAQQBgjcCAQQwHAYKKwYBBAGCNwIBCzEOMAwGCisGAQQB
# gjcCARUwIwYJKoZIhvcNAQkEMRYEFAks7e6oprw187O+GymC6HB2/EwFMA0GCSqG
# SIb3DQEBAQUABIIBAJTJJgrp8JyxTNPMnTHJyecNqlqouF4M3m6Tf2hy0ztPL0FF
# qswvZgj8D0pLVZPmtRPS/hMKrZFIk+MjbXBvqTJ0vtDwPGTWiLwNkcZe+3NxAr2j
# Q8OgDLO3JnGQZegGpL2sXjsbYLfYr4pRZDeyOwVqo9wUABuqlAS5/GuLS5tEbLGp
# mWrnAdNDK4M9rQqiBcdiyhqj3R1WEguYsoJvgt4jrZL98iMw0rXsWIW5V8Ti9iU6
# aizlEncY4Xq71jV8YaOo9xPLUGhi4q9kU0ZZV4zxThx7Hxt5TkWZJLPFhXz3lxgf
# ICO634OJa/9YsSozFQTe3zhkGytEdG3pn3AgAGk=
# SIG # End signature block
