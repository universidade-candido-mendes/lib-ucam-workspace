import { Unidade } from "./ucam-design-system.model";

export class ChangeUnidadeListener {
  private static _instance: ChangeUnidadeListener;
  listeners: Function[] = [];

  private constructor() { }

  public static getInstance() {
    if (!ChangeUnidadeListener._instance) {
      ChangeUnidadeListener._instance = new ChangeUnidadeListener()
    }

    return ChangeUnidadeListener._instance;
  }

  public addListener(fn: Function) {
    this.listeners.push(fn);
  }

  public emit(unidade: Unidade) {
    this.listeners.forEach((fn: Function) => fn(unidade));
  }
}