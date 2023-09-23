export enum UserType {
  ADMIN = 'ADMIN',
  DRIVER = 'DRIVER',
}

export namespace UserType {
  export function keys(): Array<string>{
    let keys = Object.keys(UserType);
    return keys.slice(0, -1);
  }
}
