
import { ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentRef, createComponent, ElementRef, EnvironmentInjector, HostBinding, inject, Injectable, Input } from "@angular/core";

@Component({
    selector: 'ucam-toast-wrapper',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
    template: `
   <ng-content></ng-content>
  `,
    styles: [
        `
      :host {
        top: 0;
        right: 0;
        z-index: 99;
        width: fit-content;
        height: 100vh;
        display: flex;
        position: fixed;
        overflow: hidden;
        pointer-events: none;
        flex-direction: column;
        transition: all 1s ease-in-out;
      }
    `
    ]
})
export class ToastWrapperComponent {}

@Component({
    selector: 'ucam-toast',
    imports: [],
    template: `
    <div>
      <span class="material-symbols-outlined toaster-icon">
        {{ icon }}
      </span>
      <p>{{ message }}</p>
      <span class="material-symbols-outlined close-icon" (click)="close()">
        close_small
      </span>
    </div>
  `,
    styles: [
        `
      :host {
        gap: 10px;
        margin: 10px 10px 0;
        display: flex;
        flex-direction: column;
        padding: 10px;
        grid-column: 12;
        min-width: 350px;
        min-height: 50px;
        width: fit-content;
        border-radius: 8px;
        height: fit-content;
        pointer-events: all;
        box-sizing: border-box;
        background-color: #FFFFFF;
        border: 1px solid #a5a5a585;
        transition: 0.5s ease-in-out;
        box-shadow: 0px 18px 30px 2px #7D868E1F, 0px 1px 2px 0px #F6F8FA;
        padding: 15px 20px;

        div {
          display: flex;
          flex-direction: row;
          gap: 10px;
          position: relative;
          height: 100%;
          line-height: 25px;

          h3, p {
            margin: 0;
          }

          .close-icon {
            position: absolute;
            right: 0;
            cursor: pointer;
          }
        }

        p {
          margin: 0;
          max-width: 270px;
        }

        &.toaster-alert {
          background-color: #e9f7f2;

          .toaster-icon {
            color: green;
          }
        }

        &.toaster-error {
          background-color: #ffcece;

          .toaster-icon {
            color: red;
          }
        }

        &.toaster-fade {
          animation: fadeOutToast 1s ease-in-out forwards;
        }

        &:not(:hover).list {
          margin-top: -4rem;
          z-index: 1;
        }

        @keyframes fadeOutToast {
          0% {
            opacity: 1;
          }

          100% {
            opacity: 0;
          }
        }
      }
  `
    ],
    host: {
        '[class]': 'klass',
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {
  @Input() title: string = "Alerta";
  @Input() message: string = "Mensagem de alerta";
  @Input() klass: string[] = [];
  @Input() icon: string = "info";
  @Input() duration: number = 5;

  @HostBinding('class.toaster-fade') fade = false;
  @HostBinding('class.list') list = false;

  constructor(
    private elRef:ElementRef,
    private _change: ChangeDetectorRef
  ) {
    setTimeout(() => {
      this.close();
    }, this.duration * 1000);
  }

  close() {
    this.fade = true;
    this._change.markForCheck();

    setTimeout(() => {
      this.elRef.nativeElement.remove();
    }, .5 * 1000);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private _wrapper!: ComponentRef<ToastWrapperComponent>;

  private _injector = inject(EnvironmentInjector);

  constructor(
    private appRef: ApplicationRef,
  ) {
    this.createWrapper();
  }

  alert(title: string, message: string, duration = 5, _class: string[] = []) {
    this.addToast(title, message, ['toaster-alert', ..._class], duration);
  }

  error(title: string, message: string, duration = 5, _class: string[] = []) {
    this.addToast(title, message, ['toaster-error', ..._class], duration);
  }

  private addToast(title: string, message: string, _class: string[], duration = 5) {
    const toastComponent = createComponent(ToastComponent, {
      environmentInjector: this._injector,
    });

    toastComponent.setInput('title', title);
    toastComponent.setInput('message', message);
    toastComponent.setInput('duration', duration);
    toastComponent.setInput('klass', _class)

    this.appRef.attachView(toastComponent.hostView);
    toastComponent.changeDetectorRef.detectChanges();

    this._wrapper.location.nativeElement.prepend(toastComponent.location.nativeElement);
  }

  private createWrapper() {
    this._wrapper = createComponent(ToastWrapperComponent, {
      environmentInjector: this._injector,
    });

    document.body.appendChild(this._wrapper.location.nativeElement);
  }

}
