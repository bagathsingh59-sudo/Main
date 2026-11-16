/**
 * Template "throwable" scene (throwable.js), without jQuery: the
 * `[data-t-throwable-el]` tags inside a `[data-t-throwable-scene]` box drop
 * in when it scrolls into view, pile up, and can be dragged and thrown.
 *
 * Matter.js is loaded on demand, only on pages that have a scene.
 * Returns a cleanup function.
 */
import gsap from "gsap";

export async function startThrowable(scene: HTMLElement): Promise<() => void> {
  const Matter = (await import("matter-js")).default;
  const { Engine, Runner, Mouse, MouseConstraint, Composite, Bodies, Body, Events } = Matter;

  const els = Array.from(scene.querySelectorAll<HTMLElement>("[data-t-throwable-el]"));
  if (!els.length) return () => {};

  let width = scene.offsetWidth;
  let height = scene.offsetHeight;

  const engine = Engine.create();
  engine.gravity.y = 0.8;
  const runner = Runner.create();
  const mouse = Mouse.create(scene);
  // Let the page scroll normally over the scene.
  const m = mouse as unknown as { mousewheel: EventListener; mouseup: EventListener };
  scene.removeEventListener("wheel", m.mousewheel);
  scene.removeEventListener("mousewheel", m.mousewheel);
  scene.removeEventListener("DOMMouseScroll", m.mousewheel);
  scene.addEventListener("mouseleave", m.mouseup);
  const drag = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } });
  Composite.add(engine.world, drag);

  const wall = (x: number, y: number, w: number, h: number) => Bodies.rectangle(x, y, w, h, { isStatic: true });
  const left = wall(-250, height / 2, 500, height * 4);
  const right = wall(width + 250, height / 2, 500, height * 4);
  const floor = wall(0, height + 250, width * 2, 500);
  Composite.add(engine.world, [left, right, floor]);

  const bodies = els.map((el, i) => {
    const r = el.getBoundingClientRect();
    const body = Bodies.rectangle(
      gsap.utils.random(r.width / 2, Math.max(r.width / 2, width - r.width / 2)),
      -r.width - (i * r.height + 10),
      r.width,
      r.height,
      { chamfer: { radius: r.height / 2 }, angle: gsap.utils.random(-0.2 * Math.PI, 0.2 * Math.PI), restitution: 0.3 },
    );
    // Added to the world one by one when the scene scrolls into view.
    return body;
  });

  const render = () => {
    els.forEach((el, i) => {
      const b = bodies[i];
      const span = el.querySelector<HTMLElement>("span") ?? el;
      el.style.transform = `translate(${b.position.x.toFixed(1)}px, ${b.position.y.toFixed(1)}px)`;
      span.style.transform = `translate(-50%, -50%) rotate(${b.angle.toFixed(2)}rad)`;
    });
  };
  render();
  Events.on(runner, "tick", render);

  let roofAdded = false;
  Events.on(runner, "tick", () => {
    if (!roofAdded && bodies[bodies.length - 1].position.y > height / 2) {
      Composite.add(engine.world, wall(0, -250, width * 2, 500));
      roofAdded = true;
    }
  });

  Runner.run(runner, engine);
  runner.enabled = false;

  const timers: number[] = [];
  const visible = new IntersectionObserver(([e]) => (runner.enabled = e.isIntersecting));
  visible.observe(scene);
  const rain = new IntersectionObserver(([e], obs) => {
    if (!e.isIntersecting) return;
    els.forEach((el) => gsap.to(el, { opacity: 1, duration: 0.35 }));
    bodies.forEach((b, i) => timers.push(window.setTimeout(() => Composite.add(engine.world, b), 80 * i)));
    obs.disconnect();
  });
  rain.observe(scene);

  const onResize = () => {
    if (width === scene.offsetWidth && height === scene.offsetHeight) return;
    width = scene.offsetWidth;
    height = scene.offsetHeight;
    Body.setPosition(left, { x: -250, y: height / 2 });
    Body.setPosition(right, { x: width + 250, y: height / 2 });
    Body.setPosition(floor, { x: 0, y: height + 250 });
    bodies.forEach((b) => {
      if (b.position.y > height) Body.setPosition(b, { x: b.position.x, y: height / 2 });
      if (b.position.x > width) Body.setPosition(b, { x: width / 2, y: b.position.y });
    });
  };
  window.addEventListener("resize", onResize);

  return () => {
    timers.forEach(clearTimeout);
    visible.disconnect();
    rain.disconnect();
    window.removeEventListener("resize", onResize);
    scene.removeEventListener("mouseleave", m.mouseup);
    Runner.stop(runner);
    Composite.clear(engine.world, false);
    Engine.clear(engine);
  };
}
