import './style.css'
import { Tween } from './Tween/Tween';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="cube"></div>
  <div class="actions">
    <button id="start">Start</button>
    <button id="stop">Stop</button>
    <button id="restart">Restart</button>
  </div>
`

const element = document.getElementById('cube')!;

const myTween = new Tween({
  element,
  duration: 5000,
  startState: {
    x: '0',
  },
  endState: {
    x: element.parentElement!.clientWidth - element.clientWidth,
  },
  infinite: true,
  easing: 'easeInOutSineBounce'
})

myTween.start();


const start = document.getElementById('start')!;
start!.onclick = () => myTween.start();

const stop = document.getElementById('stop')!;
stop!.onclick = () => myTween.stop();

const restart = document.getElementById('restart')!;
restart!.onclick = () => myTween.restart();
