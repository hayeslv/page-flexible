
import debounce from 'lodash.debounce';

const originWidth = 3840;
const originHeight = 1080;

const time = 100; // 防抖延迟时间

export const getScale = () => {
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

const setScale = () => {
  const { rate, width, height } = getScale();
  // TODO 这种修改方式待优化，需要修改成setAttribute
  document.documentElement.style = `width: 100vw; height: 100vh;`; // 固定html宽高
  document.body.style = `width: ${originWidth * rate}px; height: 100%; overflow-y: hidden;`; // 确定body样式
  
  let style = `width: ${width}px; height: ${height}px; transform-origin: left top; overflow-y: hidden; pointer-events: none;`;
  style += `transform: scale(${rate});`;
  

  // TODO 代码侵入性太强，待优化
  const id = document.getElementById('layer');
  id.style = style;

  // 子元素解除css事件穿透
  id.childNodes.forEach(node => node.style.pointerEvents = 'auto')
}

const debounceSetScale = debounce(setScale, time);

debounceSetScale();

window.addEventListener('resize', debounceSetScale);


// 主动触发resize事件（让地图在当前宽高下重新绘制）
setTimeout(() => {
  var myEvent = new Event('resize');
  window.dispatchEvent(myEvent);
}, time);




export const getSacleRate = () => {
  const { rate } = getScale();
  return rate;
};


