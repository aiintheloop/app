import { RedocStandalone } from 'redoc';

export default function ApproveDeclineWithContentView() {
  const ReDoc = `redoc` as keyof JSX.IntrinsicElements;

  return (
    <RedocStandalone
      specUrl="/api/doc"
      options={{
        nativeScrollbars: true,
        theme: { colors: { primary: { main: '#000' } } },
      }}
    />
  );
}
