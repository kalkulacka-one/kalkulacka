const PAGE_TITLE_SEPARATOR = " · ";

export function prefixPageTitle(pageTitle: string, title: string): string {
  return `${pageTitle}${PAGE_TITLE_SEPARATOR}${title}`;
}

export function replacePageTitle(title: string, pageTitle: string): string {
  const separatorIndex = title.indexOf(PAGE_TITLE_SEPARATOR);
  if (separatorIndex === -1) {
    return title;
  }
  return prefixPageTitle(pageTitle, title.slice(separatorIndex + PAGE_TITLE_SEPARATOR.length));
}
