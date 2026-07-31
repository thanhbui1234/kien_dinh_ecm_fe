// Accepts watch?v=, youtu.be/, embed/, shorts/ links, with or without extra
// query params (?si=, &list=, &t=...) — admins paste whatever YouTube gives them.
export function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}
