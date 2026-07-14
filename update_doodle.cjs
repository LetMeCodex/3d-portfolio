const fs = require('fs');
let code = fs.readFileSync('src/components/ui/HandDrawnDoodle.tsx', 'utf-8');

// Update DoodleType
code = code.replace(
  /type DoodleType = (.*?);/,
  "type DoodleType = $1 | 'burst' | 'spring' | 'zig-zag' | 'crown' | 'loop' | 'heart';"
);

// Add viewportConfig
code = code.replace(
  /const drawTransition = \{/,
  `const viewportConfig = { once: true, margin: "200px" };\n\n  const drawTransition = {`
);

// Add viewport={viewportConfig} to all whileInView instances
code = code.replace(/whileInView=\{drawTransition\}/g, 'whileInView={drawTransition} viewport={viewportConfig}');
code = code.replace(/whileInView=\{\{ scale: 1, opacity: 1 \}\}/g, 'whileInView={{ scale: 1, opacity: 1 }} viewport={viewportConfig}');
code = code.replace(/whileInView=\{\{ opacity: 1, y: 0 \}\}/g, 'whileInView={{ opacity: 1, y: 0 }} viewport={viewportConfig}');
code = code.replace(/whileInView=\{\{ pathLength: 1, opacity: 0\.6 \}\}/g, 'whileInView={{ pathLength: 1, opacity: 0.6 }} viewport={viewportConfig}');
code = code.replace(/whileInView=\{\{ opacity: 1, scale: 1, transition: \{ delay \} \}\}/g, 'whileInView={{ opacity: 1, scale: 1, transition: { delay } }} viewport={viewportConfig}');
code = code.replace(/whileInView=\{\{ pathLength: 1 \}\}/g, 'whileInView={{ pathLength: 1 }} viewport={viewportConfig}');

// Add new cases before default:
const newCases = `
      case 'burst':
        return (
          <motion.svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <motion.path d="M50 10 L50 30 M50 90 L50 70 M10 50 L30 50 M90 50 L70 50 M20 20 L35 35 M80 80 L65 65 M20 80 L35 65 M80 20 L65 35" stroke={color} strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} whileInView={drawTransition} viewport={viewportConfig} animate={wiggleTransition} />
          </motion.svg>
        );
      case 'spring':
        return (
          <motion.svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <motion.path d="M10 50 C 10 20, 30 20, 30 50 C 30 80, 50 80, 50 50 C 50 20, 70 20, 70 50 C 70 80, 90 80, 90 50" stroke={color} strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} whileInView={drawTransition} viewport={viewportConfig} animate={wiggleTransition} />
          </motion.svg>
        );
      case 'zig-zag':
        return (
          <motion.svg viewBox="0 0 100 40" className="w-full h-full" fill="none">
            <motion.path d="M5 20 L20 5 L35 35 L50 5 L65 35 L80 5 L95 20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0, opacity: 0 }} whileInView={drawTransition} viewport={viewportConfig} animate={wiggleTransition} />
          </motion.svg>
        );
      case 'crown':
        return (
          <motion.svg viewBox="0 0 100 80" className="w-full h-full" fill="none">
            <motion.path d="M10 60 L15 20 L35 40 L50 10 L65 40 L85 20 L90 60 Z" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0, opacity: 0 }} whileInView={drawTransition} viewport={viewportConfig} animate={wiggleTransition} />
            <motion.circle cx="15" cy="15" r="3" fill={color} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewportConfig} transition={{ delay: delay + 0.5 }} />
            <motion.circle cx="50" cy="5" r="4" fill={color} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewportConfig} transition={{ delay: delay + 0.5 }} />
            <motion.circle cx="85" cy="15" r="3" fill={color} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewportConfig} transition={{ delay: delay + 0.5 }} />
          </motion.svg>
        );
      case 'loop':
        return (
          <motion.svg viewBox="0 0 100 60" className="w-full h-full" fill="none">
            <motion.path d="M10 40 C 30 10, 70 10, 50 40 C 30 70, 70 70, 90 40" stroke={color} strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} whileInView={drawTransition} viewport={viewportConfig} animate={wiggleTransition} />
          </motion.svg>
        );
      case 'heart':
        return (
          <motion.svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <motion.path d="M50 80 C 20 50, 10 30, 25 15 C 40 0, 50 20, 50 20 C 50 20, 60 0, 75 15 C 90 30, 80 50, 50 80 Z" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0, opacity: 0 }} whileInView={drawTransition} viewport={viewportConfig} animate={wiggleTransition} />
          </motion.svg>
        );
`;

code = code.replace(/default:/, newCases + '\n      default:');

fs.writeFileSync('src/components/ui/HandDrawnDoodle.tsx', code);
console.log('HandDrawnDoodle.tsx updated successfully');
