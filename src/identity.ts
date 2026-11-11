const PREFIXES = ["Operative", "Researcher", "Ranger", "Clearance", "Agent", "Archivist"];

export function randomName(): string {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const number = Math.floor(1000 + Math.random() * 9000);
  return `${prefix} ${number}`;
}