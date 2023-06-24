import { RedocStandalone } from 'redoc';

export default function ApproveDeclineWithContentView() {
  const ReDoc = `redoc` as keyof JSX.IntrinsicElements;

  return (
    <RedocStandalone
      specUrl="/api/doc"
      options={{
        nativeScrollbars: true,
        scrollYOffset: "118",
        theme: {
          typography: {
            fontSize: '16px',
            fontFamily: 'Roboto Mono, Roboto, sans-serif',
            optimizeSpeed: true,
            smoothing: 'antialiased',
            headings: {
              fontWeight: 'bold',
              lineHeight: '2em',
            },
            code: {
              fontWeight: '600',
              color: 'rgba(92, 62, 189, 1)',
              wrap: true,
            },
            links: {
              color: 'rgba(246, 20, 63, 1)',
              visited: 'rgba(246, 20, 63, 1)',
              hover: '#fa768f',
            },
          },
          sidebar: {
            width: '300px',
            textColor: '#000000',
            backgroundColor: '#ffffff',

          },
          rightPanel: {
            backgroundColor: 'rgba(55, 53, 71, 1)',
            textColor: '#ffffff',
          },
          colors: {
            primary: {
              main: 'rgba(246, 20, 63, 1)',
              light: 'rgba(246, 20, 63, 0.42)',
            },
            success: {
              main: 'rgba(28, 184, 65, 1)',
              light: '#81ec9a',
              dark: '#083312',
              contrastText: '#000',
            },
            text: {
              primary: 'rgba(0, 0, 0, 1)',
              secondary: '#4d4d4d',
            },
            http: {
              get: 'rgba(0, 200, 219, 1)',
              post: 'rgba(28, 184, 65, 1)',
              put: 'rgba(255, 187, 0, 1)',
              delete: 'rgba(254, 39, 35, 1)',
            },
          },
        }
      }}
    />
  );
}
