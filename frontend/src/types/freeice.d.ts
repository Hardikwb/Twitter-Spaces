declare module "freeice" {
  interface FreeIceOptions {
    createIceServersCount?: number;
    stun?: string[];
    turn?: string[];
  }

  interface IceServer {
    urls: string | string[];
    username?: string;
    credential?: string;
  }

  function freeice(options?: FreeIceOptions): IceServer[];

  export = freeice;
}
