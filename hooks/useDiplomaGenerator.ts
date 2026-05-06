// Hook para generar PDF de diploma
// Usar en el componente: const { generateDiplomaPDF } = useDiplomaGenerator()

import { useCallback } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export function useDiplomaGenerator() {
  const generateDiplomaPDF = useCallback(async (
    winnerName: string,
    categoryName: string,
    votes: number,
    date: string
  ) => {
    try {
      // Crear elemento temporal oculto
      const tempDiv = document.createElement('div')
      tempDiv.style.position = 'fixed'
      tempDiv.style.left = '-9999px'
      tempDiv.style.top = '-9999px'
      document.body.appendChild(tempDiv)

      // Renderizar diploma en elemento temporal
      tempDiv.innerHTML = `
        <div id="diploma-print" style="
          width: 800px;
          height: 600px;
          background: linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0f0c29 100%);
          border: 4px solid #ff00ff;
          border-radius: 20px;
          color: white;
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 40px;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        ">
          <!-- Efecto de brillos -->
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
              radial-gradient(circle at 20% 30%, rgba(255,0,255,0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(0,255,255,0.3) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255,215,0,0.2) 0%, transparent 70%);
            animation: shimmer 3s ease-in-out infinite;
          "></div>
          
          <style>
            @keyframes shimmer {
              0%, 100% { opacity: 0.5; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.1); }
            }
          </style>

          <!-- Contenido -->
          <div style="position: relative; z-index: 1;">
            <h1 style="
              font-size: 36px;
              font-weight: bold;
              margin: 0 0 20px 0;
              background: linear-gradient(90deg, #ff00ff, #00ffff, #ffff00);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              text-shadow: 0 0 40px rgba(255,0,255,0.5);
            ">
              MANIJA AWARDS 2026
            </h1>

            <div style="
              width: 200px;
              height: 4px;
              background: linear-gradient(90deg, transparent, #ff00ff, #00ffff, transparent);
              margin: 20px auto;
              border-radius: 2px;
            "></div>

            <h2 style="
              font-size: 28px;
              color: #ffd700;
              margin: 30px 0 10px 0;
              text-transform: uppercase;
              letter-spacing: 3px;
            ">
              ${categoryName}
            </h2>

            <div style="
              margin: 30px 0;
              padding: 20px;
              background: rgba(255,255,255,0.1);
              border-radius: 15px;
              border: 1px solid rgba(255,255,255,0.2);
            ">
              <p style="
                font-size: 24px;
                font-weight: bold;
                margin: 0;
                color: #fff;
                text-shadow: 0 0 30px rgba(255,255,255,0.8);
              ">
                ${winnerName}
              </p>
              <p style="
                font-size: 16px;
                color: #00ffff;
                margin: 10px 0 0 0;
              ">
                🏆 GANADOR ABSOLUTO 🏆
              </p>
            </div>

            <div style="
              display: flex;
              justify-content: center;
              gap: 40px;
              margin: 30px 0;
            ">
              <div>
                <p style="font-size: 14px; color: #aaa; margin: 0;">Votos Obtenidos</p>
                <p style="font-size: 32px; font-weight: bold; color: #00ff88; margin: 5px 0 0 0;">${votes}</p>
              </div>
              <div>
                <p style="font-size: 14px; color: #aaa; margin: 0;">Fecha</p>
                <p style="font-size: 18px; color: #fff; margin: 5px 0 0 0;">${date}</p>
              </div>
            </div>

            <div style="
              margin-top: 40px;
              font-size: 40px;
              animation: sparkle 2s ease-in-out infinite;
            ">
              ⭐ ✨ 🌟 ⭐ ✨ 🌟
            </div>

            <style>
              @keyframes sparkle {
                0%, 100% { opacity: 0.5; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
              }
            </style>
          </div>
        </div>
      `

      // Capturar canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false
      })

      // Limpiar elemento temporal
      document.body.removeChild(tempDiv)

      // Crear PDF
      const pdf = new jsPDF('landscape', 'px', [canvas.width, canvas.height])
      const imgData = canvas.toDataURL('image/png', 1.0)
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)

      // Descargar
      pdf.save(`Diploma_${categoryName.replace(/\s+/g, '_')}_${winnerName.replace(/\s+/g, '_')}.pdf`)

      return true
    } catch (error) {
      console.error('Error generando diploma PDF:', error)
      return false
    }
  }, [])

  const generateAllDiplomas = useCallback(async (
    results: Array<{
      categoryName: string
      winnerName: string
      votes: number
      date: string
    }>
  ) => {
    const resultsPromises = results.map(async (r, i) => {
      await new Promise(resolve => setTimeout(resolve, i * 500)) // Delay entre cada uno
      return generateDiplomaPDF(r.winnerName, r.categoryName, r.votes, r.date)
    })
    
    const resultsArray = await Promise.all(resultsPromises)
    const successCount = resultsArray.filter(Boolean).length
    
    alert(`Se generaron ${successCount}/${results.length} diplomas exitosamente`)
    return resultsArray
  }, [generateDiplomaPDF])

  return { generateDiplomaPDF, generateAllDiplomas }
}
