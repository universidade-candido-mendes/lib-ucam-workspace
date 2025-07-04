import { UcamUserProfile, Unidade } from "./ucam-design-system.model";

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

export class ChangeProfileListener {
  private static _instance: ChangeProfileListener;
  listeners: Function[] = [];

  private constructor() { }

  public static getInstance() {
    if (!ChangeProfileListener._instance) {
      ChangeProfileListener._instance = new ChangeProfileListener()
    }

    return ChangeProfileListener._instance;
  }

  public addListener(fn: Function) {
    this.listeners.push(fn);
  }

  public emit(profile: UcamUserProfile) {
    this.listeners.forEach((fn: Function) => fn(profile));
  }
}

export class ExitListener {
  private static _instance: ExitListener;
  listeners: Function[] = [];

  private constructor() { }

  public static getInstance() {
    if (!ExitListener._instance) {
      ExitListener._instance = new ExitListener()
    }

    return ExitListener._instance;
  }

  public addListener(fn: Function) {
    this.listeners.push(fn);
  }

  public emit() {
    this.listeners.forEach((fn: Function) => fn());
  }
}