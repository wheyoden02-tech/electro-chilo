/**
 * True 3D Animated Mesh Gradient
 * Stripe‑style deformable topology
 */

export class MeshGradient {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;
  private program!: WebGLProgram;
  private time = 0;
  private animationId: number | null = null;
  private timeUniform!: WebGLUniformLocation;
  private speedMultiplier = 1;
  private indexCount = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl", { antialias: true });
    if (!gl) throw new Error("WebGL not supported");
    this.gl = gl;

    if (window.innerWidth < 768) {
      this.speedMultiplier = 0.7;
    }

    this.init();
    this.resize();
    window.addEventListener("resize", this.resize);
    this.animate();
  }

  private createShader(type: number, source: string) {
    const shader = this.gl.createShader(type)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    return shader;
  }

  private init() {
    const segments = window.innerWidth < 768 ? 32 : 64;

    const vertices: number[] = [];
    const indices: number[] = [];

    for (let y = 0; y <= segments; y++) {
      for (let x = 0; x <= segments; x++) {
        const u = x / segments;
        const v = y / segments;
        vertices.push(u * 2 - 1, v * 2 - 1);
      }
    }

    for (let y = 0; y < segments; y++) {
      for (let x = 0; x < segments; x++) {
        const i = y * (segments + 1) + x;
        indices.push(i, i + 1, i + segments + 1);
        indices.push(i + 1, i + segments + 2, i + segments + 1);
      }
    }

    const vertexSrc = `
      precision mediump float;
      attribute vec2 position;
      uniform float u_time;
      varying float v_height;

      float noise(vec2 p){
        return sin(p.x)*sin(p.y);
      }

      void main(){
        float n = noise(position * 3.0 + u_time * 0.6);
        float elevation = n * 0.35;
        v_height = elevation;
        gl_Position = vec4(position.x, position.y + elevation, 0.0, 1.0);
      }
    `;

    const fragmentSrc = `
      precision mediump float;
      varying float v_height;

      uniform vec3 u_color1;
      uniform vec3 u_color2;
      uniform vec3 u_color3;

      void main(){
        float h = v_height;

        float mix1 = smoothstep(-0.4, 0.4, h);
        float mix2 = smoothstep(-0.2, 0.5, h);

        vec3 color = mix(u_color1, u_color2, mix1);
        color = mix(color, u_color3, mix2);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSrc);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSrc);

    const program = this.gl.createProgram()!;
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    this.gl.useProgram(program);

    const vbo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

    const ibo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
    this.indexCount = indices.length;

    const position = this.gl.getAttribLocation(program, "position");
    this.gl.enableVertexAttribArray(position);
    this.gl.vertexAttribPointer(position, 2, this.gl.FLOAT, false, 0, 0);

    this.timeUniform = this.gl.getUniformLocation(program, "u_time")!;

    const color1Uniform = this.gl.getUniformLocation(program, "u_color1")!;
    const color2Uniform = this.gl.getUniformLocation(program, "u_color2")!;
    const color3Uniform = this.gl.getUniformLocation(program, "u_color3")!;

    // Hex → normalized vec3
    const hexToVec3 = (hex: string) => {
      const bigint = parseInt(hex.replace("#", ""), 16);
      const r = ((bigint >> 16) & 255) / 255;
      const g = ((bigint >> 8) & 255) / 255;
      const b = (bigint & 255) / 255;
      return [r, g, b];
    };

    const c1 = hexToVec3("#00E2FF");
    const c2 = hexToVec3("#FF3C00");
    const c3 = hexToVec3("#4A00E0");

    this.gl.uniform3f(color1Uniform, c1[0], c1[1], c1[2]);
    this.gl.uniform3f(color2Uniform, c2[0], c2[1], c2[2]);
    this.gl.uniform3f(color3Uniform, c3[0], c3[1], c3[2]);

    this.program = program;

    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.clearColor(0.04, 0.04, 0.06, 1.0);
  }

  private resize = () => {
    const dpr = window.innerWidth < 768 ? 1 : window.devicePixelRatio;
    const width = this.canvas.clientWidth * dpr;
    const height = this.canvas.clientHeight * dpr;
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  };

  private animate = () => {
    this.time += 0.016 * this.speedMultiplier;
    this.gl.uniform1f(this.timeUniform, this.time);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);
    this.animationId = requestAnimationFrame(this.animate);
  };

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    window.removeEventListener("resize", this.resize);
  }
}
