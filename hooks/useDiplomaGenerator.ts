// Hook para generar PDF de diploma
// jsPDF + html2canvas se importan dinámicamente — solo cuando el usuario hace click en descargar

import { useCallback } from 'react'

export function useDiplomaGenerator() {
  const generateDiplomaPDF = useCallback(async (
    winnerName: string,
    categoryName: string,
    votes: number,
    date: string
  ) => {
    try {
      // Carga diferida: solo importa estas bibliotecas pesadas cuando se necesitan
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ])

      const tempDiv = document.createElement('div')
      tempDiv.style.cssText = 'position:fixed;left:-9999px;top:-9999px;'
      document.body.appendChild(tempDiv)

      tempDiv.innerHTML = `
        <div style="
          width:800px;height:600px;
          background:linear-gradient(135deg,#0a0a0f 0%,#1a0a2e 50%,#0f0c29 100%);
          border:4px solid #ff00ff;border-radius:20px;
          color:white;font-family:Arial,sans-serif;text-align:center;
          padding:40px;box-sizing:border-box;position:relative;overflow:hidden;">
          <div style="position:absolute;inset:0;
            background:radial-gradient(circle at 20% 30%,rgba(255,0,255,.3) 0%,transparent 50%),
                       radial-gradient(circle at 80% 70%,rgba(0,255,255,.3) 0%,transparent 50%);"></div>
          <div style="position:relative;z-index:1;">
            <h1 style="font-size:36px;font-weight:bold;margin:0 0 20px;
              background:linear-gradient(90deg,#ff00ff,#00ffff,#ffff00);
              -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
              MANIJA AWARDS 2026
            </h1>
            <div style="width:200px;height:4px;background:linear-gradient(90deg,transparent,#ff00ff,#00ffff,transparent);margin:20px auto;border-radius:2px;"></div>
            <h2 style="font-size:28px;color:#ffd700;margin:30px 0 10px;text-transform:uppercase;letter-spacing:3px;">
              ${categoryName}
            </h2>
            <div style="margin:30px 0;padding:20px;background:rgba(255,255,255,.1);border-radius:15px;border:1px solid rgba(255,255,255,.2);">
              <p style="font-size:24px;font-weight:bold;margin:0;color:#fff;">${winnerName}</p>
              <p style="font-size:16px;color:#00ffff;margin:10px 0 0;">🏆 GANADOR ABSOLUTO 🏆</p>
            </div>
            <div style="display:flex;justify-content:center;gap:40px;margin:30px 0;">
              <div>
                <p style="font-size:14px;color:#aaa;margin:0;">Votos Obtenidos</p>
                <p style="font-size:32px;font-weight:bold;color:#00ff88;margin:5px 0 0;">${votes}</p>
              </div>
              <div>
                <p style="font-size:14px;color:#aaa;margin:0;">Fecha</p>
                <p style="font-size:18px;color:#fff;margin:5px 0 0;">${date}</p>
              </div>
            </div>
          </div>
        </div>`

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      })

      document.body.removeChild(tempDiv)

      const pdf = new jsPDF('landscape', 'px', [canvas.width, canvas.height])
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, canvas.width, canvas.height)
      pdf.save(`Diploma_${categoryName.replace(/\s+/g, '_')}_${winnerName.replace(/\s+/g, '_')}.pdf`)

      return true
    } catch (error) {
      console.error('Error generando diploma PDF:', error)
      return false
    }
  }, [])

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

  return { generateDiplomaPDF, generateAllDiplomas }
}
