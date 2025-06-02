declare module '*.jpg' {
  const content: {
    uri: string;
    width?: number;
    height?: number;
    [key: string]: any;
  };
  export default content;
}

declare module '*.png' {
  const content: {
    uri: string;
    width?: number;
    height?: number;
    [key: string]: any;
  };
  export default content;
}