import Animated, {
  and,
  block,
  Clock,
  cond,
  Easing,
  eq,
  neq,
  set,
  spring,
  startClock,
  stopClock,
  timing,
  Value,
} from "react-native-reanimated";
import { useClock, useValue } from "react-native-redash";

export const useTimingTransition = (
  open: Value<number>
): Animated.Node<number> => {
  const clock = useClock();
  const state = {
    finished: useValue(0),
    position: useValue(0),
    time: useValue(0),
    frameTime: useValue(0),
  };

  const config = {
    duration: 300,
    toValue: useValue(-1),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(and(eq(open, 1), neq(config.toValue, 1)), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      set(config.toValue, 1),
      startClock(clock),
    ]),
    cond(and(eq(open, 0), neq(config.toValue, 0)), [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.frameTime, 0),
      set(config.toValue, 0),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]);
};

export const useSpringTransition = (
  open: Value<number>
): Animated.Node<number> => {
  const clock = useClock();
  const state = {
    finished: useValue(0),
    velocity: useValue(0),
    position: useValue(0),
    time: useValue(0),
  };

  const config = {
    toValue: new Value(0),
    damping: 12,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
  };

  return block([
    cond(and(eq(open, 1), neq(config.toValue, 1)), [
      set(state.finished, 0),
      set(state.time, 0),
      //set(state.velocity, vel),
      set(config.toValue, 1),
      startClock(clock),
    ]),
    cond(and(eq(open, 0), neq(config.toValue, 0)), [
      set(state.finished, 0),
      set(state.time, 0),
      //set(state.velocity, vel),
      set(config.toValue, 0),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ]);
};
