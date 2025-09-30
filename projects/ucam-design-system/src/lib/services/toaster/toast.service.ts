import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private _wrapper!: HTMLElement;

  private _right!: HTMLElement;

  private _style = `
      .toaster-wrapper {
            z-index: 10;
            position: fixed;
            top: 0px;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            gap: 20px;
            padding: 0 20px;
            box-sizing: border-box;
            display: grid;
            grid-template-columns: 1fr 50% 1fr;
        }

        .toaster-wrapper .toaster-wrapper-right {
            grid-column: 3;
            display: flex;
            flex-direction: column;
            padding-top: 80px;
        }

        .toaster {
            background-color: #FFFFFF;
            min-height: 100px;
            height: fit-content;
            border-radius: 16px;
            margin: 10px;
            box-sizing: border-box;
            padding: 10px;
            pointer-events: all;
            box-shadow: 0px 18px 30px 2px #7D868E1F, 0px 1px 2px 0px #F6F8FA;
        }

        .toaster-alert {
            background-color: #e9f7f2;
        }

        .toaster-error {
            background-color: #ffcece;
        }

        .toaster-fade {
            animation: fadeOutToast 1s ease-in-out forwards;
        }

        .toast-title {
          display: flex;
          justify-content: flex-start;
        }

        .toast-message {
          display: flex;
          justify-content: flex-start;
        }

        @keyframes fadeOutToast {
            0% {
                opacity: 1;
            }

            100% {
                opacity: 0;
            }
        }
  `;


  constructor() {
    const style = document.createElement('style');

    style.innerHTML = this._style;

    document.head.appendChild(style);

    this.createWrapper();
  }

  alert(title: string, message: string, duration = 5, _class: string[] = []) {
    this.addToast(title, message, ['toaster-alert', ..._class], duration);
  }

  error(title: string, message: string, duration = 5, _class: string[] = []) {
    this.addToast(title, message, ['toaster-error', ..._class], duration);
  }

  private addToast(title: string, message: string, _class: string[], duration = 5) {
    const element = document.createElement('div');
    element.classList.add('toaster', ..._class);

    const _title = document.createElement('span');
    _title.classList.add('toast-title');
    _title.innerHTML = title;

    element.appendChild(_title);

    const _message = document.createElement('span');
    _message.classList.add('toast-message');
    _message.innerHTML = message;

    element.appendChild(_message);

    element.onclick = () => {
      element.classList.add('toaster-fade');
      setTimeout(() => this._right.removeChild(element), .4 * 1000);
    };

    setTimeout(() => {
      element.classList.add('toaster-fade');
      setTimeout(() => this._right.removeChild(element), .4 * 1000);
    }, (duration - 1) * 1000);

    this._right.prepend(element);

    return this;
  }

  private createWrapper() {
    this._wrapper = document.createElement('div');
    this._wrapper.classList.add('toaster-wrapper');

    this._right = document.createElement('div');
    this._right.classList.add('toaster-wrapper-right');
    this._wrapper.appendChild(this._right);

    return document.body.appendChild(this._wrapper);
  }

}




