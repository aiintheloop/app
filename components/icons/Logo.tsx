
const cls1 = {
  fillRule: 'evenodd', // note the capital 'W' here
  msTransition: 'all' // 'ms' is the only lowercase vendor prefix
};

const Logo = ({ className = '', ...props }) => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 250 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >

    <path id="Farbfüllung_6" data-name="Farbfüllung 6" style={{fillRule: "evenodd", fill: "#008dd5"}}
          d="M342,242l11,1c4.551,5.754,8.063,6.81,8,18-5.4,6.772-6.185,11.179-19,11-6.772-5.4-11.179-6.185-11-19,1.879-2.255,2.674-6.233,5-8C337.855,243.591,340.29,243.43,342,242Z" />
    <path id="Farbfüllung_5" data-name="Farbfüllung 5" style={{fillRule: "evenodd",fill: "#e43f6f"}}
          d="M166,242l11,1c4.551,5.754,8.063,6.81,8,18-5.4,6.772-6.185,11.179-19,11-6.772-5.4-11.179-6.185-11-19,1.879-2.255,2.674-6.233,5-8C161.855,243.591,164.29,243.43,166,242Z" />
    <path id="Farbfüllung_1" data-name="Farbfüllung 1" style={{fillRule: "evenodd", fill: "#000000"}}
          d="M360,228H330c0.8-28.381,1.717-62.158-9-80-23.68-39.421-103.359-39.6-127,0-10.691,17.907-9.781,51.569-9,80H155C151.067,44.16,363.782,44.033,360,228Z" />
    <path id="Farbfüllung_2" data-name="Farbfüllung 2" style={{fillRule: "evenodd", fill: "#000000"}}
          d="M155,290h30c-0.793,28.1-1.6,61.347,9,79,23.68,39.421,103.359,39.6,127,0,10.578-17.717,9.778-50.853,9-79h30C364,472.7,151.163,472.837,155,290Z" />

  </svg>
);

export default Logo;
