import { nodeResolve } from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";

export default {
  input: "index.js",
  output: {
    dir: "dist",
  },
  plugins: [
    copy({
      targets: [{ src: "index.html", dest: "dist" }, { src: "theBall.png", dest: "dist" }, 
        { src: "ball2.png", dest: "dist" }, { src: "ball3.png", dest: "dist" },{ src: "styles.css", dest: "dist" },
        { src: "angry.png", dest: "dist" },{ src: "tired.png", dest: "dist" },{ src: "tooFast.png", dest: "dist" },
        { src: "HoopsTitle.png", dest: "dist"},{ src: "bgTitle.png", dest: "dist"},
        { src: "oof.mp3", dest: "dist"},{ src: "ouch.mp3", dest: "dist"},{ src: "ough.mp3", dest: "dist"},{ src: "uhhg.mp3", dest: "dist"},],
    }),
    nodeResolve(),
  ],
};