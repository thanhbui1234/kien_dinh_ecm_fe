export function getMapsEmbedSrc(addressOrIframe: string): string {
  if (!addressOrIframe) return '';
  
  // Trường hợp 1: Dán nguyên thẻ <iframe src="...">
  const match = addressOrIframe.match(/src=["']([^"']+)["']/);
  if (match && match[1]) {
    return match[1];
  }

  // Trường hợp 2: Dán trực tiếp đường link embed https://www.google.com/maps/embed?...
  if (addressOrIframe.startsWith('http://') || addressOrIframe.startsWith('https://')) {
    return addressOrIframe;
  }

  // Trường hợp 3: Chuỗi địa chỉ văn bản thường
  return `https://www.google.com/maps?q=${encodeURIComponent(addressOrIframe)}&output=embed`;
}

export function getMapsDirectionsHref(address: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}
