const W = '#ffffff', K = '#4a1f33', G = '#d9a441'

// Drawn product illustrations. Swap any of them for a real photo by adding public/images/<id>.jpg
export default function Art({ kind, color = '#ff8fb4' }) {
  let s = null
  switch (kind) {
    case 'dress':
      s = (<><path d="M38 12 L44 12 L50 24 L56 12 L62 12 L65 42 L82 92 H18 L35 42Z" fill={color} /><path d="M35 42 H65" stroke={W} strokeWidth="3" opacity=".6" /><path d="M50 24 V92" stroke={W} strokeWidth="1.5" opacity=".35" /></>)
      break
    case 'top':
      s = (<><path d="M34 12 L42 12 Q50 26 58 12 L66 12 L70 30 L64 34 V88 H36 V34 L30 30Z" fill={color} /><path d="M36 40 H64" stroke={W} strokeWidth="2" opacity=".5" /><path d="M36 52 H64" stroke={W} strokeWidth="2" opacity=".5" /></>)
      break
    case 'skirt':
      s = (<><path d="M34 20 H66 L84 88 H16Z" fill={color} /><rect x="34" y="16" width="32" height="8" rx="2" fill={K} opacity=".75" />{[34, 42, 50, 58, 66].map((x) => <path key={x} d={`M${x} 26 L${x + (x - 50) * 0.5} 88`} stroke={W} strokeWidth="1.5" opacity=".4" />)}</>)
      break
    case 'cardigan':
      s = (<><path d="M30 14 L44 18 L50 28 L56 18 L70 14 L90 36 L80 48 L72 42 V90 H28 V42 L20 48 L10 36Z" fill={color} /><path d="M50 28 V90" stroke={W} strokeWidth="2" opacity=".6" />{[42, 54, 66, 78].map((y) => <circle key={y} cx="46" cy={y} r="2" fill={W} />)}</>)
      break
    case 'heels':
      s = (<path d="M14 30 Q24 26 32 42 L62 56 Q78 62 88 52 L90 62 Q82 72 62 70 L36 60 L30 90 H25 L25 58 Q10 48 14 30Z" fill={color} />)
      break
    case 'sandals':
      s = (<><path d="M12 64 H76 Q88 64 88 72 V78 H80 V92 H62 V78 H12Z" fill={color} /><path d="M24 64 Q42 36 64 64" stroke={W} strokeWidth="6" fill="none" strokeLinecap="round" /><path d="M24 64 Q18 50 30 44" stroke={W} strokeWidth="5" fill="none" strokeLinecap="round" /></>)
      break
    case 'flats':
      s = (<><path d="M16 58 Q16 38 38 38 H70 Q90 38 90 58 Q90 74 70 74 H36 Q16 74 16 58Z" fill={color} /><path d="M40 52 Q62 44 82 54 Q70 64 50 62Z" fill={K} opacity=".25" /><circle cx="34" cy="56" r="6" fill={W} /></>)
      break
    case 'sneakers':
      s = (<><path d="M10 64 Q10 46 26 44 L40 36 Q46 34 52 42 L58 50 Q76 52 90 62 V74 H10Z" fill={W} stroke={color} strokeWidth="3" /><rect x="10" y="70" width="80" height="10" rx="4" fill={color} /><path d="M44 42 L50 50 M38 46 L44 54" stroke={color} strokeWidth="3" strokeLinecap="round" /></>)
      break
    case 'lipstick':
      s = (<><path d="M42 30 L50 20 L58 34 V54 H42Z" fill={color} /><rect x="38" y="52" width="24" height="10" rx="2" fill={G} /><rect x="40" y="60" width="20" height="30" rx="3" fill={K} /></>)
      break
    case 'palette':
      s = (<><rect x="14" y="24" width="72" height="52" rx="8" fill={K} />{[[32, 42], [50, 42], [68, 42], [32, 60], [50, 60], [68, 60]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="8" fill={i % 2 ? color : W} opacity={i % 3 === 0 ? 1 : 0.85} />)}</>)
      break
    case 'polish':
      s = (<><rect x="44" y="12" width="12" height="32" rx="3" fill={K} /><path d="M36 44 H64 V82 Q64 90 56 90 H44 Q36 90 36 82Z" fill={color} /><rect x="40" y="52" width="6" height="26" rx="3" fill={W} opacity=".4" /></>)
      break
    case 'foundation':
      s = (<><path d="M44 16 H62 V22 H50 V30 H46Z" fill={K} /><rect x="46" y="28" width="8" height="12" fill={G} /><rect x="36" y="38" width="28" height="52" rx="5" fill={color} /><rect x="40" y="48" width="20" height="14" rx="2" fill={W} opacity=".7" /></>)
      break
    case 'handbag':
      s = (<><path d="M32 44 Q32 16 50 16 Q68 16 68 44" stroke={K} strokeWidth="5" fill="none" /><path d="M18 44 H82 L88 90 H12Z" fill={color} /><rect x="44" y="52" width="12" height="9" rx="2" fill={G} /></>)
      break
    case 'crossbody':
      s = (<><path d="M24 50 Q30 6 76 50" stroke={K} strokeWidth="3" fill="none" /><rect x="20" y="48" width="60" height="38" rx="8" fill={color} /><path d="M20 62 H80" stroke={W} strokeWidth="2" opacity=".6" /><circle cx="50" cy="62" r="4" fill={G} /></>)
      break
    case 'perfume':
      s = (<><rect x="40" y="14" width="20" height="20" rx="3" fill={G} /><rect x="44" y="32" width="12" height="10" fill={K} /><path d="M28 42 H72 V84 Q72 92 64 92 H36 Q28 92 28 84Z" fill={color} /><circle cx="50" cy="66" r="9" fill={W} opacity=".55" /></>)
      break
    case 'necklace':
      s = (<><path d="M20 18 Q50 92 80 18" stroke={G} strokeWidth="3" fill="none" />{[0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8].map((t, i) => { const x = 20 + 60 * t; const y = 18 + 4 * (t - 0.5) * (t - 0.5) * -1 + 74 * (1 - 4 * (t - 0.5) * (t - 0.5)) * 0.5; return <circle key={i} cx={x} cy={y} r="3.2" fill={W} stroke={color} strokeWidth="1" /> })}<circle cx="50" cy="66" r="7" fill={color} stroke={G} strokeWidth="2" /></>)
      break
    case 'scarf':
      s = (<><path d="M14 22 Q40 8 60 24 Q80 40 86 20 L90 66 Q70 84 50 68 Q30 52 12 82Z" fill={color} /><path d="M20 34 Q40 22 56 36 Q72 50 84 36" stroke={W} strokeWidth="3" fill="none" opacity=".6" /></>)
      break
    case 'watch':
      s = (<><rect x="38" y="6" width="24" height="30" rx="4" fill={K} /><rect x="38" y="64" width="24" height="30" rx="4" fill={K} /><circle cx="50" cy="50" r="22" fill={G} /><circle cx="50" cy="50" r="17" fill={W} /><path d="M50 50 V38 M50 50 L58 54" stroke={K} strokeWidth="2.5" strokeLinecap="round" /></>)
      break
    case 'sunglasses':
      s = (<><path d="M10 38 H46 Q46 66 28 66 Q10 66 10 38Z" fill={K} /><path d="M54 38 H90 Q90 66 72 66 Q54 66 54 38Z" fill={K} /><path d="M46 42 Q50 38 54 42" stroke={K} strokeWidth="3" fill="none" /><path d="M16 44 H26" stroke={color} strokeWidth="3" strokeLinecap="round" /><path d="M60 44 H70" stroke={color} strokeWidth="3" strokeLinecap="round" /></>)
      break
    case 'clip':
      s = (<><path d="M20 40 H80 Q86 40 86 46 V60 Q86 66 80 66 H20 Q14 66 14 60 V46 Q14 40 20 40Z" fill={color} />{[24, 34, 44, 54, 64, 74].map((x) => <path key={x} d={`M${x} 40 V30`} stroke={color} strokeWidth="5" strokeLinecap="round" />)}</>)
      break
    default:
      s = <circle cx="50" cy="50" r="30" fill={color} />
  }
  return <svg className="art" viewBox="0 0 100 100" aria-hidden="true">{s}</svg>
}
