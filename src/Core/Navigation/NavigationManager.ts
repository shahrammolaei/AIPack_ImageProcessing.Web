export class NavigationManager {
  private navigateFunction?: (path: string) => void

  public setNavigate(
    navigate: (path: string) => void
  ): void {
    this.navigateFunction = navigate
  }

  public navigate(path: string): void {
    if (!this.navigateFunction) {
      console.error(
        'Navigation function has not been initialized.'
      )
      return
    }

    this.navigateFunction(path)
  }
}

export const navigationManager = new NavigationManager()