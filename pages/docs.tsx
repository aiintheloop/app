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
          typography: {
            fontFamily: 'Roboto Mono, Roboto, sans-serif',
          }
        }
      }}
    />
    </div>
  );
}
