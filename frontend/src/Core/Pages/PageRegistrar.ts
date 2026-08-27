import type { PageDefinition } from './PageDefinition'
import { pageRegistry } from './PageRegistry'

export class PageRegistrar {
  public static register(
    page: PageDefinition
  ): void {
    pageRegistry.register(page)
  }
}