export function createPalette(value: string) {
  const hash = Array.from(value).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const hueA = hash % 360;
  const hueB = (hueA + 70 + (hash % 11) * 7) % 360;
  const hueC = (hueA + 190) % 360;

  return {
    start: `hsl(${hueA} 78% 58%)`,
    mid: `hsl(${hueB} 70% 44%)`,
    end: `hsl(${hueC} 72% 24%)`,
    glow: `hsl(${(hueB + 30) % 360} 90% 72%)`,
  };
}
