const hyperframes = require('hyperframes');
const { writeFileSync } = require('fs');
const { resolve } = require('path');

// Generate HTML content with composition ID
const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manija Awards 2026 - Conclusión</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000; overflow: hidden; font-family: Arial, sans-serif; }
    canvas { display: block; }
  </style>
</head>
<body data-composition-id="conclusion-epica" data-width="1920" data-height="1080">
  <div id="root"></div>
  <script type="module">
    // Setup composition metadata
    window.__timelines = window.__timelines || {};
    window.__timelines['conclusion-epica'] = {
      duration: 300,
      layers: []
    };
    
    // Setup frame API
    window.__hf = {
      duration: 300,
      seek: (frame) => {
        const root = document.getElementById('root');
        if (!root) return;
        const progress = frame / 300;
        renderFrame(progress, frame);
      }
    };

    const ganadores = [
      { cat: 'Mejor Director', ganador: 'Director A', votos: 342, icon: '🎬', color: '#ff00ff' },
      { cat: 'Mejor Actor', ganador: 'Actor X', votos: 289, icon: '🏆', color: '#00ffff' },
      { cat: 'Mejor Actriz', ganador: 'Actriz M', votos: 356, icon: '👑', color: '#ffff00' },
      { cat: 'Mejor Película', ganador: 'Accion Total', votos: 423, icon: '⭐', color: '#00ff88' }
    ];
    
    const totalVotantes = 156;
    const totalVotos = 1245;
    const masVotado = ganadores.reduce((a, b) => a.votos > b.votos ? a : b);

    function renderFrame(progress, frame) {
      const root = document.getElementById('root');
      if (!root) return;

      // Fondo animado
      const bgGrad = `radial-gradient(ellipse at center, #1a0a2e 0%, #000000 100%)`;
      
      // Renderizar contenido según frame
      let html = `<div style="width:1920px;height:1080px;background:${bgGrad};position:relative;overflow:hidden;">`;

      // Efecto láser animado
      const laserX = (frame * 3) % 1920;
      html += `<div style="position:absolute;top:0;left:${laserX}px;width:4px;height:1080px;background:linear-gradient(to bottom,transparent,#ff00ff,#00ffff,transparent);box-shadow:0 0 20px #ff00ff;opacity:0.7;"></div>`;
      html += `<div style="position:absolute;top:0;right:${(frame * 2) % 1920}px;width:3px;height:1080px;background:linear-gradient(to bottom,transparent,#00ff88,#ff00ff,transparent);box-shadow:0 0 15px #00ff88;opacity:0.6;"></div>`;

      // Título principal (frames 0-60)
      if (frame < 60) {
        const titleOpacity = Math.min(frame / 30, 1);
        html += `<div style="position:absolute;top:10%;left:50%;transform:translateX(-50%);text-align:center;opacity:${titleOpacity}">
          <h1 style="font-size:80px;font-weight:bold;background:linear-gradient(90deg,#ff00ff,#00ffff,#ffff00);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:0 0 40px rgba(255,0,255,0.8);margin:0;">🏆 MANIJA AWARDS 2026 🏆</h1>
          <p style="font-size:36px;color:#fff;text-shadow:0 0 20px rgba(255,255,255,0.8);margin:20px 0;">🌟 CONCLUSIÓN DE LA VOTACIÓN 🌟</p>
        </div>`;
      }

      // Campeón Absoluto (frames 60-150)
      if (frame >= 60 && frame < 150) {
        const champOpacity = Math.min((frame - 60) / 30, 1);
        const floatY = Math.sin(frame * 0.1) * 20;
        html += `<div style="position:absolute;top:25%;left:50%;transform:translateX(-50%);text-align:center;opacity:${champOpacity}">
          <div style="font-size:120px;margin-bottom:20px;animation:pulse 2s infinite;">⚡</div>
          <h2 style="font-size:48px;color:#ffff00;text-shadow:0 0 30px #ffff00;margin:10px 0;">🏆 GANADOR ABSOLUTO 🏆</h2>
          <h3 style="font-size:64px;color:#fff;text-shadow:0 0 40px #ff00ff;margin:20px 0;font-weight:bold;">${masVotado.ganador}</h3>
          <p style="font-size:32px;color:#00ffff;text-shadow:0 0 20px #00ffff;">🎯 ${masVotado.cat}</p>
          <div style="font-size:40px;color:#ff00ff;margin-top:20px;animation:pulse 1s infinite;">⚡ ${masVotado.votos} VOTOS ⚡</div>
        </div>`;
      }

      // Indicadores (frames 150-210)
      if (frame >= 150 && frame < 210) {
        const statsOpacity = Math.min((frame - 150) / 30, 1);
        html += `<div style="position:absolute;top:55%;left:50%;transform:translateX(-50%);display:flex;gap:40px;opacity:${statsOpacity}">
          <div style="text-align:center;padding:20px;background:rgba(255,0,255,0.2);border:2px solid #ff00ff;border-radius:20px;box-shadow:0 0 30px rgba(255,0,255,0.5);">
            <div style="font-size:48px;color:#ff00ff;">👥</div>
            <div style="font-size:36px;color:#fff;font-weight:bold;">${totalVotantes}</div>
            <div style="font-size:18px;color:#ccc;">PARTICIPANTES</div>
          </div>
          <div style="text-align:center;padding:20px;background:rgba(0,255,255,0.2);border:2px solid #00ffff;border-radius:20px;box-shadow:0 0 30px rgba(0,255,255,0.5);">
            <div style="font-size:48px;color:#00ffff;">🗳️</div>
            <div style="font-size:36px;color:#fff;font-weight:bold;">${totalVotos}</div>
            <div style="font-size:18px;color:#ccc;">VOTOS TOTALES</div>
          </div>
          <div style="text-align:center;padding:20px;background:rgba(255,255,0,0.2);border:2px solid #ffff00;border-radius:20px;box-shadow:0 0 30px rgba(255,255,0,0.5);">
            <div style="font-size:48px;color:#ffff00;">🏆</div>
            <div style="font-size:24px;color:#fff;font-weight:bold;">4 CATEGORÍAS</div>
            <div style="font-size:18px;color:#ccc;">PREMIADAS</div>
          </div>
        </div>`;
      }

      // Ganadores por categoría (frames 210-270)
      if (frame >= 210) {
        const winnersOpacity = Math.min((frame - 210) / 30, 1);
        html += `<div style="position:absolute;bottom:5%;left:50%;transform:translateX(-50%);width:80%;opacity:${winnersOpacity}">
          <h3 style="font-size:36px;color:#fff;text-align:center;text-shadow:0 0 20px rgba(255,255,255,0.5);margin-bottom:30px;">🎉 FELICITACIONES A LOS GANADORES 🎉</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
            ${ganadores.map(g => `
              <div style="background:rgba(255,255,255,0.1);border:2px solid ${g.color};border-radius:15px;padding:20px;text-align:center;box-shadow:0 0 20px ${g.color}44;">
                <div style="font-size:40px;margin-bottom:10px;">${g.icon}</div>
                <h4 style="font-size:24px;color:${g.color};margin:10px 0;">${g.cat}</h4>
                <p style="font-size:28px;color:#00ffff;font-weight:bold;">${g.ganador}</p>
                <p style="font-size:20px;color:#ffff00;margin-top:10px;">⚡ ${g.votos} VOTOS ⚡</p>
              </div>
            `).join('')}
          </div>
        </div>`;
      }

      // Mensaje final (frames 270-300)
      if (frame >= 270) {
        const finalOpacity = Math.min((frame - 270) / 15, 1);
        html += `<div style="position:absolute;bottom:2%;left:50%;transform:translateX(-50%);text-align:center;opacity:${finalOpacity}">
          <p style="font-size:28px;color:#00ff88;text-shadow:0 0 20px #00ff88;animation:glow 2s infinite alternate;">🌟 LA NOCHE ES NUESTRA 🌟</p>
          <p style="font-size:20px;color:#fff;margin-top:10px;">¡¡¡HASTA EL PRÓXIMO AÑO!!! ⚡🎉</p>
        </div>`;
      }

      html += `</div><style>
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
        @keyframes glow { from{filter:drop-shadow(0 0 20px currentColor)} to{filter:drop-shadow(0 0 40px currentColor)} }
      </style>`;
      
      root.innerHTML = html;
    }

    // Initial render
    renderFrame(0, 0);
  </script>
</body>
</html>
`;

writeFileSync(resolve(__dirname, 'hyperframes', 'conclusion_composition.html'), htmlContent);
console.log('✅ Composition HTML generated');
console.log('⏯️  To render, serve this file and access via hyperframes');
