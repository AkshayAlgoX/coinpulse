export const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Search', href: '/' },
  { label: 'All Coins', href: '/coins' },
];

export const PERIOD_BUTTONS = [
  { value: 'daily', label: '1D' },
  { value: 'weekly', label: '1W' },
  { value: 'monthly', label: '1M' },
  { value: 'yearly', label: '1Y' },
] as const;

export const LIVE_INTERVAL_BUTTONS = [
  { value: '1s', label: '1s' },
  { value: '1m', label: '1m' },
] as const;

export const PERIOD_CONFIG = {
  daily: { days: 1 },
  weekly: { days: 7 },
  monthly: { days: 30 },
  yearly: { days: 365 },
};

export const getChartConfig = (height: number, showTime: boolean) => ({
  height,
  layout: { background: { color: 'transparent' }, textColor: '#D9D9D9' },
  grid: { vertLines: { color: '#2B2B43' }, horzLines: { color: '#2B2B43' } },
  timeScale: { visible: showTime, timeVisible: true, secondsVisible: false },
});

export const getCandlestickConfig = () => ({
  upColor: '#4CAF50',
  downColor: '#FF5252',
  borderVisible: false,
  wickUpColor: '#4CAF50',
  wickDownColor: '#FF5252',
});
