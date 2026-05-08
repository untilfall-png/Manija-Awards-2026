// Hook para generar PDF de diploma
// jsPDF + html2canvas se importan dinámicamente — solo cuando el usuario hace click en descargar

import { useCallback } from 'react'

// ── Helper: carga el logo como base64 para embeber en HTML sin problemas de CORS ──
async function fetchLogoBase64(): Promise<string> {
  try {
    const resp = await fetch('/logo.jpeg')
    const blob = await resp.blob()
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror  = () => resolve('')
      reader.readAsDataURL(blob)
    })
  } catch {
    return ''
  }
}

export function useDiplomaGenerator() {

  // ════════════════════════════════════════════════════════════
  //  DIPLOMA REGULAR — estética neon
  // ════════════════════════════════════════════════════════════
  const generateDiplomaPDF = useCallback(async (
    winnerName: string,
    categoryName: string,
    votes: number,
    date: string
  ) => {
    try {
      const [{ default: jsPDF }, { default: html2canvas }, logoB64] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
        fetchLogoBase64(),
      ])

      const W = 1100, H = 770
      const tempDiv = document.createElement('div')
      tempDiv.style.cssText = `position:fixed;left:-9999px;top:-9999px;width:${W}px;height:${H}px;`
      document.body.appendChild(tempDiv)

      const dateParts = date.split('/')
      const day   = dateParts[0] || '21'
      const month = dateParts[1] || '05'
      const year  = dateParts[2] || '2026'
      const months: Record<string,string> = {
        '01':'ENE','02':'FEB','03':'MAR','04':'ABR','05':'MAY','06':'JUN',
        '07':'JUL','08':'AGO','09':'SEP','10':'OCT','11':'NOV','12':'DIC',
      }
      const monthName = months[month] || 'MAYO'

      const logoHtml = logoB64
        ? `<img src="${logoB64}" style="width:70px;height:70px;border-radius:50%;border:2.5px solid rgba(255,46,219,0.7);object-fit:cover;display:block;margin:0 auto;" />`
        : `<div style="width:60px;height:60px;border:2px solid rgba(255,46,219,0.5);border-radius:50%;margin:0 auto;line-height:60px;text-align:center;font-size:22px;color:rgba(255,255,255,0.5);">⊞</div>`

      tempDiv.innerHTML = `
<div style="
  width:${W}px;height:${H}px;
  background:#0a0a0f;
  font-family:Arial,Helvetica,sans-serif;
  color:#fff;
  position:relative;
  overflow:hidden;
  box-sizing:border-box;
">
  <!-- Background radial glows -->
  <div style="position:absolute;inset:0;
    background:
      radial-gradient(ellipse 60% 40% at 50% 0%,rgba(170,0,255,0.18) 0%,transparent 70%),
      radial-gradient(ellipse 70% 50% at 50% 110%,rgba(255,0,180,0.12) 0%,transparent 70%);
  "></div>

  <!-- Outer border frame -->
  <div style="position:absolute;inset:10px;border:1px solid rgba(255,46,219,0.18);"></div>

  <!-- HUD corners -->
  <div style="position:absolute;top:18px;left:18px;width:44px;height:44px;border-top:2px solid #ff2edb;border-left:2px solid #ff2edb;"></div>
  <div style="position:absolute;top:18px;right:18px;width:44px;height:44px;border-top:2px solid #ff2edb;border-right:2px solid #ff2edb;"></div>
  <div style="position:absolute;bottom:18px;left:18px;width:44px;height:44px;border-bottom:2px solid #22d3ee;border-left:2px solid #22d3ee;"></div>
  <div style="position:absolute;bottom:18px;right:18px;width:44px;height:44px;border-bottom:2px solid #22d3ee;border-right:2px solid #22d3ee;"></div>

  <!-- TOP LEFT: location -->
  <div style="position:absolute;top:30px;left:68px;">
    <div style="font-size:13px;font-weight:900;color:#cc00ff;letter-spacing:4px;line-height:1;">SANTIAGO DE CHILE</div>
    <div style="font-size:7.5px;color:rgba(255,255,255,0.35);letter-spacing:2px;margin-top:3px;line-height:1.8;">ANIVERSARIO MANIJA 2026</div>
  </div>

  <!-- TOP RIGHT: date -->
  <div style="position:absolute;top:22px;right:68px;text-align:right;">
    <div style="font-size:30px;font-weight:900;color:#ff2edb;line-height:1;">${day}</div>
    <div style="font-size:9px;color:rgba(255,255,255,0.55);letter-spacing:3px;line-height:2;">${monthName}</div>
    <div style="font-size:13px;color:rgba(255,255,255,0.65);letter-spacing:2px;">${year}</div>
  </div>

  <!-- TOP CENTER: Logo -->
  <div style="text-align:center;padding-top:24px;">
    ${logoHtml}
  </div>

  <!-- Tagline -->
  <div style="text-align:center;margin-top:6px;">
    <span style="font-size:8px;color:rgba(255,255,255,0.3);letter-spacing:6px;">—— CLUB LOS MANIJAS 2026 ——</span>
  </div>

  <!-- MANIJA (white glow) -->
  <div style="text-align:center;margin-top:8px;line-height:1;">
    <div style="font-size:82px;font-weight:900;color:#ffffff;letter-spacing:10px;text-shadow:0 0 25px rgba(200,100,255,0.9),0 0 60px rgba(170,0,255,0.5);">MANIJA</div>
  </div>
  <!-- AWARDS (neon pink) -->
  <div style="text-align:center;line-height:1;margin-top:-6px;">
    <div style="font-size:60px;font-weight:900;color:#ff2edb;letter-spacing:10px;text-shadow:0 0 18px rgba(255,46,219,0.9),0 0 40px rgba(255,46,219,0.4);">AWARDS</div>
  </div>
  <!-- 2026 -->
  <div style="text-align:center;margin-top:4px;">
    <div style="font-size:18px;color:rgba(255,255,255,0.4);letter-spacing:16px;">2 0 2 6</div>
  </div>

  <!-- Neon separator -->
  <div style="margin:14px 70px 0;height:2px;background:linear-gradient(90deg,transparent,#ff2edb 30%,#a855f7 50%,#22d3ee 70%,transparent);"></div>

  <!-- OTORGADO A -->
  <div style="text-align:center;margin-top:12px;">
    <div style="font-size:8.5px;color:rgba(255,255,255,0.45);letter-spacing:5px;text-transform:uppercase;">ESTE DIPLOMA SE OTORGA A:</div>
  </div>

  <!-- WINNER NAME -->
  <div style="text-align:center;margin-top:10px;">
    <div style="font-size:38px;font-weight:900;color:#ffffff;letter-spacing:5px;text-transform:uppercase;text-shadow:0 0 18px rgba(255,255,255,0.4);">${winnerName.toUpperCase()}</div>
  </div>

  <!-- CATEGORIA label -->
  <div style="text-align:center;margin-top:10px;">
    <div style="font-size:8px;color:rgba(255,255,255,0.35);letter-spacing:4px;text-transform:uppercase;">POR HABER SIDO RECONOCIDO EN LA CATEGORÍA:</div>
  </div>

  <!-- Category pill -->
  <div style="text-align:center;margin-top:10px;">
    <div style="display:inline-block;padding:8px 36px;border:2px solid #ff2edb;background:rgba(255,46,219,0.12);">
      <div style="font-size:22px;font-weight:900;color:#ff2edb;letter-spacing:4px;text-transform:uppercase;text-shadow:0 0 10px rgba(255,46,219,0.7);">${categoryName.toUpperCase()}</div>
    </div>
  </div>

  <!-- Description -->
  <div style="text-align:center;margin:10px 120px 0;font-size:8.5px;color:rgba(255,255,255,0.35);letter-spacing:1.5px;line-height:1.8;">
    POR SU ENERGÍA INAGOTABLE, SU ACTITUD LEGENDARIA<br>
    Y POR REPRESENTAR EL VERDADERO
    <span style="color:#ff2edb;"> ESPÍRITU MANIJA</span>.
  </div>

  <!-- Bottom neon line -->
  <div style="margin:14px 70px;height:1px;background:linear-gradient(90deg,transparent,rgba(255,46,219,0.4) 30%,rgba(34,211,238,0.3) 70%,transparent);"></div>

  <!-- BOTTOM SECTION: Signature centered + Badge right -->
  <div style="display:flex;justify-content:center;align-items:flex-end;padding:0 70px 28px;position:relative;">

    <!-- Signature -->
    <div style="text-align:center;">
      <div style="font-size:13px;color:rgba(255,255,255,0.35);font-style:italic;margin-bottom:5px;letter-spacing:1px;">Club los Manijas</div>
      <div style="width:160px;height:1px;background:rgba(255,255,255,0.2);margin:0 auto 6px;"></div>
      <div style="font-size:8px;color:rgba(255,255,255,0.4);letter-spacing:3px;">CLUB LOS MANIJAS 2026</div>
      <div style="font-size:7px;color:rgba(255,46,219,0.4);letter-spacing:2px;margin-top:6px;">${votes} votos · ${date}</div>
    </div>

  </div>

  <!-- Bottom waveform decoration -->
  <div style="position:absolute;bottom:20px;width:100%;text-align:center;">
    <div style="font-size:8px;color:rgba(255,46,219,0.25);letter-spacing:2px;">▌▍▎▏▎▍▌▍▎▏▎▍▌ ▌▍▎▏▎▍▌▍▎▏▎▍▌</div>
  </div>
</div>`

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        backgroundColor: '#0a0a0f',
        useCORS: true,
        logging: false,
        allowTaint: true,
      })

      document.body.removeChild(tempDiv)
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [W, H] })
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, W, H)
      pdf.save(`Diploma_${categoryName.replace(/\s+/g,'_')}_${winnerName.replace(/\s+/g,'_')}.pdf`)
      return true
    } catch (error) {
      console.error('Error generando diploma PDF:', error)
      return false
    }
  }, [])

  // ════════════════════════════════════════════════════════════
  //  Generar todos los diplomas en secuencia
  // ════════════════════════════════════════════════════════════
  const generateAllDiplomas = useCallback(async (
    results: Array<{ categoryName: string; winnerName: string; votes: number; date: string }>
  ) => {
    let successCount = 0
    for (let i = 0; i < results.length; i++) {
      if (i > 0) await new Promise(r => setTimeout(r, 400))
      const ok = await generateDiplomaPDF(results[i].winnerName, results[i].categoryName, results[i].votes, results[i].date)
      if (ok) successCount++
    }
    alert(`Se generaron ${successCount}/${results.length} diplomas exitosamente`)
    return successCount
  }, [generateDiplomaPDF])

  // ════════════════════════════════════════════════════════════
  //  DIPLOMA ESPECIAL — estética gold / metallic
  // ════════════════════════════════════════════════════════════
  const generateSpecialDiplomaPDF = useCallback(async (
    winnerName: string,
    categoryName: string,
    date: string
  ) => {
    try {
      const [{ default: jsPDF }, { default: html2canvas }, logoB64] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
        fetchLogoBase64(),
      ])

      const W = 1100, H = 770
      const tempDiv = document.createElement('div')
      tempDiv.style.cssText = `position:fixed;left:-9999px;top:-9999px;width:${W}px;height:${H}px;`
      document.body.appendChild(tempDiv)

      const dateParts = date.split('/')
      const day   = dateParts[0] || '21'
      const month = dateParts[1] || '05'
      const year  = dateParts[2] || '2026'
      const months: Record<string,string> = {
        '01':'ENE','02':'FEB','03':'MAR','04':'ABR','05':'MAY','06':'JUN',
        '07':'JUL','08':'AGO','09':'SEP','10':'OCT','11':'NOV','12':'DIC',
      }
      const monthName = months[month] || 'MAYO'

      const logoHtml = logoB64
        ? `<img src="${logoB64}" style="width:70px;height:70px;border-radius:50%;border:2.5px solid rgba(255,215,0,0.7);object-fit:cover;display:block;margin:0 auto;" />`
        : `<div style="width:60px;height:60px;border:2px solid rgba(255,215,0,0.5);border-radius:50%;margin:0 auto;line-height:60px;text-align:center;font-size:22px;">★</div>`

      tempDiv.innerHTML = `
<div style="
  width:${W}px;height:${H}px;
  background:linear-gradient(135deg,#0a0800 0%,#1a1200 40%,#0d0900 70%,#0a0800 100%);
  font-family:Arial,Helvetica,sans-serif;
  color:#fff;
  position:relative;
  overflow:hidden;
  box-sizing:border-box;
">
  <!-- Gold radial glows -->
  <div style="position:absolute;inset:0;
    background:
      radial-gradient(ellipse 70% 50% at 50% 0%,rgba(255,200,0,0.15) 0%,transparent 65%),
      radial-gradient(ellipse 60% 40% at 50% 110%,rgba(255,140,0,0.10) 0%,transparent 65%);
  "></div>

  <!-- Outer border (gold double) -->
  <div style="position:absolute;inset:8px;border:1.5px solid rgba(255,215,0,0.35);"></div>
  <div style="position:absolute;inset:13px;border:1px solid rgba(255,215,0,0.10);"></div>

  <!-- HUD corners gold -->
  <div style="position:absolute;top:18px;left:18px;width:44px;height:44px;border-top:2.5px solid #FFD700;border-left:2.5px solid #FFD700;"></div>
  <div style="position:absolute;top:18px;right:18px;width:44px;height:44px;border-top:2.5px solid #FFD700;border-right:2.5px solid #FFD700;"></div>
  <div style="position:absolute;bottom:18px;left:18px;width:44px;height:44px;border-bottom:2.5px solid #FFC107;border-left:2.5px solid #FFC107;"></div>
  <div style="position:absolute;bottom:18px;right:18px;width:44px;height:44px;border-bottom:2.5px solid #FFC107;border-right:2.5px solid #FFC107;"></div>

  <!-- TOP LEFT -->
  <div style="position:absolute;top:30px;left:68px;">
    <div style="font-size:13px;font-weight:900;color:#FFD700;letter-spacing:4px;line-height:1;">SANTIAGO DE CHILE</div>
    <div style="font-size:7.5px;color:rgba(255,215,0,0.4);letter-spacing:2px;margin-top:3px;line-height:1.8;">ANIVERSARIO MANIJA 2026</div>
  </div>

  <!-- TOP RIGHT date -->
  <div style="position:absolute;top:22px;right:68px;text-align:right;">
    <div style="font-size:30px;font-weight:900;color:#FFD700;line-height:1;">${day}</div>
    <div style="font-size:9px;color:rgba(255,215,0,0.6);letter-spacing:3px;line-height:2;">${monthName}</div>
    <div style="font-size:13px;color:rgba(255,215,0,0.7);letter-spacing:2px;">${year}</div>
  </div>

  <!-- TOP CENTER: Logo -->
  <div style="text-align:center;padding-top:24px;">
    ${logoHtml}
  </div>

  <!-- Tagline -->
  <div style="text-align:center;margin-top:6px;">
    <span style="font-size:8px;color:rgba(255,215,0,0.35);letter-spacing:6px;">—— RECONOCIMIENTO ESPECIAL ——</span>
  </div>

  <!-- MANIJA gold -->
  <div style="text-align:center;margin-top:8px;line-height:1;">
    <div style="font-size:78px;font-weight:900;color:#FFD700;letter-spacing:10px;text-shadow:0 0 22px rgba(255,215,0,0.85),0 0 55px rgba(255,165,0,0.45);">MANIJA</div>
  </div>
  <div style="text-align:center;line-height:1;margin-top:-4px;">
    <div style="font-size:56px;font-weight:900;color:#FFC107;letter-spacing:10px;text-shadow:0 0 16px rgba(255,193,7,0.95),0 0 38px rgba(255,165,0,0.4);">AWARDS</div>
  </div>
  <div style="text-align:center;margin-top:4px;">
    <div style="font-size:17px;color:rgba(255,215,0,0.4);letter-spacing:16px;">2 0 2 6</div>
  </div>

  <!-- Gold separator -->
  <div style="margin:12px 70px 0;height:2px;background:linear-gradient(90deg,transparent,#FFD700 30%,#FFC107 50%,#FF8C00 70%,transparent);"></div>

  <!-- Special badge -->
  <div style="text-align:center;margin-top:10px;">
    <div style="display:inline-block;padding:4px 24px;border:1.5px solid rgba(255,215,0,0.55);background:rgba(255,215,0,0.08);">
      <span style="font-size:9px;color:#FFD700;letter-spacing:5px;text-transform:uppercase;">&#127885; CATEGORÍA ESPECIAL</span>
    </div>
  </div>

  <!-- OTORGADO A -->
  <div style="text-align:center;margin-top:12px;">
    <div style="font-size:8.5px;color:rgba(255,215,0,0.45);letter-spacing:5px;text-transform:uppercase;">ESTE DIPLOMA SE OTORGA A:</div>
  </div>

  <!-- WINNER NAME -->
  <div style="text-align:center;margin-top:10px;">
    <div style="font-size:40px;font-weight:900;color:#FFD700;letter-spacing:5px;text-transform:uppercase;text-shadow:0 0 20px rgba(255,215,0,0.55);">${winnerName.toUpperCase()}</div>
  </div>

  <!-- CATEGORIA label -->
  <div style="text-align:center;margin-top:8px;">
    <div style="font-size:8px;color:rgba(255,215,0,0.35);letter-spacing:4px;text-transform:uppercase;">POR HABER RECIBIDO EL RECONOCIMIENTO EN:</div>
  </div>

  <!-- Category pill gold -->
  <div style="text-align:center;margin-top:10px;">
    <div style="display:inline-block;padding:8px 36px;border:2px solid #FFD700;background:rgba(255,215,0,0.10);">
      <div style="font-size:22px;font-weight:900;color:#FFD700;letter-spacing:4px;text-transform:uppercase;text-shadow:0 0 10px rgba(255,215,0,0.7);">${categoryName.toUpperCase()}</div>
    </div>
  </div>

  <!-- Description -->
  <div style="text-align:center;margin:10px 120px 0;font-size:8.5px;color:rgba(255,215,0,0.30);letter-spacing:1.5px;line-height:1.8;">
    POR SU CONTRIBUCIÓN EXTRAORDINARIA Y SU ESPÍRITU ÚNICO<br>QUE HACE DE CADA NOCHE UNA
    <span style="color:#FFD700;"> EXPERIENCIA MANIJA</span>.
  </div>

  <!-- Bottom gold line -->
  <div style="margin:12px 70px;height:1px;background:linear-gradient(90deg,transparent,rgba(255,215,0,0.4) 30%,rgba(255,193,7,0.3) 70%,transparent);"></div>

  <!-- BOTTOM SECTION: Signature centered + Badge right -->
  <div style="display:flex;justify-content:center;align-items:flex-end;padding:0 70px 26px;position:relative;">

    <!-- Signature -->
    <div style="text-align:center;">
      <div style="font-size:12px;color:rgba(255,215,0,0.30);font-style:italic;margin-bottom:5px;">Club los Manijas</div>
      <div style="width:160px;height:1px;background:rgba(255,215,0,0.2);margin:0 auto 6px;"></div>
      <div style="font-size:8px;color:rgba(255,215,0,0.45);letter-spacing:3px;">CLUB LOS MANIJAS 2026</div>
      <div style="font-size:7px;color:rgba(255,215,0,0.25);letter-spacing:2px;margin-top:4px;">${date}</div>
    </div>

  </div>

  <!-- Bottom decoration -->
  <div style="position:absolute;bottom:20px;width:100%;text-align:center;">
    <div style="font-size:8px;color:rgba(255,215,0,0.18);letter-spacing:2px;">★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★</div>
  </div>
</div>`

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        backgroundColor: '#0a0800',
        useCORS: true,
        logging: false,
        allowTaint: true,
      })

      document.body.removeChild(tempDiv)
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [W, H] })
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, W, H)
      pdf.save(`DiplomaEspecial_${categoryName.replace(/\s+/g,'_')}_${winnerName.replace(/\s+/g,'_')}.pdf`)
      return true
    } catch (error) {
      console.error('Error generando diploma especial PDF:', error)
      return false
    }
  }, [])

  return { generateDiplomaPDF, generateAllDiplomas, generateSpecialDiplomaPDF }
}
