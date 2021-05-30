// @ts-ignore
export class LocalDecorator implements Console {
  get memory(): any {
    return this.wrapped.memory;
  }

  set memory(value: any) {
    this.wrapped.memory = value;
  }

  constructor(private readonly wrapped: Console) {
  }

  profile(label?: string): void {
    this.wrapped.profile(label);
  }

  profileEnd(label?: string): void {
    this.wrapped.profileEnd(label);
  }

  assert(condition?: boolean, ...data: any[]): void {
    this.wrapped.assert(condition, ...data);
  }

  clear(): void {
    this.wrapped.clear();
  }

  count(label?: string): void {
    this.wrapped.count(label);
  }

  countReset(label?: string): void {
    this.wrapped.countReset(label);
  }

  debug(...data: any[]): void {
    this.wrapped.debug(...data);
  }

  dir(item?: any, options?: any): void {
    this.wrapped.dir(item, options);
  }

  dirxml(...data: any[]): void {
    this.wrapped.dirxml(...data);
  }

  error(...data: any[]): void {
    this.wrapped.error(...data);
  }

  exception(message?: string, ...optionalParams: any[]): void {
    this.wrapped.exception(message, ...optionalParams);
  }

  group(...data: any[]): void {
    this.wrapped.group(...data);
  }

  groupCollapsed(...data: any[]): void {
    this.wrapped.groupCollapsed(...data);
  }

  groupEnd(): void {
    this.wrapped.groupEnd();
  }

  info(...data: any[]): void {
    this.wrapped.info(...data);
  }

  log(...data: any[]): void {
    this.wrapped.log(...data);
    //const whoAreYou = { stack: '' };
    //Error.captureStackTrace(whoAreYou);
    //this.wrapped.log(whoAreYou.stack);
  }

  table(tabularData?: any, properties?: string[]): void {
    this.wrapped.table(tabularData, properties);
  }

  time(label?: string): void {
    this.wrapped.time(label);
  }

  timeEnd(label?: string): void {
    this.wrapped.timeEnd(label);
  }

  timeLog(label?: string, ...data: any[]): void {
    this.wrapped.timeLog(label, ...data);
  }

  timeStamp(label?: string): void {
    this.wrapped.timeStamp(label);
  }

  trace(...data: any[]): void {
    this.wrapped.trace(...data);
  }

  warn(...data: any[]): void {
    this.wrapped.warn(...data);
  }
}

// @ts-ignore
console = new LocalDecorator(console);