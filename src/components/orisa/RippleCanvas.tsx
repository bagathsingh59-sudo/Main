"use client";

import { useEffect, useRef } from "react";
import { motionAllowed } from "./config";

/**
 * Water-ripple image effect — a dependency-free WebGL port of the
 * jquery.ripples plugin the template uses on its index-15 hero
 * (same shaders, same drop sizes: resolution 400, perturbance 0.03).
 *
 * Usage: render next to an <img> inside a positioned box. The canvas
 * draws that same image (object-fit: cover) and distorts it under the
 * pointer; the <img> stays underneath as the fallback and LCP element.
 *
 * Performance: starts only on hover-capable devices without
 * reduced-motion, after the image has loaded, and the render loop
 * sleeps when the canvas is off-screen or the water has settled.
 */
interface RippleCanvasProps {
  /** Element that receives pointer events. Defaults to the canvas' parent. */
  hostSelector?: string;
  resolution?: number;
  perturbance?: number;
}

const VERTEX = `
attribute vec2 vertex;
varying vec2 coord;
void main() {
  coord = vertex * 0.5 + 0.5;
  gl_Position = vec4(vertex, 0.0, 1.0);
}`;

const DROP = `
precision highp float;
const float PI = 3.141592653589793;
uniform sampler2D texture;
uniform vec2 center;
uniform float radius;
uniform float strength;
varying vec2 coord;
void main() {
  vec4 info = texture2D(texture, coord);
  float drop = max(0.0, 1.0 - length(center * 0.5 + 0.5 - coord) / radius);
  drop = 0.5 - cos(drop * PI) * 0.5;
  info.r += drop * strength;
  gl_FragColor = info;
}`;

const UPDATE_HEIGHT = `
precision highp float;
uniform sampler2D texture;
uniform vec2 delta;
varying vec2 coord;
void main() {
  vec4 info = texture2D(texture, coord);
  vec2 dx = vec2(delta.x, 0.0);
  vec2 dy = vec2(0.0, delta.y);
  float average = (
    texture2D(texture, coord - dx).r +
    texture2D(texture, coord - dy).r +
    texture2D(texture, coord + dx).r +
    texture2D(texture, coord + dy).r
  ) * 0.25;
  info.g += (average - info.r) * 2.0;
  info.g *= 0.98;
  info.r += info.g;
  gl_FragColor = info;
}`;

const UPDATE_NORMAL = `
precision highp float;
uniform sampler2D texture;
uniform vec2 delta;
varying vec2 coord;
void main() {
  vec4 info = texture2D(texture, coord);
  vec3 dx = vec3(delta.x, texture2D(texture, vec2(coord.x + delta.x, coord.y)).r - info.r, 0.0);
  vec3 dy = vec3(0.0, texture2D(texture, vec2(coord.x, coord.y + delta.y)).r - info.r, delta.y);
  info.ba = normalize(cross(dy, dx)).xz;
  gl_FragColor = info;
}`;

const RENDER_VERTEX = `
precision highp float;
attribute vec2 vertex;
uniform vec2 topLeft;
uniform vec2 bottomRight;
uniform vec2 containerRatio;
varying vec2 ripplesCoord;
varying vec2 backgroundCoord;
void main() {
  backgroundCoord = mix(topLeft, bottomRight, vertex * 0.5 + 0.5);
  backgroundCoord.y = 1.0 - backgroundCoord.y;
  ripplesCoord = vec2(vertex.x, -vertex.y) * containerRatio * 0.5 + 0.5;
  gl_Position = vec4(vertex.x, -vertex.y, 0.0, 1.0);
}`;

const RENDER_FRAGMENT = `
precision highp float;
uniform sampler2D samplerBackground;
uniform sampler2D samplerRipples;
uniform float perturbance;
varying vec2 ripplesCoord;
varying vec2 backgroundCoord;
void main() {
  vec2 offset = -texture2D(samplerRipples, ripplesCoord).ba;
  float specular = pow(max(0.0, dot(offset, normalize(vec2(-0.6, 1.0)))), 4.0);
  gl_FragColor = texture2D(samplerBackground, backgroundCoord + offset * perturbance) + specular;
}`;

/** Seconds of stillness after which the loop stops (ripples have decayed). */
const IDLE_AFTER_MS = 6000;

export function RippleCanvas({ hostSelector, resolution = 400, perturbance = 0.03 }: RippleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const box = canvas?.parentElement;
    if (!canvas || !box) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (!motionAllowed()) return;

    const img = box.querySelector("img");
    const host = (hostSelector ? canvas.closest<HTMLElement>(hostSelector) : null) ?? box;
    if (!img) return;

    let disposed = false;
    let cleanup = () => {};

    const start = () => {
      if (disposed) return;
      const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
      if (!gl || !gl.getExtension("OES_texture_float") || !gl.getExtension("OES_texture_float_linear")) return;
      gl.getExtension("WEBGL_color_buffer_float");

      type Program = { id: WebGLProgram; loc: Record<string, WebGLUniformLocation | null> };
      const program = (vs: string, fs: string): Program | null => {
        const compile = (type: number, src: string) => {
          const s = gl.createShader(type)!;
          gl.shaderSource(s, src);
          gl.compileShader(s);
          return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
        };
        const v = compile(gl.VERTEX_SHADER, vs);
        const f = compile(gl.FRAGMENT_SHADER, fs);
        if (!v || !f) return null;
        const id = gl.createProgram()!;
        gl.attachShader(id, v);
        gl.attachShader(id, f);
        gl.bindAttribLocation(id, 0, "vertex");
        gl.linkProgram(id);
        if (!gl.getProgramParameter(id, gl.LINK_STATUS)) return null;
        const loc: Program["loc"] = {};
        for (const m of (vs + fs).matchAll(/uniform \w+ (\w+)/g)) loc[m[1]] = gl.getUniformLocation(id, m[1]);
        return { id, loc };
      };

      const drop = program(VERTEX, DROP);
      const updateHeight = program(VERTEX, UPDATE_HEIGHT);
      const updateNormal = program(VERTEX, UPDATE_NORMAL);
      const render = program(RENDER_VERTEX, RENDER_FRAGMENT);
      if (!drop || !updateHeight || !updateNormal || !render) return;

      const quad = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      const drawQuad = () => {
        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
      };

      // Two ping-pong float targets holding height (r), velocity (g), normal (ba).
      let textures: WebGLTexture[] = [];
      let framebuffers: WebGLFramebuffer[] = [];
      for (let i = 0; i < 2; i++) {
        const tex = gl.createTexture()!;
        const fb = gl.createFramebuffer()!;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, resolution, resolution, 0, gl.RGBA, gl.FLOAT, null);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) return;
        textures.push(tex);
        framebuffers.push(fb);
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      // Background = the sibling <img>, already decoded by the browser.
      const background = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, background);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      } catch {
        return; // tainted (cross-origin) image — keep the plain <img>
      }
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);

      const delta = new Float32Array([1 / resolution, 1 / resolution]);
      for (const p of [updateHeight, updateNormal]) {
        gl.useProgram(p.id);
        gl.uniform2fv(p.loc.delta, delta);
      }
      gl.useProgram(render.id);
      gl.uniform1f(render.loc.perturbance, perturbance);
      gl.uniform1i(render.loc.samplerBackground, 0);
      gl.uniform1i(render.loc.samplerRipples, 1);

      let width = 0;
      let height = 0;
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = box.clientWidth;
        height = box.clientHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

        // object-fit: cover — which part of the image is visible.
        const imageRatio = img.naturalWidth / img.naturalHeight;
        const boxRatio = width / height;
        let x = 1;
        let y = 1;
        if (boxRatio > imageRatio) y = imageRatio / boxRatio;
        else x = boxRatio / imageRatio;
        const longest = Math.max(width, height);
        gl.useProgram(render.id);
        gl.uniform2f(render.loc.topLeft, (1 - x) / 2, (1 - y) / 2);
        gl.uniform2f(render.loc.bottomRight, (1 + x) / 2, (1 + y) / 2);
        gl.uniform2f(render.loc.containerRatio, width / longest, height / longest);
      };

      const swap = () => {
        framebuffers = [framebuffers[1], framebuffers[0]];
        textures = [textures[1], textures[0]];
      };

      const frame = () => {
        gl.viewport(0, 0, resolution, resolution);
        [updateHeight, updateNormal].forEach((p, i) => {
          gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[i]);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, textures[1 - i]);
          gl.useProgram(p.id);
          drawQuad();
        });
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(render.id);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, background);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, textures[0]);
        drawQuad();
      };

      let raf = 0;
      let visible = true;
      let lastInput = 0;
      const loop = (now: number) => {
        raf = 0;
        if (!visible || now - lastInput > IDLE_AFTER_MS) return;
        frame();
        raf = requestAnimationFrame(loop);
      };
      const wake = () => {
        lastInput = performance.now();
        if (!raf && visible) raf = requestAnimationFrame(loop);
      };

      const dropAt = (e: PointerEvent, radius: number, strength: number) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const longest = Math.max(width, height);
        gl.viewport(0, 0, resolution, resolution);
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[0]);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textures[1]);
        gl.useProgram(drop.id);
        gl.uniform2f(drop.loc.center, (2 * x - width) / longest, (height - 2 * y) / longest);
        gl.uniform1f(drop.loc.radius, radius);
        gl.uniform1f(drop.loc.strength, strength);
        drawQuad();
        swap();
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        wake();
      };

      const onMove = (e: PointerEvent) => dropAt(e, 0.03, 0.01);
      const onDown = (e: PointerEvent) => dropAt(e, 0.09, 0.14);
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerdown", onDown);

      const ro = new ResizeObserver(() => {
        resize();
        frame();
      });
      ro.observe(box);
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(canvas);

      resize();
      frame();
      canvas.classList.add("is-ready");

      cleanup = () => {
        cancelAnimationFrame(raf);
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerdown", onDown);
        ro.disconnect();
        io.disconnect();
        canvas.classList.remove("is-ready");
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    };

    // Never compete with first paint: wait for the image, then for idle time.
    const whenIdle = () =>
      "requestIdleCallback" in window ? window.requestIdleCallback(start, { timeout: 1500 }) : setTimeout(start, 300);
    if (img.complete && img.naturalWidth > 0) whenIdle();
    else img.addEventListener("load", whenIdle, { once: true });

    return () => {
      disposed = true;
      img.removeEventListener("load", whenIdle);
      cleanup();
    };
  }, [hostSelector, resolution, perturbance]);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}
