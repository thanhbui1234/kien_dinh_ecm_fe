export type BgOption = 'none' | 'transparent' | 'cloudinary_white';

// Carries the user's chosen AI background-removal option alongside a pending
// (not-yet-uploaded) File, without changing the `string | File` value contract
// used throughout form state. Keyed by File identity so it's naturally
// garbage-collected once the file is replaced or the form unmounts.
const bgOptionByFile = new WeakMap<File, BgOption>();

export function setFileBgOption(file: File, option: BgOption) {
  bgOptionByFile.set(file, option);
}

export function getFileBgOption(file: File): BgOption {
  return bgOptionByFile.get(file) ?? 'none';
}
