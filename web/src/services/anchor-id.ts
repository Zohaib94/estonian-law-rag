// "TLS § 97" -> "TLS§97": the id of a section's list item, which the answer's citations link to.
// An id can't contain spaces, and the act code keeps the same number in two acts apart.
export function anchorId(ref: string): string {
  return ref.replaceAll(' ', '');
}
