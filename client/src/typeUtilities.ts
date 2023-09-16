export type FluxStandardAction<
  Type extends string,
  Payload = undefined,
> = Payload extends undefined
  ? { type: Type }
  : { payload: Payload; type: Type };

export type RequireProperties<T, K extends keyof T> = Pick<Required<T>, K> &
  Omit<T, K>;
