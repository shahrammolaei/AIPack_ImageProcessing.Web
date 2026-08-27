import type { PageDefinition } from './PageDefinition'

export class PageRegistry {
  private pages: PageDefinition[] = []

  public register(page: PageDefinition): void {
    const exists = this.pages.some(
      (item) => item.path === page.path
    )

    if (exists) {
      console.warn(
        `Page with path "${page.path}" is already registered.`
      )
      return
    }

    this.pages.push(page)
  }

  public getPages(): PageDefinition[] {
    return [...this.pages]
  }

  public getPage(path: string): PageDefinition | undefined {
    return this.pages.find(
      (page) => page.path === path
    )
  }
}

export const pageRegistry = new PageRegistry()