const { writeFileSync, mkdirSync } = require('fs');
const { resolve } = require('path');

mkdirSync(resolve(__dirname, '..', '..', 'public', 'renders'), { recursive: true });

// 🎬 Hyperframes Composition - Manija Awards 2026 Conclusion
// Este archivo HTML se renderiza con `npx hyperframes render`
// Requiere: data-composition-id, data-width, data-height, window.__timelines

const html = `<!DOCTYPE html>
<html lang="es" data-composition-id="manija-conclusion" data-width="1920" data-height="1080">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manija Awards 2026 - Conclusión</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000; overflow: hidden; font-family: 'Arial Black', Arial, sans-serif; }
    canvas { display: block; }
    @keyframes laserPulse {
      0%, 100% { opacity: 0.5; transform: scaleY(1); }
      50% { opacity: 1; transform: scaleY(1.05); }
    }
    @keyframes glowText {
      from { filter: drop-shadow(0 0 10px currentColor); }
      to { filter: drop-shadow(0 0 30px currentColor) drop-shadow(0 0 50px currentColor); }
    }
    @keyframes floatUp {
      0% { transform: translateY(0) scale(0.8); opacity: 0; }
      50% { transform: translateY(-20px) scale(1.05); opacity: 1; }
      100% { transform: translateY(-40px) scale(1); opacity: 0.8; }
    }
    @keyframes confettiFall {
      0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
      100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
    }
    @keyframes starBurst {
      0% { transform: scale(0) rotate(0deg); opacity: 1; }
      50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
      100% { transform: scale(0) rotate(360deg); opacity: 0; }
    }
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
    // ── Hyperframes Timeline Registration ──
    window.__timelines = window.__timelines || {};
    window.__timelines['manija-conclusion'] = {
      duration: 300, // 10 segundos @ 30fps
      fps: 30,
      layers: ['background', 'lasers', 'title', 'champion', 'stats', 'winners', 'final']
    };

    // ── Render Frame Function ──
    window.__hf = {
      duration: 300,
      seek: function(frame) { renderFrame(frame); }
    };

    // ── Datos Reales de la Votación ──
    const data = {
      ganadores: [
        { cat: 'Mejor Director', nom: 'Director A', votos: 342, icon: '🎬', cor: '#ff00ff' },
        { cat: 'Mejor Actor', nom: 'Actor X', votos: 289, icon: '🏆', cor: '#00ffff' },
        { cat: 'Mejor Actriz', nom: 'Actriz M', votos: 356, icon: '👑', cor: '#ffff00' },
        { cat: 'Mejor Película', nom: 'Accion Total', votos: 423, icon: '⭐', cor: '#00ff88' }
      ],
      totalVotantes: 156,
      totalVotos: 1245,
      campeon: { nom: 'Accion Total', votos: 423, cat: 'Mejor Película' }
    };

    function renderFrame(f) {
      const app = document.getElementById('app');
      if (!app) return;

      // ── Background Gradient ──
      let h = '<div style="width:1920px;height:1080px;background:radial-gradient(ellipse at 50% 40%, #1a0a2e 0%, #000 70%);position:relative;overflow:hidden;">';

      // ── Animated Laser Rays ──
      const lx = (f * 2.5) % 1920;
      const rx = (f * 1.8) % 1920;
      h += '<div style="position:absolute;top:0;left:' + lx + 'px;width:6px;height:1080px;background:linear-gradient(to bottom,transparent,#ff00ff 20%,#00ffff 50%,#ff00ff 80%,transparent);box-shadow:0 0 30px #ff00ff, inset 0 0 10px #ff00ff;animation:laserPulse 1.5s ease-in-out infinite;opacity:0.7;"></div>';
      h += '<div style="position:absolute;top:0;right:-' + rx + 'px;width:4px;height:1080px;background:linear-gradient(to bottom,transparent,#00ff88 20%,#ff00ff 50%,#00ffff 80%,transparent);box-shadow:0 0 20px #00ff88;animation:laserPulse 2s ease-in-out infinite 0.5s;opacity:0.6;"></div>';

      // ── Floating Particles ──
      for (let i = 0; i < 40; i++) {
        const px = (Math.sin(f * 0.02 + i * 2.7) * 400 + 960) % 1920;
        const py = (f * 1.5 + i * 27) % 1080;
        const sz = (Math.sin(f * 0.1 + i) + 1) * 2 + 1;
        h += '<div style="position:absolute;left:' + px + 'px;top:' + py + 'px;width:' + sz + 'px;height:' + sz + 'px;background:#fff;border-radius:50%;box-shadow:0 0 ' + (sz * 3) + 'px #fff;opacity:0.4;"></div>';
      }

      // ── Frame 0-40: Epic Intro ──
      if (f < 40) {
        const alpha = Math.min(f / 20, 1);
        h += '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;opacity:' + alpha + '">';
        h += '<div style="font-size:120px;animation:starBurst 2s ease-out infinite;">🌟</div>';
        h += '<h1 style="font-size:90px;background:linear-gradient(90deg,#ff00ff,#00ffff,#ffff00);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none;margin:20px 0;animation:glowText 2s ease-in-out infinite alternate;">🏆 MANIJA AWARDS 2026 🏆</h1>';
        h += '<p style="font-size:48px;color:#fff;text-shadow:0 0 30px rgba(255,255,255,0.8);margin-top:20px;">🌟 CONCLUSIÓN DE LA VOTACIÓN 🌟</p>';
        h += '</div>';
      }

      // ── Frame 40-120: Campeón Absoluto ⚡ ──
      if (f >= 40 && f < 120) {
        const alpha = Math.min((f - 40) / 30, 1);
        const floatY = Math.sin(f * 0.08) * 15;
        h += '<div style="position:absolute;top:200px;left:50%;transform:translateX(-50%);text-align:center;opacity:' + alpha + '">';
        h += '<div style="font-size:140px;margin-bottom:10px;animation:starBurst 1.5s ease-in-out infinite;">⚡</div>';
        h += '<h2 style="font-size:56px;color:#ffff00;text-shadow:0 0 40px #ffff00;margin:10px 0;animation:glowText 1.5s ease-in-out infinite alternate;">🏆 GANADOR ABSOLUTO 🏆</h2>';
        h += '<h3 style="font-size:88px;color:#fff;text-shadow:0 0 50px #ff00ff, 0 0 80px #ff00ff;font-weight:bold;margin:30px 0;transform:translateY(' + floatY + 'px);">' + data.campeon.nom + '</h3>';
        h += '<p style="font-size:40px;color:#00ffff;text-shadow:0 0 25px #00ffff;">🎯 ' + data.campeon.cat + '</p>';
        h += '<div style="font-size:48px;color:#ff00ff;margin-top:20px;font-weight:bold;animation:glowText 1s ease-in-out infinite alternate;">⚡ ' + data.campeon.votos + ' VOTOS ⚡</div>';
        h += '</div>';
      }

      // ── Frame 120-180: Principales Indicadores 📊 ──
      if (f >= 120 && f < 180) {
        const alpha = Math.min((f - 120) / 30, 1);
        h += '<div style="position:absolute;top:380px;left:50%;transform:translateX(-50%);display:flex;gap:30px;opacity:' + alpha + '">';
        // Participantes
        h += '<div style="text-align:center;padding:25px 30px;background:rgba(255,0,255,0.15);border:3px solid #ff00ff;border-radius:20px;box-shadow:0 0 35px rgba(255,0,255,0.3);min-width:220px;">';
        h += '<div style="font-size:64px;color:#ff00ff;margin-bottom:10px;">👥</div>';
        h += '<div style="font-size:52px;color:#fff;font-weight:bold;">' + data.totalVotantes + '</div>';
        h += '<div style="font-size:20px;color:#ccc;margin-top:5px;">PARTICIPANTES</div>';
        h += '</div>';
        // Votos Totales
        h += '<div style="text-align:center;padding:25px 30px;background:rgba(0,255,255,0.15);border:3px solid #00ffff;border-radius:20px;box-shadow:0 0 35px rgba(0,255,255,0.3);min-width:220px;">';
        h += '<div style="font-size:64px;color:#00ffff;margin-bottom:10px;">🗳️</div>';
        h += '<div style="font-size:52px;color:#fff;font-weight:bold;">' + data.totalVotos.toLocaleString() + '</div>';
        h += '<div style="font-size:20px;color:#ccc;margin-top:5px;">VOTOS TOTALES</div>';
        h += '</div>';
        // Categorías
        h += '<div style="text-align:center;padding:25px 30px;background:rgba(255,255,0,0.15);border:3px solid #ffff00;border-radius:20px;box-shadow:0 0 35px rgba(255,255,0,0.3);min-width:220px;">';
        h += '<div style="font-size:64px;color:#ffff00;margin-bottom:10px;">🏆</div>';
        h += '<div style="font-size:52px;color:#fff;font-weight:bold;">4</div>';
        h += '<div style="font-size:20px;color:#ccc;margin-top:5px;">CATEGORÍAS</div>';
        h += '</div>';
        h += '</div>';
      }

      // ── Frame 180-260: Todos los Ganadores 🎉 ──
      if (f >= 180 && f < 260) {
        const alpha = Math.min((f - 180) / 30, 1);
        h += '<div style="position:absolute;bottom:60px;left:50%;transform:translateX(-50%);width:1600px;opacity:' + alpha + '">';
        h += '<h3 style="font-size:44px;color:#fff;text-align:center;text-shadow:0 0 30px rgba(255,215,0,0.8);margin-bottom:30px;animation:glowText 2s infinite alternate;">🎉 FELICITACIONES A LOS GANADORES 🎉</h3>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">';
        data.ganadores.forEach(function(g) {
          h += '<div style="background:rgba(255,255,255,0.1);border:3px solid ' + g.cor + ';border-radius:16px;padding:20px;text-align:center;box-shadow:0 0 25px ' + g.cor + '44;transition:transform 0.3s;">';
          h += '<div style="font-size:56px;margin-bottom:8px;">' + g.icon + '</div>';
          h += '<div style="font-size:22px;color:' + g.cor + ';font-weight:bold;margin:5px 0;">' + g.cat + '</div>';
          h += '<div style="font-size:28px;color:#00ffff;font-weight:bold;">' + g.nom + '</div>';
          h += '<div style="font-size:18px;color:#ffff00;margin-top:8px;">⚡ ' + g.votos + ' VOTOS ⚡</div>';
          h += '</div>';
        });
        h += '</div></div>';
      }

      // ── Frame 260-300: Mensaje Final ✨ ──
      if (f >= 260) {
        const alpha = Math.min((f - 260) / 20, 1);
        h += '<div style="position:absolute;bottom:30px;left:50%;transform:translateX(-50%);text-align:center;opacity:' + alpha + '">';
        h += '<p style="font-size:36px;color:#00ff88;text-shadow:0 0 30px #00ff88;animation:glowText 1s infinite alternate;font-weight:bold;">🌟 LA NOCHE ES NUESTRA 🌟</p>';
        h += '<p style="font-size:24px;color:#fff;margin-top:10px;">¡¡¡HASTA EL PRÓXIMO AÑO!!! ⚡🎉</p>';
        h += '</div>';
      }

      h += '</div></body></html>';
      app.innerHTML = h;
    }

    // Inicializar frame 0
    renderFrame(0);
  </script>
</body>
</html>`;

writeFileSync(resolve(__dirname, '..', '..', 'public', 'renders', 'manija-conclusion.html'), html);
console.log('✅ Composition HTML generated at: public/renders/manija-conclusion.html');
console.log('⚙️  To render video, run: npx hyperframes render --input public/renders/manija-conclusion.html --output public/renders/manija-conclusion.mp4 --width 1920 --height 1080 --fps 30 --concurrency 4');
