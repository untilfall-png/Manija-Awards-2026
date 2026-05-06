const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, 'public', 'renders');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const html = `<!DOCTYPE html>
<html lang="es" data-composition-id="manija-conclusion" data-width="1920" data-height="1080">
<head>
<meta charset="UTF-8">
<style>
*{margin:0;padding:0;box-sizing:border-box}body{background:#000;overflow:hidden;font-family:Arial Black,Arial,sans-serif}
@keyframes lp{0%,100%{opacity:.5;transform:scaleY(1)}50%{opacity:1;transform:scaleY(1.05)}}
@keyframes gt{from{filter:drop-shadow(0 0 10px currentColor)}to{filter:drop-shadow(0 0 30px currentColor) drop-shadow(0 0 50px currentColor)}}
@keyframes sb{0%{transform:scale(0) rotate(0);opacity:1}100%{transform:scale(0) rotate(360deg);opacity:0}}
@keyframes cf{0%{transform:translateY(-10vh) rotate(0);opacity:1}100%{transform:translateY(110vh) rotate(720deg);opacity:0}}
</style>
</head>
<body>
<div id="a"></div>
<script>
window.__timelines=window.__timelines||{};
window.__timelines['manija-conclusion']={duration:300,fps:30,layers:['bg','laser','title','champ','stats','winners','final']};
window.__hf={duration:300,seek:function(f){r(f)}};
const d={g:[{c:'Mejor Director',n:'Director A',v:342,i:'🎬',cr:'#ff00ff'},{c:'Mejor Actor',n:'Actor X',v:289,i:'🏆',cr:'#00ffff'},{c:'Mejor Actriz',n:'Actriz M',v:356,i:'👑',cr:'#ffff00'},{c:'Mejor Pelicula',n:'Accion Total',v:423,i:'⭐',cr:'#00ff88'}],tv:156,tv2:1245,ch:{n:'Accion Total',v:423,c:'Mejor Pelicula'}};
function r(f){var a=document.getElementById('a');if(!a)return;var y=(f*2.5)%1920,x=(f*1.8)%1920,h='<div style="width:1920px;height:1080px;background:radial-gradient(ellipse at 50% 40%,#1a0a2e 0%,#000 70%);position:relative;overflow:hidden;">';
h+='<div style="position:absolute;top:0;left:'+y+'px;width:6px;height:1080px;background:linear-gradient(to bottom,transparent,#ff00ff 20%,#00ffff 50%,#ff00ff 80%,transparent);box-shadow:0 0 30px #ff00ff,inset 0 0 10px #ff00ff;animation:lp 1.5s ease-in-out infinite;opacity:.7;"></div>';
h+='<div style="position:absolute;top:0;right:-'+x+'px;width:4px;height:1080px;background:linear-gradient(to bottom,transparent,#00ff88 20%,#ff00ff 50%,#00ffff 80%,transparent);box-shadow:0 0 20px #00ff88;animation:lp 2s ease-in-out infinite .5s;opacity:.6;"></div>';
for(var z=0;z<40;z++){var _x=(Math.sin(f*0.02+z*2.7)*400+960)%1920,_y=(f*1.5+z*27)%1080,sz=(Math.sin(f*0.1+z)+1)*2+1;h+='<div style="position:absolute;left:'+_x+'px;top:'+_y+'px;width:'+sz+'px;height:'+sz+'px;background:#fff;border-radius:50%;box-shadow:0 0 '+(sz*3)+'px #fff;opacity:.4;"></div>';}
if(f<40){var al=Math.min(f/20,1);h+='<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;opacity:'+al+'"><div style="font-size:120px;animation:sb 2s ease-out infinite">🌟</div><h1 style="font-size:90px;background:linear-gradient(90deg,#ff00ff,#00ffff,#ffff00);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none;margin:20px 0;animation:gt 2s ease-in-out infinite alternate">🏆 MANIJA AWARDS 2026 🏆</h1><p style="font-size:48px;color:#fff;text-shadow:0 0 30px rgba(255,255,255,.8);margin-top:20px">🌟 CONCLUSION DE LA VOTACION 🌟</p></div>';}
if(f>=40&&f<120){var al=Math.min((f-40)/30,1),fy=Math.sin(f*0.08)*15;h+='<div style="position:absolute;top:200px;left:50%;transform:translateX(-50%);text-align:center;opacity:'+al+'"><div style="font-size:140px;margin-bottom:10px;animation:sb 1.5s ease-in-out infinite">⚡</div><h2 style="font-size:56px;color:#ffff00;text-shadow:0 0 40px #ffff00;margin:10px 0;animation:gt 1.5s ease-in-out infinite alternate">🏆 GANADOR ABSOLUTO 🏆</h2><h3 style="font-size:88px;color:#fff;text-shadow:0 0 50px #ff00ff,0 0 80px #ff00ff;font-weight:bold;margin:30px 0;transform:translateY('+fy+'px)">'+d.ch.n+'</h3><p style="font-size:40px;color:#00ffff;text-shadow:0 0 25px #00ffff">🎯 '+d.ch.c+'</p><div style="font-size:48px;color:#ff00ff;margin-top:20px;font-weight:bold;animation:gt 1s ease-in-out infinite alternate">⚡ '+d.ch.v+' VOTOS ⚡</div></div>';}
if(f>=120&&f<180){var al=Math.min((f-120)/30,1);h+='<div style="position:absolute;top:380px;left:50%;transform:translateX(-50%);display:flex;gap:30px;opacity:'+al+'"><div style="text-align:center;padding:25px 30px;background:rgba(255,0,255,.15);border:3px solid #ff00ff;border-radius:20px;box-shadow:0 0 35px rgba(255,0,255,.3);min-width:220px"><div style="font-size:64px;color:#ff00ff;margin-bottom:10px">👥</div><div style="font-size:52px;color:#fff;font-weight:bold">'+d.tv+'</div><div style="font-size:20px;color:#ccc;margin-top:5px">PARTICIPANTES</div></div><div style="text-align:center;padding:25px 30px;background:rgba(0,255,255,.15);border:3px solid #00ffff;border-radius:20px;box-shadow:0 0 35px rgba(0,255,255,.3);min-width:220px"><div style="font-size:64px;color:#00ffff;margin-bottom:10px">🗳️</div><div style="font-size:52px;color:#fff;font-weight:bold">'+d.tv2.toLocaleString()+'</div><div style="font-size:20px;color:#ccc;margin-top:5px">VOTOS TOTALES</div></div><div style="text-align:center;padding:25px 30px;background:rgba(255,255,0,.15);border:3px solid #ffff00;border-radius:20px;box-shadow:0 0 35px rgba(255,255,0,.3);min-width:220px"><div style="font-size:64px;color:#ffff00;margin-bottom:10px">🏆</div><div style="font-size:52px;color:#fff;font-weight:bold">4</div><div style="font-size:20px;color:#ccc;margin-top:5px">CATEGORIAS</div></div></div>';}
if(f>=180&&f<260){var al=Math.min((f-180)/30,1);h+='<div style="position:absolute;bottom:60px;left:50%;transform:translateX(-50%);width:1600px;opacity:'+al+'"><h3 style="font-size:44px;color:#fff;text-align:center;text-shadow:0 0 30px rgba(255,215,0,.8);margin-bottom:30px;animation:gt 2s infinite alternate">🎉 FELICITACIONES A LOS GANADORES 🎉</h3><div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">';d.g.forEach(function(g){h+='<div style="background:rgba(255,255,255,.1);border:3px solid '+g.cr+';border-radius:16px;padding:20px;text-align:center;box-shadow:0 0 25px '+g.cr+'44"><div style="font-size:56px;margin-bottom:8px">'+g.i+'</div><div style="font-size:22px;color:'+g.cr+';font-weight:bold;margin:5px 0">'+g.c+'</div><div style="font-size:28px;color:#00ffff;font-weight:bold">'+g.n+'</div><div style="font-size:18px;color:#ffff00;margin-top:8px">⚡ '+g.v+' VOTOS ⚡</div></div>';});h+='</div></div>';}
if(f>=260){var al=Math.min((f-260)/20,1);h+='<div style="position:absolute;bottom:30px;left:50%;transform:translateX(-50%);text-align:center;opacity:'+al+'"><p style="font-size:36px;color:#00ff88;text-shadow:0 0 30px #00ff88;animation:gt 1s infinite alternate;font-weight:bold">🌟 LA NOCHE ES NUESTRA 🌟</p><p style="font-size:24px;color:#fff;margin-top:10px">¡¡¡HASTA EL PROXIMO AÑO!!! ⚡🎉</p></div>';}
h+='</div>';
a.innerHTML=h;
}
r(0);
</script>
</body>
</html>`;

const outFile = path.join(outDir, 'manija-conclusion.html');
fs.writeFileSync(outFile, html);
console.log('✅ Hyperframes composition saved to:', outFile);
console.log('⚙️  Render: npx hyperframes render --input', outFile, '--output public/renders/manija-conclusion.mp4 --width 1920 --height 1080 --fps 30 --concurrency 4');
