
export class UcamOption {

  public id: any = 'option-ucam-' + (Math.random() + 1).toString(36).substring(7);

  public label?: string;
  public value?: any;
  public valid: boolean = true;
  public description?: string;

  constructor(private param: Partial<UcamOption>) {
    Object.assign(this, this.param);
  }

}

export class UcamUserProfile {

  public username = "Username";
  public email = "user@ucam.edu.br";

  constructor(private param: Partial<UcamUserProfile>) {
    Object.assign(this, this.param);
  }

}

export class AppConfig {

  public title!: string;
  public subtitle!: string;

  constructor(private param: Partial<AppConfig>) {
    Object.assign(this, this.param);
  }

}

export class MenuLink {

  public icon!: string;
  public label!: string;
  public address!: string;

  constructor(private param: Partial<MenuLink>) {
    Object.assign(this, this.param);
  }

}

export class MenuConfig {

  public app!: AppConfig;
  public links!: MenuLink[];

  constructor(private param: Partial<MenuConfig>) {
    Object.assign(this, this.param);
  }

}
