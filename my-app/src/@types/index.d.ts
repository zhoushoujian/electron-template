declare module '*.less' {
  const content: { [className: string]: string };
  export default content;
}

interface Window {
  axios: any;
  getRoute: () => void;
  goRouteClass: (a: any, b: string) => void;
  APP_CONFIG: any;
  logger: any;
}
