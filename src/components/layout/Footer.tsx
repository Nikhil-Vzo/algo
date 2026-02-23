import { Heart } from 'lucide-react';
import { useEffect, useRef } from 'react';
import faceImg from '../../assets/images/face-1.png';
import './Footer.css';

export default function Footer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const faces = Array.from({ length: 20 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl");
        if (!gl) return;

        function resize() {
            if (!canvas || !gl) return;
            const rect = canvas.parentElement?.getBoundingClientRect();
            if (!rect) return;
            const d = window.devicePixelRatio || 1;
            canvas.width = rect.width * d;
            canvas.height = rect.height * d;
            canvas.style.width = rect.width + "px";
            canvas.style.height = rect.height + "px";
            gl.viewport(0, 0, canvas.width, canvas.height);
        }

        resize();
        window.addEventListener("resize", resize);

        const vert = `
            attribute vec2 pos;
            void main() {
              gl_Position = vec4(pos, 0.0, 1.0);
            }
        `;

        const frag = `
            precision highp float;

            uniform vec2 u_res;
            uniform float u_time;
            uniform float u_speed;

            void main() {
              vec2 FC = gl_FragCoord.xy;
              float t = u_time * u_speed;
              vec2 r = u_res;
              vec2 p = (FC * 2.0 - r) / r.y;
              
              p.y += 0.35;

              vec3 c = vec3(0.0);

              for (float i = 0.0; i < 42.0; i++) {
                float a = i / 1.5 + t * 0.5;

                vec2 q = p;
                q.x = q.x + sin(q.y * 19.0 + t * 2.0 + i) * 
                      29.0 * smoothstep(0.0, -2.0, q.y);

                float d = length(q - vec2(cos(a), sin(a)) * 
                                 (0.4 * smoothstep(0.0, 0.5, -q.y)));

                // Modified color values here: Pure solid heist red, made more subtle
                // Using AlgoStorm true red (#ff003c approximate)
                c = c + vec3(1.0, 0.0, 0.235) * (0.01 / d);
              }

              // Deepen the contrast and remove the 0.05 gray wash on the background
              vec3 col = c * c * c;
              gl_FragColor = vec4(col, 1.0);
            }
        `;

        function compile(src: string, type: number) {
            if (!gl) throw new Error("WebGL context lost");
            const s = gl.createShader(type);
            if (!s) throw new Error("Failed to create shader");
            gl.shaderSource(s, src);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
                const msg = gl.getShaderInfoLog(s);
                throw new Error(msg || "Shader compile error");
            }
            return s;
        }

        function link(vs: WebGLShader, fs: WebGLShader) {
            if (!gl) throw new Error("WebGL context lost");
            const p = gl.createProgram();
            if (!p) throw new Error("Failed to create program");
            gl.attachShader(p, vs);
            gl.attachShader(p, fs);
            gl.bindAttribLocation(p, 0, "pos");
            gl.linkProgram(p);
            if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
                throw new Error(gl.getProgramInfoLog(p) || "Program link error");
            }
            return p;
        }

        let program: WebGLProgram;
        try {
            const vs = compile(vert, gl.VERTEX_SHADER);
            const fs = compile(frag, gl.FRAGMENT_SHADER);
            program = link(vs, fs);
        } catch (e) {
            console.error(e);
            return;
        }

        gl.useProgram(program);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1, 3, -1, -1, 3
        ]), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

        const u_res = gl.getUniformLocation(program, "u_res");
        const u_time = gl.getUniformLocation(program, "u_time");
        const u_speed = gl.getUniformLocation(program, "u_speed");

        let start = performance.now();
        let animationFrameId: number;

        function draw() {
            if (!gl) return;
            const now = performance.now();
            const t = (now - start) * 0.001;

            gl.uniform2f(u_res, canvas!.width, canvas!.height);
            gl.uniform1f(u_time, t);
            gl.uniform1f(u_speed, 1.0);

            gl.drawArrays(gl.TRIANGLES, 0, 3);
            animationFrameId = requestAnimationFrame(draw);
        }

        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <footer className="footer">
            {/* ── Top Marquee Border (Crime Tape) ── */}
            <div className="footer__marquee-wrap">
                <div className="footer__marquee-strip">
                    <div className="footer__marquee-track">
                        {faces.map((_, i) => (
                            <div key={`a-${i}`} className="footer__marquee-face">
                                <img src={faceImg} alt="" className="footer__marquee-face-img" />
                            </div>
                        ))}
                        {faces.map((_, i) => (
                            <div key={`a2-${i}`} className="footer__marquee-face">
                                <img src={faceImg} alt="" className="footer__marquee-face-img" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <canvas ref={canvasRef} className="footer-glsl-canvas"></canvas>

            <div className="stacked-container relative-z">
                <div className="stacked">
                    {/* 5 stacked layers decreasing in height/opacity */}
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="stackedItem">
                            <em>ALGOSTORM 2.O</em>
                        </div>
                    ))}
                </div>
            </div>

            {/* Minimal Bottom Bar */}
            <div className="footer__bottom relative-z">
                <p className="footer__copy">
                    © 2026 AlgoStorm. Crafted with <Heart size={12} className="footer__heart" /> by La Resistencia.
                </p>
                <p className="footer__code">
                    <span className="footer__code-hash">#</span>AlgoStorm2026
                </p>
            </div>
        </footer>
    );
}
