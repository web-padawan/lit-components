import {
  keyboardEventFor,
  keyDownOn,
  keyUpOn
} from '@polymer/iron-test-helpers/mock-interactions.js';

export { downAndUp } from '@polymer/iron-test-helpers/mock-interactions.js';

export function arrowDownKeyDown(target) {
  keyDownOn(target, 40, [], 'ArrowDown');
}

export function arrowDownKeyUp(target) {
  keyUpOn(target, 40, [], 'ArrowDown');
}

export function arrowDown(target) {
  arrowDownKeyDown(target);
  arrowDownKeyUp(target);
}

export function arrowDownIE(target) {
  keyDownOn(target, 40, [], 'Down');
}

export function arrowLeftKeyDown(target) {
  keyDownOn(target, 37, [], 'ArrowLeft');
}

export function arrowLeftKeyUp(target) {
  keyUpOn(target, 37, [], 'ArrowLeft');
}

export function arrowLeft(target) {
  arrowLeftKeyDown(target);
  arrowLeftKeyUp(target);
}

export function arrowRightKeyDown(target) {
  keyDownOn(target, 39, [], 'ArrowRight');
}

export function arrowRightKeyUp(target) {
  keyUpOn(target, 39, [], 'ArrowRight');
}

export function arrowRight(target) {
  arrowRightKeyDown(target);
  arrowRightKeyUp(target);
}

export function arrowUpKeyDown(target) {
  keyDownOn(target, 38, [], 'ArrowUp');
}

export function arrowUpKeyUp(target) {
  keyUpOn(target, 38, [], 'ArrowUp');
}

export function arrowUp(target) {
  arrowUpKeyDown(target);
  arrowUpKeyUp(target);
}

export function home(target) {
  keyDownOn(target, 36, [], 'Home');
}

export function end(target) {
  keyDownOn(target, 35, [], 'End');
}

export function enterDown(target) {
  keyDownOn(target, 13, [], 'Enter');
}

export function enterUp(target) {
  keyUpOn(target, 13, [], 'Enter');
}

export function enter(target) {
  enterDown(target);
  enterUp(target);
}

export function keyDownChar(target, letter, modifier) {
  keyDownOn(target, letter.charCodeAt(0), modifier, letter);
}

export function spaceDown(target) {
  keyDownOn(target, 32, [], ' ');
}

export function spaceUp(target) {
  keyUpOn(target, 32, [], ' ');
}

export function space(target) {
  spaceDown(target);
  spaceUp(target);
}

export function shiftTabDown(target) {
  keyDownOn(target, 9, 'shift', 'Tab');
}

export function shiftTabUp(target) {
  keyUpOn(target, 9, 'shift', 'Tab');
}

export function shiftTabEvent() {
  return keyboardEventFor('keydown', 9, 'shift', 'Tab');
}

export function tabDown(target) {
  keyDownOn(target, 9, [], 'Tab');
}

export function tabUp(target) {
  keyUpOn(target, 9, [], 'Tab');
}
