import { RedocStandalone } from 'redoc';
import { FontSettings, HTTPResponseColos } from 'redoc/typings/theme';

export default function Docs() {
  const ReDoc = `redoc` as keyof JSX.IntrinsicElements;

  return (
    <div style={{background: '#fff !important'}}>
    <RedocStandalone
      specUrl="/swagger.json"
      options={{
        nativeScrollbars: true,
        scrollYOffset: "118",
        theme: {
          schema: {
            linesColor: '#fff',
            typeNameColor: '#fff',
            typeTitleColor: '#fff',
            requireLabelColor: '#e43f6f',
            nestedBackground: '#000', /* The nested Schema BG */
            arrow: {
              color: '#FFECAF'
            }
          },
          typography: {
            fontSize: '16px',
            fontFamily: 'Roboto Mono, Roboto, sans-serif',
            optimizeSpeed: true,
            smoothing: 'antialiased',
            headings: {
              fontWeight: 'bold',
              lineHeight: '2em',
            },
            code: { /* The batches for header parameter */
              backgroundColor: '#000',
              color: '#fff'
            },
          },
          sidebar: { /* The Endpoint bar on the left */
            width: '300px',
            textColor: '#000',
            backgroundColor: '#fff',
          },
          rightPanel: { /* The example Bar on the right */
            backgroundColor: 'rgb(32, 48, 60)', /* Overall Background */
            textColor: '#e43f6f', /* The Color of the text and of the batches e.g. Payload, 200 */
            servers: {
              overlay: {
                backgroundColor: '#000', /* outer background of the uri */
                textColor: '#fff',
              },
              url: {
                backgroundColor: '#000' /* inner background of the uri */
              }
            }
          },
          colors: {
            primary: {
              main: '#008dd5', /* e.g Download button and other buttons*/
              light: 'rgba(246, 20, 63, 0.42)',
            },
            success: {
              main: '#000',
              light: '#81ec9a',
              dark: '#083312',
              contrastText: 'rgba(255, 187, 0, 1)',
            },
            responses: { /* The Color of the Responses of the Main bar */
              success: {
                color: '#fff',
                backgroundColor: '#000',
                tabTextColor: '#000'
              },
              error: {
                color: '#fff',
                backgroundColor: '#000',
                tabTextColor: '#000'
              },
              redirect: {
                color: '#fff',
                backgroundColor: '#000',
                tabTextColor: '#000'
              },
              info: {
                color: '#fff',
                backgroundColor: '#000',
                tabTextColor: '#000'
              }
            },
            text: {
              primary: '#fff',
              secondary: '#FC3',
            },
            http: {
              get: 'rgba(0, 200, 219, 1)',
              post: 'rgba(28, 184, 65, 1)',
              put: 'rgba(255, 187, 0, 1)',
              delete: 'rgba(254, 39, 35, 1)',
            },
          },
          fab: {
            backgroundColor: 'rgba(255, 187, 0, 1)',
            color:'rgba(254, 39, 35, 1)'
          }
        }
      }}
    />
    </div>
  );
}
