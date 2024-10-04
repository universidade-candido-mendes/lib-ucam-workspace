
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
