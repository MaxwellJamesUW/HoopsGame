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
        { src: "ball2.png", dest: "dist" }, { src: "ball3.png", dest: "dist" },{ src: "styles.css", dest: "dist" }],
    }),
    nodeResolve(),
  ],
};