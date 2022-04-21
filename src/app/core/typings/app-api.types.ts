export enum ResponseType {
  Good = 0,
  Bad = 1,
}

export class AppResponseSuccess<T> {
  public readonly status = ResponseType.Good;

  constructor(
    public readonly data: T,
    public readonly totalLength?: number,
  ) { }
}

export class AppResponseFailed {
  public readonly status = ResponseType.Bad;
  constructor(public readonly errorMessage?: string) { }
}