export type FluxStandardAction<
  Type extends string,
  Payload = undefined,
> = Payload extends undefined
  ? { type: Type }
  : { payload: Payload; type: Type };
