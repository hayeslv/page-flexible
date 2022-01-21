import { debounce } from 'lodash';

const getScale = (originWidth, originHeight) => {
  let width = originWidth; 
  const height = originHeight;
  const ww = window.innerWidth / width;
  const wh = window.innerHeight / height;

  let rate = ww < wh ? ww : wh;
  if (ww > wh) width = (width / rate) * ww;

  if (wh > ww) rate = wh;


  if (rate > 0.99 && rate < 1.01) rate = 1;
  if (rate > 0.49 && rate < 0.51) rate = 0.5;
  return { rate, width, height };
};

const setScale = (originWidth, originHeight) => {
  const { rate, width, height } = getScale(originWidth, originHeight);

  const style = `
    width: ${width}px; 
    height: ${height}px; 
    transform: scale(${rate});
    transform-origin: left top; 
    overflow-y: hidden;
    hidden; margin: 0;
  `;
  document.documentElement.style.cssText = document.documentElement.style.cssText + style; // 固定html宽高
}


/**
 * 
 * @param {*} originWidth ：设计稿宽度
 * @param {*} originHeight ：设计稿高度
 * @param {*} time ：防抖时间
 */
export default function(originWidth = 1920, originHeight = 1080, time = 100) {
  const debounceSetScale = debounce(setScale, time);
  debounceSetScale(originWidth, originHeight);
  window.addEventListener('resize', () => debounceSetScale(originWidth, originHeight));

  // 主动触发resize事件（让地图在当前宽高下重新绘制）
  setTimeout(() => {
    var myEvent = new Event('resize');
    window.dispatchEvent(myEvent);
  }, time);
}