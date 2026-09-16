param([Parameter(Mandatory=$true)][string]$InputJson)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$audioOutput = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../dist/audio'))
New-Item -ItemType Directory -Path $audioOutput -Force | Out-Null
$audioRecords = Get-Content -LiteralPath $InputJson -Raw -Encoding UTF8 | ConvertFrom-Json
$audioSpeaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
    $audioSpeaker.SelectVoice('Microsoft Zira Desktop')
    $audioSpeaker.Rate = -1
    $audioFormat = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(22050, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)
    foreach ($record in $audioRecords) {
        if ($record.id -lt 12 -or $record.id -gt 25) { throw 'Invalid artwork number.' }
        $audioFile = Join-Path $audioOutput ('work-' + $record.id + '.wav')
        $audioPrompt = New-Object System.Speech.Synthesis.PromptBuilder
        foreach ($part in $record.parts) {
            if ($part.field -ne 'name') {
                $audioPrompt.AppendText($part.label + '.')
                $audioPrompt.AppendBreak([TimeSpan]::FromMilliseconds(250))
            }
            $audioPrompt.AppendText($part.spoken)
            $audioPrompt.AppendBreak([TimeSpan]::FromMilliseconds(1100))
        }
        $audioSpeaker.SetOutputToWaveFile($audioFile, $audioFormat)
        $audioSpeaker.Speak($audioPrompt)
        $audioSpeaker.SetOutputToNull()
        Write-Output ('Recorded work ' + $record.id)
    }
} finally { $audioSpeaker.Dispose() }
$audioRecords | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $audioOutput 'narration.json') -Encoding UTF8
