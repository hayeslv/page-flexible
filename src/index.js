import debounce from 'lodash.debounce';

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

const setScale = (originWidth, originHeight, contentId) => {
  const { rate, width, height } = getScale(originWidth, originHeight);

  document.documentElement.style.cssText = document.documentElement.style.cssText + `;width: 100vw; height: 100vh;`; // 固定html宽高
  document.body.style.cssText = document.body.style.cssText + `;width: ${originWidth * rate}px; height: 100%; overflow-y: hidden; margin: 0;`; // 确定body样式
  
  // 内容区域
  const content = document.getElementById(contentId);
  if(!content) return;
  const contentStyle = `
    ;width: ${width}px;
    height: ${height}px;
    transform: scale(${rate});
    transform-origin: left top; 
    overflow-y: hidden; 
    pointer-events: none; 
    position: absolute;
    left: 0;
    top: 0;
  `;
  content.style.cssText = content.style.cssText + contentStyle;
  // 子元素解除css事件穿透
  content.childNodes.forEach(node => node.style.pointerEvents = 'auto')
}


/**
 * 
 * @param {*} originWidth ：设计稿宽度
 * @param {*} originHeight ：设计稿高度
 * @param {*} contentId ：内容区域id
 * @param {*} time ：防抖时间
 */
export default function(originWidth = 1920, originHeight = 1080, contentId = 'layer', time = 100) {
  const debounceSetScale = debounce(setScale, time);
  debounceSetScale(originWidth, originHeight, contentId);
  window.addEventListener('resize', () => debounceSetScale(originWidth, originHeight, contentId));

  // 主动触发resize事件（让地图在当前宽高下重新绘制）
  setTimeout(() => {
    var myEvent = new Event('resize');
    window.dispatchEvent(myEvent);
  }, time);
}