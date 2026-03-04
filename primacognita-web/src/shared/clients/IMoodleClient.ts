export default interface IMoodleClient {
  call<TResponse>(
    wstoken: string,
    wsFunction: string,
    params: Record<string, string>
  ): Promise<TResponse>;
}