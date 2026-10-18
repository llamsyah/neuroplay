import manifest from "../../public/models/brain-manifest.json";

export type Side = "both" | "left" | "right";
export type ViewMode = "whole" | "reveal" | "isolate";
export type SceneStats = { meshes: number; triangles: number; targetMeshes: number };

export { manifest };

export function isHippocampus(name: string, side: Side = "both") {
  const names: string[] = side === "both"
    ? [...manifest.hippocampusNodes.left, ...manifest.hippocampusNodes.right]
    : manifest.hippocampusNodes[side];
  return names.includes(name);
}

export function structureLabel(name: string, sourceLabel?: string) {
  const side = name.endsWith("_L") ? "Left" : name.endsWith("_R") ? "Right" : "";
  const readable = sourceLabel && sourceLabel !== "-"
    ? sourceLabel
    : name.replace(/^(Allen_|VH_M_)/, "").replace(/_[LR]$/, "").replaceAll("_", " ");
  return /^(left|right) /i.test(readable) ? readable : `${side} ${readable}`.trim();
}
