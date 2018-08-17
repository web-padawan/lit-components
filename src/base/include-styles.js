export async function includeStyles(id) {
  const theme = `${id}-styles`;
  if (!customElements.get(theme)) {
    await customElements.whenDefined(theme);
  }
  return customElements.get(theme).styles;
}
