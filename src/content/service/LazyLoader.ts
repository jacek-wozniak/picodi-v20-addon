import lozad from "lozad";

export default class LazyLoader {
  private readonly observer: any;

  public constructor(selector: string) {
    this.observer = lozad(selector, {
      threshold: 0.1,
      load: (element: HTMLImageElement) => this.onLoad(element)
    });
  }

  private onLoad(element: HTMLImageElement): void {
    if (element.getAttribute('data-src')) {
      element.src = element.dataset.src;
    }
    if (element.getAttribute('data-srcset')) {
      element.srcset = element.dataset.srcset;
    }
    if (element.getAttribute('data-background-image')) {
      element.style.backgroundImage = `url(${element.dataset.backgroundImage})`;
      element.classList.add('fade-logo');
    }

    element.onload = () => {
      element.classList.add('fade-logo');
      this.removeSpinner(element, '.spinner');
    };
  }

  private removeSpinner(element: HTMLElement, selector: string): void {
    const spinnerElement: HTMLElement = element.parentElement.querySelector(selector);
    if (spinnerElement) {
      element.parentElement.removeChild(spinnerElement);
    }
  }

  public observe(): void {
    this.observer.observe();
  }

  public trigger(element: HTMLImageElement): void {
    this.observer.triggerLoad(element);
  }
}
