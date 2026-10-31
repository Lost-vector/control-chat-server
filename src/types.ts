export interface ServerToClientEvents {
  welcome: (payload: { id: string; online: number }) => void;
}

export interface ClientToServerEvents {
  message: (payload: { text: string }) => void;
}